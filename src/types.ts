export interface AgentResponse {
  agentName: string;
  preview: string;
  full?: string; // Locked until payment
  price: number; // in TON
  confidence: number;
}

export interface Task {
  id: string;
  userId: number;
  input: string;
  status: 'pending' | 'completed' | 'paid';
  createdAt: Date;
}

export interface Agent {
  name: string;
  generateResponses(input: string): Promise<AgentResponse>;
}
