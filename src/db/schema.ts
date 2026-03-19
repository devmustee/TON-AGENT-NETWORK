import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../database.json');

// DEFAULT SEED AGENTS (LogicMaster, QuickNet, SparkAI)
const SEED_AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: 'assets/logicmaster.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s', devWallet: 'UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N', badge: 'PRO' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: 'assets/quicknet.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s', devWallet: 'UQBH-qC6Z_Y_q68n89YV7K8_Z8uRrrNrttYD3r5ru1TC2q6Zf', badge: 'FAST' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: 'assets/sparkai.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s', devWallet: 'UQDM-mD8t_L_8t88j88P8K8_P8uRrrNrttYD3r5ru1TC2q6Zp', badge: 'NEW' }
];

/**
 * 🍱 INTEGRATED DATABASE ENGINE
 * High-speed JSON-Lite persistence for TON Agent Network
 */
export class LiteDatabase {
  private data: any = {
    agents: SEED_AGENTS, // Start with the 3 core agents
    tasks: [],
    payments: []
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_PATH)) {
      this.save();
    } else {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      this.data = JSON.parse(raw);
      
      // If agents are missing or empty, re-seed from the core set
      if (!this.data.agents || this.data.agents.length === 0) {
        this.data.agents = SEED_AGENTS;
        this.save();
      }
    }
  }

  private save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  // AGENT REGISTRATION
  public addAgent(agent: any) {
    this.data.agents.push(agent);
    this.save();
  }

  public getAgents() {
    return this.data.agents;
  }

  // TASK MANAGEMENT
  public addTask(task: any) {
    this.data.tasks.push(task);
    this.save();
  }

  // PAYMENT LOGIC
  public verifyPayment(taskId: string) {
    const task = this.data.tasks.find((t: any) => t.id === taskId);
    if (task) {
      task.paid = true;
      this.save();
    }
  }
}

export const db = new LiteDatabase();
