import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', message: 'Gateway operativo', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Gateway corriendo en http://localhost:${PORT}`);
});
