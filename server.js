const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const RESUME_PASSWORD = process.env.RESUME_PASSWORD || 'Sonic18!';
const PDF_PATH = path.join(__dirname, 'assets', 'Bogiages_Mackenzie_resume.pdf');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/resume/download', (req, res) => {
  const password = String(req.body?.password ?? '');

  if (password !== RESUME_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Incorrect passcode.' });
  }

  if (!fs.existsSync(PDF_PATH)) {
    return res.status(404).json({ ok: false, error: 'Resume not found.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Bogiages_Mackenzie_resume.pdf"');
  fs.createReadStream(PDF_PATH).pipe(res);
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Resume server running on http://localhost:${PORT}`);
});
