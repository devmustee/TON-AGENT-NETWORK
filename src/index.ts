import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { TonPaymentManager } from './payments/index.js';
import { db } from './db/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'web' directory
app.use(express.static(path.join(__dirname, '../web')));

// API Routes
app.post('/api/tasks', (req: Request, res: Response) => {
  const { userId, task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task required' });
  
  const newTask = { id: Date.now().toString(), userId, text: task };
  db.addTask(newTask);
  res.json(newTask);
});

app.post('/api/verify-payment', async (req: Request, res: Response) => {
  const { taskId, amount } = req.body;
  const paymentManager = new TonPaymentManager();
  const verified = await paymentManager.verifyPayment(amount, taskId);
  
  if (verified) {
    db.verifyPayment(taskId);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Serve frontend for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 TON Agent Network Server running at http://localhost:${port}`);
});
