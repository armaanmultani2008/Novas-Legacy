/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const envVars = globalThis.process?.env || process.env;
const PORT = envVars.PORT || 3001;

app.use(cors());
app.use(express.json());

let adminPassword = "";

app.get('/', (req, res) => {
    res.json({ message: "Il backend di Nova's Legacy è online e funzionante! 🚀" });
});

app.get('/api/paypal-config', (req, res) => {
    const needsSetup = adminPassword === "";
    res.json({
        needsSetup: needsSetup,
        clientId: envVars.PAYPAL_CLIENT_ID || 'ID_PROVVISORIO'
    });
});

app.post('/api/admin/setup', (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({ ok: false, error: "La password deve contenere almeno 8 caratteri." });
    }
    adminPassword = password;
    res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (adminPassword === "") {
        return res.status(400).json({ error: "Esegui prima la configurazione iniziale." });
    }

    if (password === adminPassword) {
        const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Password errata' });
});

app.put('/api/admin/paypal-config', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non autorizzato' });
    }

    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});