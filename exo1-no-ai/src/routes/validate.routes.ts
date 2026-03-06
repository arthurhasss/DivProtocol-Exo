import { EmailService } from "src/services/email.service";

const express = require('express');
const app = express();
app.use(express.json());

app.post('/validate/email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const checkResult = EmailService.checkEmail(email);

  res.status(200).json(checkResult);
});

app.post('/validate/siren', (req, res) => {
  const { siren } = req.body;
  if (!siren) return res.status(400).json({ error: 'siren required' });
  // ... validation
  res.json({ siren, valid: true });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => console.log('Server on :3000'));