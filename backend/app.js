const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Después de crear la app de Express
app.use(cors());

app.use(express.json());

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

/* const corsOptions = {
  origin: 'http://localhost:4200', // Reemplaza con el origen de tu frontend
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); */

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


const mysql = require('mysql');

const jwtSecret = process.env.JWT_SECRET;

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
    /* res.send('Database connected!'); */
});

// No olvides exportar la conexión si la vas a usar en otros archivos
module.exports = db;


// endpoint to create users

app.post('/create-user', async (req, res) => {
  const { username, password, email } = req.body;

  // Validación básica
  if (!username || !password || !email) {
      return res.status(400).send('Please, complete all fields');
  }

  try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 8);

      // Insertar el nuevo usuario en la base de datos
      const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
      db.query(sql, [username, hashedPassword, email], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error al registrar el usuario');
          }
          res.status(201).json({ message:'Usuario registrado con éxito' });
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});

// end point to login

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
          return res.status(401).json({ message:'Usuario no encontrado'});
      }

      const user = results[0];

      try {
          if (await bcrypt.compare(password, user.password)) {
            // Usuario autenticado con éxito
            // Aquí puedes generar un token o una sesión según tu necesidad
            /* res.send('Login exitoso'); */
            
            // Usuario autenticado con éxito
            const token = jwt.sign(
                { userId: user.id }, // Payload
                jwtSecret,  // Clave secreta
                { expiresIn: '1h' }  // Opciones, como la caducidad
            );

            res.json({ message: 'Login exitoso' });
            res.json({ token });
          } else {
              // Contraseña incorrecta
              res.status(401).json({ message: 'Contraseña incorrecta'});
          }
      } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error en el servidor'});
      }
  });



});