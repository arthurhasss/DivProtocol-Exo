import { EmailService } from "../services/email.service";
import { SirenService } from "../services/siren.service";

const express = require('express');
const app = express();
app.use(express.json());

app.post('/validate/email', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'invalid format' });
  const checkResultEmail = EmailService.checkEmail(email);

  res.status(checkResultEmail.status).json(checkResultEmail.body);
});

app.post('/validate/siren', (req, res) => {
  const { siren } = req.body;
  if (!siren || typeof siren !== 'string') return res.status(400).json({ error: 'invalid format' });
  const checkResultSiren = SirenService.checkSiren(siren);
  res.status(checkResultSiren.status).json(checkResultSiren.body);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => console.log('Server on :3000'));