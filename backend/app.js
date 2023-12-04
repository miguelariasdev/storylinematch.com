const express = require('express');
const axios = require('axios');
const https = require('https');
const OpenAI = require('openai').default;
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos');
});

// Clave secreta para JWT
const jwtSecret = process.env.JWT_SECRET;

// Ruta raíz para verificar que el backend está funcionando
app.get('/', (req, res) => {
    res.send('Backend está funcionando!');
});

// Endpoint para crear usuarios
app.post('/create-user', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).send('Please, complete all fields');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al registrar el usuario');
            }
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Por favor, completa todos los campos');
    }
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el servidor');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const user = results[0];
        try {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ userId: user.id_user }, jwtSecret, { expiresIn: '1h' });
                res.json({ token, message: 'Login exitoso' });
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
});


// Endpoint para generar respuesta de OpenAI
app.post('/generate-response', async (req, res) => {

    const prompt = `
    You are a movie expert.
    I am going to give you a description of a story and I want you to give me a list of 10 movies that most closely resemble the story I am going to give you.
    Give me only one json, I don't want any message before or after it.
    Your input will always be a story of a movie if you think that what the user provides you is not related or is not a story from a movie just send me back this:
    
    {
    "error" : "The input provided does not appear to be a movie story."
    }
    
    your output must always be in valid JSON format like this: 
    
    movie_list: [
        {
          title: "",
          release_year: ""
        }
    input: I want movies about ` + req.body.prompt;

    if (!prompt) {
        return res.status(400).send('No prompt provided');
    }
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error al llamar a OpenAI:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/search-movie', (req, res) => {
    const { title, year } = req.query;
    rapidAPIKey = process.env.RAPID_API_KEY

    if (!title || !year) {
        return res.status(400).send('Debe proporcionar un título y un año.');
    }

    const encodedTitle = encodeURIComponent(title);
    const options = {
        method: 'GET',
        hostname: 'moviesdatabase.p.rapidapi.com',
        port: null,
        path: `/titles/search/title/${encodedTitle}?exact=true&info=base_info&year=${year}&titleType=movie`,
        headers: {
            'X-RapidAPI-Key': rapidAPIKey,
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }

        
    };

    const reqApi = https.request(options, function (resApi) {
        const chunks = [];

        resApi.on('data', function (chunk) {
            chunks.push(chunk);
        });

        resApi.on('end', function () {
            const body = Buffer.concat(chunks);
            res.send(body.toString());
        });
    });

    reqApi.on('error', function(e) {
        console.error(`problem with request: ${e.message}`);
        res.status(500).send(e.message);
    });

    reqApi.end();
});

const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado de la solicitud
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.sendStatus(401); // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.sendStatus(403); // Token no válido o expirado
        }
        req.id_user = decodedToken.userId;
        next();
    });
};

module.exports = authenticateToken;

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// insertar historia de busqueda en el historial
// a traves del authenticate desciframos el id del usuario

app.post('/insert-story-history', authenticateToken, (req, res) => {
    const idUser = req.id_user; // Obtiene el id_user del middleware
    const { query, movies_data } = req.body;

    const sql = 'INSERT INTO story_history (id_user, query, movies_data) VALUES (?, ?, ?)';
    db.query(sql, [idUser, query, movies_data], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al insertar en la base de datos');
        }
        res.status(201).json({ message: 'Historia insertada con éxito' });
    });
});

app.get('/get-story-history', authenticateToken, (req, res) => {
    const idUser = req.id_user; // Asume que este es el ID del usuario obtenido del token

    const sql = 'SELECT movies_data, query FROM story_history WHERE id_user = ?';
    db.query(sql, [idUser], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al recuperar las historias');
        }
        res.json(results);
    });
});
