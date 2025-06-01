const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../services/tokenService');
const { sendEmail } = require('../services/emailService');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Complete all fields');

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(401).json({ message: 'Email not found' });

        const user = results[0];
        if (!user.is_verified) return res.status(401).json({ message: 'Unverified email' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Incorrect password' });

        const token = generateToken({ userId: user.id_user }, '1h');
        res.json({ token, message: 'Login successful' });
    });
};

exports.createUser = async (req, res) => {
    const { username, name, lastname, email, password } = req.body;
    if (!username || !name || !lastname || !email || !password)
        return res.status(400).send('Complete all fields');

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const sql = 'INSERT INTO users (username, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [username, name, lastname, email, hashedPassword], (err) => {
            if (err) return res.status(500).send('Error registering user');

            const verificationToken = generateToken({ email }, '24h');
            const updateSql = 'UPDATE users SET verification_token = ? WHERE email = ?';
            db.query(updateSql, [verificationToken, email], async (err) => {
                if (err) return res.status(500).send('Error saving token');

                const verificationUrl = `https://storylinematch.com/verify-email?token=${verificationToken}`;
                await sendEmail(email, 'Email verification - StoryLineMatch', `Verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`);
                res.status(201).json({ message: 'User created. Check your email.' });
            });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.verifyEmail = (req, res) => {
    const { token } = req.query;
    try {
        const { email } = verifyToken(token);
        const sql = 'UPDATE users SET is_verified = TRUE WHERE email = ?';

        db.query(sql, [email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found or already verified' });

            res.json({ message: 'Email verified successfully' });
        });
    } catch {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.requestResetPassword = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(404).json({ message: 'Email not found' });

        const user = results[0];
        if (!user.is_verified) return res.status(401).json({ message: 'Verify your email first' });

        const resetToken = generateToken({ email }, '1h');
        const updateSql = 'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?';
        db.query(updateSql, [resetToken, email], async (err) => {
            if (err) return res.status(500).json({ message: 'Error saving token' });

            const resetUrl = `https://storylinematch.com/reset-password?token=${resetToken}`;
            await sendEmail(email, 'Password reset - StoryLineMatch', `Reset your password: <a href="${resetUrl}">${resetUrl}</a>`);
            res.status(200).json({ message: 'Reset link sent' });
        });
    });
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Missing fields' });

    try {
        const { email } = verifyToken(token);
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        const sql = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ? AND reset_token = ?';

        db.query(sql, [hashedPassword, email, token], (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (result.affectedRows === 0) return res.status(400).json({ message: 'Invalid token' });

            res.status(200).json({ message: 'Password updated' });
        });
    } catch {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
