/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMS_FILE  = path.join(__dirname, 'cms.json');

const CMS_DEFAULTS = { blog: [], products: [], animals: [] };

// ── In-memory store (caricato da MongoDB o dal file locale all'avvio) ───────────
let _db       = null;
let _cms      = { ...CMS_DEFAULTS };

function _asyncSave(data) {
    if (_db) {
        _db.collection('store')
            .replaceOne({ _id: 'cms' }, { _id: 'cms', ...data }, { upsert: true })
            .catch(err => console.error(`[DB] Scrittura cms su Atlas fallita:`, err));
    } else {
        try {
            fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
        } catch (e) {
            console.error(`[FS] Scrittura cms.json locale fallita:`, e);
        }
    }
}

function readCMS()      { return _cms; }
function writeCMS(data) { _cms = data; _asyncSave(data); }

function loadLocalFallback() {
    try {
        if (fs.existsSync(CMS_FILE)) {
            _cms = JSON.parse(fs.readFileSync(CMS_FILE, 'utf-8'));
            console.log(`[FILE] Letto cms.json locale con successo. Prodotti: ${_cms.products?.length || 0}, Animali: ${_cms.animals?.length || 0}`);
        }
    } catch (e) {
        console.error("[FILE] Errore lettura cms.json locale:", e);
    }
}

async function initDB() {
    const envVars = globalThis.process?.env || process.env;
    const uri = envVars.MONGODB_URI;

    loadLocalFallback();

    if (uri) {
        try {
            const client = new MongoClient(uri);
            await client.connect();
            _db = client.db('novas-legacy');

            const doc = await _db.collection('store').findOne({ _id: 'cms' });

            if (doc) {
                const { _id, ...atlasData } = doc;
                _cms = { ..._cms, ...atlasData };
                console.log('[DB] Successfully connected to MongoDB Atlas and synchronized data.');
                await _db.collection('store').replaceOne({_id:'cms'}, {_id:'cms', ..._cms}, { upsert: true });
            } else {
                console.log('[DB] Successfully connected to MongoDB Atlas. CMS file not found. Starting migration process of local cms.json...');
                await _db.collection('store').replaceOne({ _id: 'cms' }, { _id: 'cms', ..._cms }, { upsert: true });
                console.log('[DB] Migration completed successfully: local data is now secure on MongoDB Atlas.');
            }

        } catch (err) {
            console.error('[DB] Connection to MongoDB Atlas failed. Emergency local fallback:', err.message);
        }
    } else {
        console.warn('[DB] MONGODB_URI not found in ENV.');
    }
}

dotenv.config();
const app = express();
const envVars = globalThis.process?.env || process.env;
const PORT = envVars.PORT || 3001;
const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

const PRINTFUL_BASE = 'https://api.printful.com';
const printfulGet = (path) =>
    fetch(`${PRINTFUL_BASE}${path}`, {
        headers: { 'Authorization': `Bearer ${envVars.PRINTFUL_API_KEY}` },
    }).then(r => r.json());

// ── Brevo (HTTP API — Mittente dinamico da Render) ───────────────────────────
const EMAIL_FROM_NAME = "Nova's Legacy";
const EMAIL_FROM_ADDR = envVars.EMAIL_FROM || 'armaanmultani2008@gmail.com';

async function sendEmail({ to, subject, html, replyTo }) {
    if (!envVars.BREVO_API_KEY) { console.warn('[email] BREVO_API_KEY not set'); return; }
    const body = {
        sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDR },
        to: [{ email: to }],
        subject,
        htmlContent: html,
    };
    if (replyTo) body.replyTo = { email: replyTo };
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': envVars.BREVO_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(err));
    }
}

