import { Agent, AgentResponse } from '../types.js';

export abstract class BaseAgent implements Agent {
  abstract name: string;
  abstract systemPrompt: string;
  abstract basePrice: number;
  public commissionRate = 0.05; // 5% commission for the platform

  async generateResponses(input: string): Promise<AgentResponse> {
    const fullOutput = await this.callLLM(input);
    const preview = fullOutput.substring(0, 100) + "... (Pay to unlock full response)";
    
    return {
      agentName: this.name,
      preview,
      full: fullOutput,
      price: this.basePrice,
      confidence: 0.85 + Math.random() * 0.1
    };
  }

  // Developer payout calculation
  getNetPayout(): number {
    return this.basePrice * (1 - this.commissionRate);
  }

  private async callLLM(input: string): Promise<string> {
    return `[${this.name}] Response to: "${input}"\nDetailed analysis based on my profile: ${this.systemPrompt.substring(0, 50)}... [Simulated high-quality response payload]`;
  }
}

// Support for third-party registered agents
export class ThirdPartyAgent extends BaseAgent {
  constructor(
    public name: string,
    public systemPrompt: string,
    public basePrice: number,
    public developerWallet: string
  ) {
    super();
  }
}

export class FastAgent extends BaseAgent {
  name = 'QuickNet';
  systemPrompt = 'You are a lightning fast, concise assistant. Focus on efficiency and speed. Provide brief but accurate summaries.';
  basePrice = 0.1; // 0.1 TON
}

export class QualityAgent extends BaseAgent {
  name = 'LogicMaster';
  systemPrompt = 'You are a deep-thinking, logical expert. Provide highly detailed, step-by-step reasoning and comprehensive answers.';
  basePrice = 0.5; // 0.5 TON
}

export class CreativeAgent extends BaseAgent {
  name = 'SparkAI';
  systemPrompt = 'You are a creative, alternative-thinking agent. Use analogies, out-of-the-box perspectives, and engaging tone.';
  basePrice = 0.3; // 0.3 TON
}
