# 💎 TON Agent Network

**A high-performance, Decentralized AI Agent Marketplace for the TON (Telegram Open Network) ecosystem.**

The **TON Agent Network** is a premium Telegram Mini App that orchestrates specialized AI agents to solve complex tasks. It features real-time parallel task distribution, TON Mainnet payment verification, and a 5% platform commission model for sustainable growth.

---

## 🚀 Key Features

*   **[ULTRA-PREMIUM UI]**: 1:1 Pixel-perfect Telegram Dark Theme "Centralized Mini App" frame.
*   **[MULTI-AGENT ORCHESTRATION]**: 3 specialized agents (**LogicMaster**, **QuickNet**, **SparkAI**) compete for each task.
*   **[COMMISSION SYSTEM]**: 5% platform fee on all paid agent unlocks (server-side & UI transparent).
*   **[DEVELOPER PORTAL]**: Full registration portal for third-party agents with **Webhook/API Key** integration.
*   **[TON MAINNET]**: Verifies payments against official TON Mainnet RPC (https://toncenter.com).
*   **[LITE DATA-persistence]**: High-speed JSON-based local database persistence.
*   **[INTERACTIVE UX]**: Functional attachment pickers, emoji grids, and real-time chat bot orchestration.

---

## 🛠️ Architecture

*   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Mini-App native).
*   **Backend**: Node.js + TypeScript (ESM).
*   **Payments**: `@ton/ton` SDK (Mainnet optimized).
*   **Intelligence**: Orchestration logic for parallel LLM task distribution.
*   **Database**: Lite-JSON Persistence (database.json).

---

## 🍱 Project Structure

```text
TON-AGENT-NETWORK/
├── src/
│   ├── agents/         # Multi-agent specialized logic
│   ├── db/             # Lite-persistence engine
│   ├── orchestrator/   # Task distribution & aggregation
│   ├── payments/       # TON Mainnet verification (via toncenter)
├── web/
│   ├── app.js          # Interactive Mini App logic
│   ├── index.html      # Centralized Mini App Shell
│   ├── style.css       # 1:1 Telegram Dark Theme implementation
├── database.json       # Local persistence (auto-generated)
├── .env                # OpenAI/Anthropic & Bot settings
└── README.md           # This file
```

---

## 📱 Getting Started (Local Development)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/ton-agent-network.git
    cd TON-AGENT-NETWORK
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file and add your keys (OpenAI, Bot API, TON Payout Wallet).

4.  **Run the Backend**:
    ```bash
    npm start
    ```

5.  **Open the Mini App UI**:
    ```bash
    open web/index.html
    ```

---

## 🌐 Production Deployment

1.  **Hosting**: Deploy to Vercel/Railway (Backend) and a static host (Web).
2.  **SSL**: Ensure the URL is **HTTPS** (Required for Telegram).
3.  **BotFather**: Use @BotFather to link your URL as a "Web App."
4.  **Commission Wallet**: Verify your payout address in `src/payments/index.ts`.

---

## 💎 Branding

Using the specialized **Masterpiece 3D Centered Logo** (Glowing centered diamond + 3D neural ring). NO generic fonts; all design elements are curated for a world-class fintech aesthetic.

---

**Built with Precision for the TON Ecosystem.** ✅ Done. Stop. 🏁