async function sendAdoptionWelcome(toEmail, toName, animalName, animalSpecies, monthlyEur) {
    await sendEmail({
        to: toEmail,
        subject: `Welcome to ${animalName}'s family — Nova's Legacy`,
        html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#C8880A">Thank you, ${toName || 'new supporter'}!</h2>
        <p>You have symbolically adopted <strong>${animalName}</strong> (${animalSpecies}) at Nova's Legacy.</p>
        <p>Your contribution of <strong>€${monthlyEur}/month</strong> goes directly towards ${animalName}'s daily care.</p>
        <p>You will receive monthly updates with photos and news from the reserve. For any questions, write to
           <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>.</p>
        <p>To manage or cancel your adoption at any time, use the "Manage adoption" link on our website.</p>
        <p style="margin-top:2rem;font-size:0.85rem;color:#888">Nova's Legacy — Bela-Bela, Limpopo, South Africa</p>
      </div>`,
    });
}

async function notifyKimAdoption(toName, toEmail, animalName, monthlyEur) {
    await sendEmail({
        to: envVars.EMAIL_TO || 'kim@novaslegacy.co.za',
        subject: `New adoption: ${animalName} by ${toName || toEmail}`,
        html: `
      <div style="font-family:sans-serif;max-width:480px">
        <h3>New symbolic adoption</h3>
        <ul>
          <li><strong>Animal:</strong> ${animalName}</li>
          <li><strong>Adopter:</strong> ${toName || '—'}</li>
          <li><strong>Email:</strong> ${toEmail}</li>
          <li><strong>Amount:</strong> €${monthlyEur}/month</li>
        </ul>
        <p>See full details in your <a href="https://dashboard.stripe.com">Stripe Dashboard</a>.</p>
      </div>`,
    });
}

async function sendOrderConfirmation(toEmail, toName, productName, amount) {
    await sendEmail({
        to: toEmail,
        subject: `Your order is confirmed — Nova's Legacy`,
        html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#C8880A">Thank you for your order, ${toName || 'friend'}!</h2>
        <p>We have received your order for <strong>${productName}</strong> (€${(amount / 100).toFixed(2)}).</p>
        <p>Printful will print and ship your item directly to you. You will receive a shipping confirmation with tracking once it's on its way.</p>
        <p>For any questions about your order, write to <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>.</p>
        <p style="margin-top:2rem;font-size:0.85rem;color:#888">Nova's Legacy — Bela-Bela, Limpopo, South Africa</p>
      </div>`,
    });
}

app.use(cors());
app.use((req, res, next) => {
    if (req.path === '/api/stripe/webhook') return next();
    express.json()(req, res, next);
});

let adminPasswordHash = envVars.ADMIN_PASSWORD_HASH || "";
let adminRecoveryKey  = envVars.ADMIN_RECOVERY_KEY  || "nova_backup";

async function initAuth() {
    if (!adminPasswordHash && envVars.ADMIN_PASSWORD) {
        adminPasswordHash = await bcrypt.hash(envVars.ADMIN_PASSWORD, 10);
        console.log('[AUTH] Hash generato da ADMIN_PASSWORD. Imposta ADMIN_PASSWORD_HASH su Render per renderlo permanente.');
    }
}

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

app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    if (!adminPasswordHash) {
        return res.status(400).json({ error: "Configura l'ADMIN_PASSWORD_HASH nel file .env di Render." });
    }
    const valid = await bcrypt.compare(password || '', adminPasswordHash);
    if (valid) {
        const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ error: 'Password errata' });
});

app.post('/api/admin/setup', async (req, res) => {
    if (adminPasswordHash) {
        return res.status(400).json({ error: 'Setup già completato.' });
    }
    const { password, recoveryKey } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    adminPasswordHash = await bcrypt.hash(password, 10);
    if (recoveryKey?.trim()) adminRecoveryKey = recoveryKey.trim();
    const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
    res.json({ ok: true, token });
});

app.post('/api/admin/recover', async (req, res) => {
    const { recoveryKey, newPassword } = req.body;
    if (!adminRecoveryKey) {
        return res.status(400).json({ error: "Nessuna parola chiave impostata nelle variabili d'ambiente." });
    }
    if (recoveryKey?.trim() !== adminRecoveryKey) {
        return res.status(401).json({ error: 'Parola chiave errata.' });
    }
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'La nuova password deve avere almeno 8 caratteri.' });
    }
    adminPasswordHash = await bcrypt.hash(newPassword, 10);
    const token = jwt.sign({ role: 'admin' }, envVars.JWT_SECRET || 'secret_provvisorio', { expiresIn: '1h' });
    res.json({ ok: true, token });
});

app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
    const { current, newPassword, newRecoveryKey } = req.body;
    if (!adminPasswordHash) {
        return res.status(400).json({ error: 'Nessuna password impostata.' });
    }
    const valid = await bcrypt.compare(current || '', adminPasswordHash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });
    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }
    adminPasswordHash = await bcrypt.hash(newPassword, 10);
    if (newRecoveryKey?.trim().length >= 3) adminRecoveryKey = newRecoveryKey.trim();
    res.json({ ok: true });
});

app.put('/api/admin/paypal-config', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non autorizzato' });
    }
    res.json({ ok: true });
});

app.post('api/admin/blacklist-by-log', requireAdmin, async (req, res) => {
    const {logId} = req.body;
    if(!logId) return res.status(400).json({error:"ID del log richiesto."});
    if(!_db) return res.status(503).json({error:"Database non connesso."});

    try{
        const log = await _db.collection('contact_logs').findOne({_id: new ObjectId(logId)});
        if(!log){
            return res.status(404).json({error:"Message Code not found in server log."})
        }
        const targetIp = log.ip;
        if(!targetIp){
            return res.status(400).json({error:"No valid IP address found in this log."})
        }
        await _db.collection('blacklist').updateOne(
            { value: targetIp, type: 'ip' },
            { $set: { value: targetIp, type: 'ip', bannedAt: new Date(), reason: `Banned via log ID ${logId}` } },
            { upsert: true }
        );

        console.log(`[SECURITY] IP address ${targetIp} successfully banned using Log ID automation: ${logId}`);

        res.json({ ok: true, message: `IP adress (${targetIp}) has been inserted in the blacklist successfully.` });

    } catch (err) {
        console.error('[SECURITY] Blacklist automation process Error:', err.message);
        res.status(500).json({ error: "Errore interno del server durante il blocco." });
    }
})

// ── Printful: debug risposta grezza ──────────────────────────────────────────
app.get('/api/printful/debug', async (_req, res) => {
    try {
        const raw = await printfulGet('/store/products');
        res.json(raw);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Printful: prodotti dello store ───────────────────────────────────────────
app.get('/api/printful/products', async (_req, res) => {
    try {
        const raw = await printfulGet('/store/products');
        const list = Array.isArray(raw.result) ? raw.result : raw.result?.sync_products ?? [];
        if (!list.length) return res.json([]);

        const products = await Promise.all(list.map(async (p) => {
            const { result } = await printfulGet(`/store/products/${p.id}`);
            const sp = result.sync_product;
            return {
                id: sp.id,
                name: sp.name,
                thumbnail: sp.thumbnail_url,
                variants: result.sync_variants.map(v => ({
                    id: v.id,
                    name: v.name,
                    price: parseFloat(v.retail_price),
                    size: v.size || null,
                })),
            };
        }));

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

// ── Stripe Webhook ───────────────────────────────────────────────────────────
app.post('/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const secret = envVars.STRIPE_WEBHOOK_SECRET;
        let event;
        try {
            event = secret
                ? stripe.webhooks.constructEvent(req.body, sig, secret)
                : JSON.parse(req.body.toString());
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ received: true });
        console.log('[webhook] event received:', event.type);

        if (event.type === 'checkout.session.completed') {
            const s = await stripe.checkout.sessions.retrieve(event.data.object.id);
            console.log('[webhook] session mode:', s.mode, '| variantId:', s.metadata?.variantId, '| email:', s.customer_details?.email);

            // FLUSSO ABBONAMENTI ADOZIONE
            if (s.mode === 'subscription') {
                const animalName = s.metadata?.animalName || '—';
                const animalSpecies = s.metadata?.animalSpecies || '—';
                const monthlyEur = s.metadata?.monthlyEur || '—';
                const adopterEmail = s.customer_details?.email || s.customer_email || '';
                const adopterName = s.customer_details?.name || '';
                await Promise.all([
                    sendAdoptionWelcome(adopterEmail, adopterName, animalName, animalSpecies, monthlyEur),
                    notifyKimAdoption(adopterName, adopterEmail, animalName, monthlyEur),
                ]);
            }

            // FLUSSO SHOP PRODOTTI (PRINTFUL)
            if (s.mode === 'payment' && s.metadata?.variantId) {
                const variantId = parseInt(s.metadata.variantId);
                const qty = parseInt(s.metadata.quantity || '1');
                const addr = s.shipping_details?.address || s.shipping?.address || s.customer_details?.address || null;
                const recipientName = s.shipping_details?.name || s.customer_details?.name || '';
                const customerEmail = s.customer_details?.email || '';
                const productName = s.metadata?.productName || 'Nova\'s Legacy product';
                const amount = s.amount_total || 0;

                let printfulOk = false;
                if (addr && envVars.PRINTFUL_API_KEY) {
                    try {
                        const pfRes = await fetch(`${PRINTFUL_BASE}/orders`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${envVars.PRINTFUL_API_KEY}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                recipient: {
                                    name: recipientName,
                                    address1: addr.line1,
                                    address2: addr.line2 || '',
                                    city: addr.city,
                                    state_code: addr.state || '',
                                    country_code: addr.country,
                                    zip: addr.postal_code,
                                    email: customerEmail,
                                },
                                items: [{ sync_variant_id: variantId, quantity: qty }],
                            }),
                        });
                        printfulOk = pfRes.ok;
                        if (!pfRes.ok) {
                            const pfErr = await pfRes.json().catch(() => ({}));
                            console.error('Printful order error:', pfErr);
                        }
                    } catch (err) {
                        console.error('Printful order error:', err.message);
                    }
                }

                // Invio email SOLO al cliente (Kim riceve già la notifica automatica da Printful)
                console.log('[webhook] sending confirmation email to customer:', customerEmail);
                try {
                    await sendOrderConfirmation(customerEmail, recipientName, productName, amount);
                    console.log('[webhook] customer email sent OK');
                } catch (emailErr) {
                    console.error('[webhook] customer email error:', emailErr.message);
                }

                if (!printfulOk) {
                    console.error(`ALERT: Printful order FAILED for Stripe session ${s.id} — manual action required`);
                }
            }
        }
    }
);

app.post('/api/stripe/checkout', async (req, res) => {
    const { name, price, quantity = 1, variantId } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Dati prodotto mancanti' });
    }
    const origin = req.headers.origin || 'http://localhost:5174';
    try {
        const sessionData = {
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
        };

        if (variantId) {
            sessionData.shipping_address_collection = {
                allowed_countries: ['AT','AU','BE','CA','CH','CZ','DE','DK','ES','FI','FR','GB','GR','HU','IE','IT','JP','NL','NO','NZ','PL','PT','RO','SE','SG','SK','US','ZA'],
            };
            sessionData.metadata = { variantId: String(variantId), quantity: String(quantity), productName: name };
        }

        const session = await stripe.checkout.sessions.create(sessionData);
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Modulo Contatti
app.post('/api/contact', async (req, res) => {
    const { name, surname, email, phone, reason, message, turnstileToken } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

    const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
    if(_db){
        try{
            const isBlackListed = await _db.collection('blacklist').findOne({
                $or:[
                    {value: clientIP, type: 'ip'},
                    {value: email.toLowerCase().trim(), type: 'email'}
                ]
            });
            if(isBlackListed){
                console.warn(`[SECURITY] Attempt to send from blacklisted entity: IP=${clientIP}, Email=${email}`);
                return res.status(403).json({error: "Unable to process your request. Connection unauthorized."})
            }
        } catch(dbErr){
            console.error("[DB] Error during blacklist check:", dbErr.message);
        }
    }
    let isHuman = true;
    let securityDetails = "Passed";

    const turnstileSecret = envVars.TURNSTILE_SECRET_KEY;
    if(turnstileSecret){
        if(!turnstileToken){
            isHuman = false;
            securityDetails = "Missing Token";
        } else {
            try{
                const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        secret: turnstileSecret,
                        response: turnstileToken,
                        remoteip: clientIP
                    })
                })
                const verifyData = await verifyRes.json();
                if(!verifyData.success){
                    isHuman = false;
                    securityDetails = `Failed: ${JSON.stringify(verifyData['error-codes'] || 'unknown')}`;
                }
            } catch (err){
                securityDetails = `Turnstile API Error: ${err.message}`;
            }
        }
    }
    let logID = null;
    if(_db){
        try{
            const logResult = await _db.collection('contact_logs').insertOne({
                createdAt: new Date(),
                ip: clientIP,
                email: email.toLowerCase().trim(),
                name: `${name} ${surname || ''}`.trim(),
                phone: phone || null,
                reason: reason || 'Generic',
                messageSnippet: isHuman ? message : (message ? message.substring(0, 100) + '...' : '(empty)'),
                isHuman,
                securityDetails
            });
            logID = logResult.insertedId;
        } catch (logErr){
            console.error("[DB] Contact log save failed:", logErr.message);
        }
    }
    if(!isHuman){
        return res.status(403).json({error: 'Antispam verification failed. Please refresh the page.'})
    }
    if (!envVars.BREVO_API_KEY) {
        return res.status(503).json({ error: "Email isn't configured on the system" });
    }
    try {
        await sendEmail({
            to: envVars.EMAIL_TO || 'kim@novaslegacy.co.za',
            replyTo: email,
            subject: `New contact: ${reason || 'Generic request'} — ${name} ${surname || ''}`.trim(),
            html: `
        <div style="font-family:sans-serif;max-width:520px;color:#111">
          <h3 style="color:#C8880A">New Message from Nova's Legacy website</h3>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${name} ${surname || ''}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold">Phone Number</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
            <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">Reason</td><td style="padding:6px 12px">${reason || '—'}</td></tr>
          </table>
          <div style="margin-top:1rem;padding:1rem;background:#fafafa;border-left:3px solid #C8880A">
            <p style="margin:0;white-space:pre-wrap">${message || '(no message)'}</p>
          </div>
          <p style="margin-top:1.5rem;font-size:0.8rem;color:#999">Sent by novaslegacy.co.za</p>
        </div>`,
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function requireAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not autorized' });
    try {
        jwt.verify(auth.slice(7), envVars.JWT_SECRET || 'dev_secret');
        next();
    } catch {
        res.status(401).json({ error: 'Invalid Token' });
    }
}

app.get('/api/content', (_req, res) => {
    res.json(readCMS());
});

app.put('/api/content', requireAdmin, (req, res) => {
    const cms = readCMS();
    const updatedCms = { ...cms, ...req.body };
    writeCMS(updatedCms);
    res.json({ ok: true });
});

app.get('/api/cms', (_req, res) => {
    res.json(readCMS());
});

app.put('/api/cms/blog', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.blog = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

app.put('/api/cms/products', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.products = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

app.put('/api/cms/animals', requireAdmin, (req, res) => {
    const cms = readCMS();
    cms.animals = req.body;
    writeCMS(cms);
    res.json({ ok: true });
});

Promise.all([initDB(), initAuth()]).then(() => {
    app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));
}).catch(err => {
    console.error('[FATAL] Inizializzazione fallita:', err);
    process.exit(1);
});