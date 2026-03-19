import fs from 'fs';
import path from 'path';

/**
 * 🗄️ LITE DATABASE - TON AGENT NETWORK
 * File-based JSON Persistence (High Speed / No Network Latency)
 * Designed for rapid Mini App deployment.
 */

const DB_PATH = path.join(process.cwd(), 'database.json');

interface Database {
  tasks: any[];
  payments: any[];
  users: any[];
  agents: any[];
}

export class LiteDatabase {
  private static instance: LiteDatabase;
  private data: Database;

  private constructor() {
    this.data = this.load();
  }

  public static getInstance(): LiteDatabase {
    if (!LiteDatabase.instance) {
      LiteDatabase.instance = new LiteDatabase();
    }
    return LiteDatabase.instance;
  }

  private load(): Database {
    if (!fs.existsSync(DB_PATH)) {
      const initial: Database = { tasks: [], payments: [], users: [], agents: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  }

  private save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  // --- Core CRUD ---

  addTask(task: any) {
    this.data.tasks.push({ ...task, createdAt: new Date().toISOString() });
    this.save();
  }

  getTasks(userId?: number) {
    return userId ? this.data.tasks.filter(t => t.userId === userId) : this.data.tasks;
  }

  addPayment(payment: any) {
    this.data.payments.push({ ...payment, status: 'PENDING', createdAt: new Date().toISOString() });
    this.save();
  }

  verifyPayment(taskId: string) {
    const payment = this.data.payments.find(p => p.taskId === taskId);
    if (payment) {
      payment.status = 'COMPLETED';
      this.save();
    }
  }

  registerAgent(agent: any) {
    this.data.agents.push({ ...agent, registeredAt: new Date().toISOString() });
    this.save();
  }
}

export const db = LiteDatabase.getInstance();
