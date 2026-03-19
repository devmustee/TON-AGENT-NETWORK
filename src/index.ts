import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '../web')));

/**
 * 🛠️ AGENT API: Register New Third-Party Agents
 */
app.post('/api/agents', (req: Request, res: Response) => {
  const agent = req.body;
  
  if (!agent.name || !agent.devWallet) {
    return res.status(400).json({ error: 'Missing Identity or Wallet' });
  }

  // Assign internal metadata
  const newAgent = {
    ...agent,
    id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    badge: 'NEW',
    stats: '100% | 0.0s', // New agents start fresh
    avatar: 'assets/logo.png' // Default logo for new agents
  };

  db.addAgent(newAgent);
  console.log(`🚀 New Agent Registered: ${newAgent.name} for ${newAgent.devWallet}`);
  res.status(201).json(newAgent);
});

/**
 * 🛒 MARKETPLACE API: Fetch Live Agent List
 */
app.get('/api/agents', (req: Request, res: Response) => {
  const agents = db.getAgents();
  res.json(agents);
});

/**
 * 💬 TASK API: Submit Tasks to Orchestrator
 */
app.post('/api/tasks', (req: Request, res: Response) => {
  const { userId, task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task required' });
  const newTask = { id: Date.now().toString(), userId, text: task, paid: false };
  db.addTask(newTask);
  res.json(newTask);
});

// Single Page Application Routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 TON Agent Network - Real-Time Marketplace Online @ http://localhost:${port}`);
});
