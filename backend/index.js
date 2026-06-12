/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // 1. Aggiunto bcryptjs per la sicurezza delle password
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMS_FILE      = path.join(__dirname, 'cms.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');
const CONTENT_FILE  = path.join(__dirname, 'content.json');

const CMS_DEFAULTS = { blog: [], products: [], animals: [] };

// ── In-memory store (loaded from MongoDB or local files at startup) ───────────
let _db       = null;
let _cms      = { ...CMS_DEFAULTS };
let _settings = {};
let _content  = null;

function _asyncSave(key, data) {
    if (_db) {
        _db.collection('store')
            .replaceOne({ _id: key }, { _id: key, ...data }, { upsert: true })
            .catch(err => console.error(`[DB] write ${key} failed:`, err));
    } else {
        const fileMap = { cms: CMS_FILE, settings: SETTINGS_FILE, content: CONTENT_FILE };
        try { fs.writeFileSync(fileMap[key], JSON.stringify(data, null, 2), 'utf-8'); }
        catch (e) { console.error(`[FS] write ${key} failed:`, e); }
    }
}

function readCMS()           { return _cms; }
function writeCMS(data)      { _cms = data;      _asyncSave('cms', data); }
function readSettings()      { return _settings; }
function writeSettings(data) { _settings = data; _asyncSave('settings', data); }
function readContent()       { return _content;  }
function writeContent(data)  { _content = data;  _asyncSave('content', data); }

async function initDB() {
    const uri = (globalThis.process?.env || process.env).MONGODB_URI;
    if (uri) {
        try {
            const client = new MongoClient(uri);
            await client.connect();
            _db = client.db('novas-legacy');
            const docs = await _db.collection('store').find({ _id: { $in: ['cms', 'settings', 'content'] } }).toArray();
            for (const doc of docs) {
                const { _id, ...data } = doc;
                if (_id === 'cms')      _cms      = data;
                if (_id === 'settings') _settings = data;
                if (_id === 'content')  _content  = data;
            }
            console.log('[DB] Connesso a MongoDB Atlas');
        } catch (err) {
            console.error('[DB] Connessione fallita, fallback su filesystem:', err.message);
        }
    } else {
        console.warn('[DB] MONGODB_URI non impostata — uso filesystem locale');
        try { _cms      = JSON.parse(fs.readFileSync(CMS_FILE,      'utf-8')); } catch { /* usa default */ }
        try { _settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')); } catch { /* usa default */ }
        try { _content  = JSON.parse(fs.readFileSync(CONTENT_FILE,  'utf-8')); } catch { /* usa default */ }
    }
}

dotenv.config();
const app = express();
const envVars = globalThis.process?.env || process.env;
const PORT = envVars.PORT || 3001;
const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// ── Nodemailer (Gmail App Password) ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: envVars.EMAIL_USER,
        pass: envVars.EMAIL_PASS,
    },
});

