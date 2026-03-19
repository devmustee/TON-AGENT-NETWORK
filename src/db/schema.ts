import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../database.json');

/**
 * 🍱 INTEGRATED DATABASE ENGINE
 * High-speed JSON-Lite persistence for TON Agent Network
 */
export class LiteDatabase {
  private data: any = {
    agents: [], // Registered third-party agents
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
