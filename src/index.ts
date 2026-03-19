import dotenv from 'dotenv';
import { Orchestrator } from './orchestrator/index.js';

dotenv.config();

async function main() {
  console.log('🚀 TON Agent Network - AI Core Engine Starting...');
  const orchestrator = new Orchestrator();

  const sampleTask = "Design a decentralized reward system for AI agents.";
  console.log(`📝 Processing sample task: "${sampleTask}"`);

  const { task, responses } = await orchestrator.processTask(12345, sampleTask);

  console.log('✅ Agents have responded:');
  responses.forEach(res => {
    console.log(`\n🤖 Agent: ${res.agentName}`);
    console.log(`💰 Price: ${res.price} TON`);
    console.log(`📊 Confidence: ${Math.round(res.confidence * 100)}%`);
    console.log(`📜 Preview: ${res.preview}`);
  });

  console.log('\n📡 Server is waiting for your manual Telegram integration...');
  // Your custom Telegram bot logic should be invoked here.
}

main().catch(console.error);
