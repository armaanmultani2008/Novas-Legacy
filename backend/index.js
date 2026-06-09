/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Il backend di Nova's Legacy è online e funzionante! 🚀" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password123') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
        return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: 'Credenziali non valide' });
});

app.get('/api/config/paypal', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'ID_PROVVISORIO' });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});