async function sendAdoptionWelcome(toEmail, toName, animalName, animalSpecies, monthlyEur) {
    if (!envVars.EMAIL_USER || !envVars.EMAIL_PASS) return;
    await transporter.sendMail({
        from: `"Nova's Legacy" <${envVars.EMAIL_USER}>`,
        to: toEmail,
        subject: `Benvenuto nella famiglia di ${animalName} — Nova's Legacy`,
        html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#C8880A">Grazie, ${toName || 'nuovo adottante'}!</h2>
        <p>Hai appena adottato simbolicamente <strong>${animalName}</strong> (${animalSpecies}) a Nova's Legacy.</p>
        <p>Il tuo contributo di <strong>€${monthlyEur}/mese</strong> va direttamente alle cure quotidiane di ${animalName}.</p>
        <p>Riceverai aggiornamenti mensili con foto e notizie dal campo. Per domande scrivi a
           <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>.</p>
        <p>Per gestire o disdire il tuo abbonamento in qualsiasi momento, usa il link che trovi
           nella sezione "Gestisci adozione" su <a href="https://novaslegacy.co.za">novaslegacy.co.za</a>.</p>
        <p style="margin-top:2rem;font-size:0.85rem;color:#888">Nova's Legacy — Bela-Bela, Limpopo, South Africa</p>
      </div>`,
    });
}

async function notifyKim(toName, toEmail, animalName, monthlyEur) {
    if (!envVars.EMAIL_USER || !envVars.EMAIL_PASS) return;
    await transporter.sendMail({
        from: `"Nova's Legacy System" <${envVars.EMAIL_USER}>`,
        to: envVars.EMAIL_TO || 'kim@novaslegacy.co.za',
        subject: `Nuova adozione: ${animalName} da ${toName || toEmail}`,
        html: `
      <div style="font-family:sans-serif;max-width:480px">
        <h3>Nuova adozione simbolica</h3>
        <ul>
          <li><strong>Animale:</strong> ${animalName}</li>
          <li><strong>Adottante:</strong> ${toName || '—'}</li>
          <li><strong>Email:</strong> ${toEmail}</li>
          <li><strong>Importo:</strong> €${monthlyEur}/mese</li>
        </ul>
        <p>Puoi vedere tutti i dettagli nel <a href="https://dashboard.stripe.com">Dashboard Stripe</a>.</p>
      </div>`,
    });
}

app.use(cors());
app.use(express.json());

// Diventano hash di sicurezza gestiti con bcrypt
let adminPasswordHash = "";
let adminRecoveryKey = "";

app.get('/', (req, res) => {
    res.json({ message: "Il backend di Nova's Legacy è online e funzionante!" });
});

app.get('/ping', (_req, res) => res.send('pong'));

app.get('/api/paypal-config', (req, res) => {
    const needsSetup = adminPasswordHash === "";
    res.json({
        needsSetup: needsSetup,
        clientId: envVars.PAYPAL_CLIENT_ID || 'ID_PROVVISORIO'
    });
});

// 2. Modificato il setup per salvare la password in modo sicuro con l'hash
app.post('/api/admin/setup', async (req, res) => {
    const { password, recoveryKey } = req.body;
    if (adminPasswordHash) {
        return res.status(400).json({ ok: false, error: "Setup già completato." });
    }
    if (!password || password.length < 8) {
        return res.status(400).json({ ok: false, error: "La password deve contenere almeno 8 caratteri." });
    }
    if (!recoveryKey || recoveryKey.trim().length < 3) {
        return res.status(400).json({ ok: false, error: "Inserisci una parola chiave di recupero (min. 3 caratteri)." });
    }

    adminPasswordHash = await bcrypt.hash(password, 10);
    adminRecoveryKey = recoveryKey.trim();
    writeSettings({ ...readSettings(), adminPasswordHash: adminPasswordHash, recoveryKey: adminRecoveryKey });
    res.json({ ok: true });
});

// 3. Modificato il login per confrontare l'hash memorizzato tramite bcrypt.compare
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;

    if (!adminPasswordHash) {
        return res.status(400).json({ error: "Esegui prima la configurazione iniziale." });
    }

    const valid = await bcrypt.compare(password || '', adminPasswordHash);
    if (valid) {
        const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Password errata' });
});

// 4. Modificato il recupero password per aggiornare l'hash crittografato
app.post('/api/admin/recover', async (req, res) => {
    const { recoveryKey, newPassword } = req.body;
    if (!adminRecoveryKey) {
        return res.status(400).json({ error: "Nessuna parola chiave impostata. Contatta l'amministratore." });
    }
    if (recoveryKey?.trim() !== adminRecoveryKey) {
        return res.status(401).json({ error: 'Parola chiave errata.' });
    }
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'La nuova password deve avere almeno 8 caratteri.' });
    }

    adminPasswordHash = await bcrypt.hash(newPassword, 10);
    writeSettings({ ...readSettings(), adminPasswordHash: adminPasswordHash });
    const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
    res.json({ ok: true, token });
});

app.put('/api/admin/paypal-config', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non autorizzato' });
    }

    res.json({ ok: true });
});

// ── Stripe: abbonamento adozione ─────────────────────────────────────────────
app.post('/api/stripe/subscribe', async (req, res) => {
    const { animalName, animalSpecies, price } = req.body;
    if (!animalName || !price) return res.status(400).json({ error: 'Dati mancanti' });
    const origin = req.headers.origin || 'http://localhost:5174';
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Adozione ${animalName} — Nova's Legacy`,
                        description: `Contributo mensile per il benessere di ${animalName} (${animalSpecies})`,
                    },
                    unit_amount: Math.round(price * 100),
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }],
            metadata: { animalName, animalSpecies, monthlyEur: String(price) },
            billing_address_collection: 'required',
            success_url: `${origin}/?adoption=success&animal=${encodeURIComponent(animalName)}`,
            cancel_url: `${origin}/`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Stripe: customer portal (gestione / disdetta) ────────────────────────────
