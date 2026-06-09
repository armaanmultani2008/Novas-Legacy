/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

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

let adminPassword = "";

app.get('/', (req, res) => {
    res.json({ message: "Il backend di Nova's Legacy è online e funzionante!" });
});

app.get('/ping', (_req, res) => res.send('pong'));

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
    const secret = envVars.STRIPE_WEBHOOK_SECRET;
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

app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});