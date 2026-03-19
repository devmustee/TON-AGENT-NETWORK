import { FastAgent, QualityAgent, CreativeAgent } from '../agents/BaseAgent.js';
import { AgentResponse, Task } from '../types.js';

export class Orchestrator {
  private agents = [
    new FastAgent(),
    new QualityAgent(),
    new CreativeAgent()
  ];

  async processTask(userId: number, input: string): Promise<{ task: Task; responses: AgentResponse[] }> {
    const taskId = Math.random().toString(36).substring(7);
    const task: Task = {
      id: taskId,
      userId,
      input,
      status: 'completed',
      createdAt: new Date()
    };

    // Parallel fan-out as requested
    const responses = await Promise.all(
      this.agents.map(agent => agent.generateResponses(input))
    );

    // Filter to keep 'full' locked server-side (only returning preview to user initially)
    const secureResponses = responses.map(r => ({
      ...r,
      full: undefined // Ensure full remains locked
    }));

    return { task, responses: secureResponses };
  }
}