app.post('/api/stripe/portal', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email richiesta' });
    const origin = req.headers.origin || 'http://localhost:5174';
    try {
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (!customers.data.length) {
            return res.status(404).json({ error: 'Nessun abbonamento trovato per questa email.' });
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: origin,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Stripe: webhook (manda email quando abbonamento confermato) ───────────────
app.post('/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const secret = eventVars.STRIPE_WEBHOOK_SECRET;
        let event;
        try {
            event = secret
                ? stripe.webhooks.constructEvent(req.body, sig, secret)
                : JSON.parse(req.body.toString());
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }

        if (event.type === 'checkout.session.completed') {
            const s = event.data.object;
            if (s.mode === 'subscription') {
                const animalName = s.metadata?.animalName || '—';
                const animalSpecies = s.metadata?.animalSpecies || '—';
                const monthlyEur = s.metadata?.monthlyEur || '—';
                const adopterEmail = s.customer_details?.email || s.customer_email || '';
                const adopterName = s.customer_details?.name || '';
                await Promise.all([
                    sendAdoptionWelcome(adopterEmail, adopterName, animalName, animalSpecies, monthlyEur),
                    notifyKim(adopterName, adopterEmail, animalName, monthlyEur),
                ]);
            }
        }
        res.json({ received: true });
    }
);

// ── Stripe: checkout shop ─────────────────────────────────────────────────────
app.post('/api/stripe/checkout', async (req, res) => {
    const { name, price, quantity = 1 } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Dati prodotto mancanti' });
    }

    const origin = req.headers.origin || 'http://localhost:5174';

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: { name: `Nova's Legacy — ${name}` },
                    unit_amount: Math.round(price * 100),
                },
                quantity,
            }],
            success_url: `${origin}/?payment=success`,
            cancel_url: `${origin}/?payment=cancel`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Contact form → email a Kim ────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    const { name, surname, email, phone, reason, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Nome ed email richiesti' });
    if (!envVars.EMAIL_USER || !envVars.EMAIL_PASS) {
        return res.status(503).json({ error: 'Email non configurata sul server' });
    }
    try {
        await transporter.sendMail({
            from: `"Nova's Legacy Form" <${envVars.EMAIL_USER}>`,
            to: 'armaanmultani2008@gmail.com',
            replyTo: email,
            subject: `Nuovo contatto: ${reason || 'Richiesta generica'} — ${name} ${surname || ''}`.trim(),
            html: `
        <div style="font-family:sans-serif;max-width:520px;color:#111">
          <h3 style="color:#C8880A">Nuovo messaggio dal sito Nova's Legacy</h3>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 12px;font-weight:bold">Nome</td><td style="padding:6px 12px">${name} ${surname || ''}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold">Telefono</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Motivo</td><td style="padding:6px 12px">${reason || '—'}</td></tr>
          </table>
          <div style="margin-top:1rem;padding:1rem;background:#fafafa;border-left:3px solid #C8880A">
            <p style="margin:0;white-space:pre-wrap">${message || '(nessun messaggio)'}</p>
          </div>
          <p style="margin-top:1.5rem;font-size:0.8rem;color:#999">Inviato tramite novaslegacy.co.za</p>
        </div>`,
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── CMS: middleware auth ──────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Non autorizzato' });
    try {
        jwt.verify(auth.slice(7), envVars.JWT_SECRET || 'dev_secret');
        next();
    } catch {
        res.status(401).json({ error: 'Token non valido' });
    }
}

// 5. Modificato il cambio password interno all'admin panel per supportare bcrypt.compare e bcrypt.hash
app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
    const { current, newPassword, newRecoveryKey } = req.body;
    const isPasswordValid = await bcrypt.compare(current, adminPasswordHash);
    if (!isPasswordValid) return res.status(401).json({ error: 'Password attuale errata.' });
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ error: 'Almeno 8 caratteri.' });

    adminPasswordHash = await bcrypt.hash(newPassword, 10);
    const updates = { adminPasswordHash: adminPasswordHash };
    if (newRecoveryKey?.trim().length >= 3) {
        adminRecoveryKey = newRecoveryKey.trim();
        updates.recoveryKey = adminRecoveryKey;
    }
    writeSettings({ ...readSettings(), ...updates });
    res.json({ ok: true });
});

// ── Contenuto sito (testi) ────────────────────────────────────────────────────
app.get('/api/content', (_req, res) => {
    res.json(readContent() || {});
});
app.put('/api/content', requireAdmin, (req, res) => {
    writeContent(req.body);
    res.json({ ok: true });
});

// ── CMS: lettura pubblica ─────────────────────────────────────────────────────
app.get('/api/cms', (_req, res) => {
    res.json(readCMS());
});

// ── CMS: salvataggio blog ─────────────────────────────────────────────────────
app.put('/api/cms/blog', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.blog = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

// ── CMS: salvataggio prodotti ─────────────────────────────────────────────────
app.put('/api/cms/products', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.products = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

// ── CMS: salvataggio animali ──────────────────────────────────────────────────
app.put('/api/cms/animals', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.animals = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

initDB().then(() => {
    // Gestisce la retrocompatibilità (se prima avevi una password in chiaro, diventerà l'hash al prossimo cambio/salvataggio)
    adminPasswordHash = _settings.adminPasswordHash || _settings.adminPassword || envVars.ADMIN_PASSWORD || "";
    adminRecoveryKey  = _settings.recoveryKey   || "";
    app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));
}).catch(err => {
    console.error('[FATAL] Inizializzazione fallita:', err);
    process.exit(1);
});