const db = require('../config/db');

exports.getUserInfo = (req, res) => {
    const userId = req.id_user;

    const sql = 'SELECT username, name, lastname, email, created_at FROM users WHERE id_user = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).send('Server error');
        if (result.length === 0) return res.status(404).send('User not found');
        res.json(result[0]);
    });
};

exports.getStoryHistory = (req, res) => {
    const userId = req.id_user;
    const sql = 'SELECT query, movies_data FROM story_history WHERE id_user = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send('Error retrieving history');
        res.json(results);
    });
};

exports.insertStoryHistory = (req, res) => {
    const userId = req.id_user;
    const { query, movies_data } = req.body;
    const sql = 'INSERT INTO story_history (id_user, query, movies_data) VALUES (?, ?, ?)';
    db.query(sql, [userId, query, movies_data], (err) => {
        if (err) return res.status(500).send('Insert error');
        res.status(201).json({ message: 'Inserted' });
    });
};

exports.getFavorites = (req, res) => {
    const userId = req.id_user;
    const sql = 'SELECT movie_data FROM favorite_movies WHERE id_user = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).send('Error retrieving favorites');
        res.status(200).json(result);
    });
};

exports.insertFavorite = (req, res) => {
    const userId = req.id_user;
    const { title, movieData } = req.body;

    const checkSql = 'SELECT * FROM favorite_movies WHERE id_user = ? AND title = ?';
    db.query(checkSql, [userId, title], (checkErr, result) => {
        if (result.length > 0) return res.status(409).json({ message: 'Already exists' });

        const insertSql = 'INSERT INTO favorite_movies (id_user, title, movie_data) VALUES (?, ?, ?)';
        db.query(insertSql, [userId, title, movieData], (err) => {
            if (err) return res.status(500).send('Insert error');
            res.status(201).json({ message: 'Added' });
        });
    });
};

exports.deleteFavorite = (req, res) => {
    const userId = req.id_user;
    const title = req.params.title;
    const sql = 'DELETE FROM favorite_movies WHERE id_user = ? AND title = ?';
    db.query(sql, [userId, title], (err, result) => {
        if (err) return res.status(500).send('Delete error');
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: 'Deleted' });
    });
};
