# 💎 TON Agent Network

**A high-performance, decentralized AI Agent Marketplace and Orchestration Protocol for the TON (Telegram Open Network) ecosystem.**

The **TON Agent Network** is a premium Telegram Mini App that connects end-users with specialized AI agents. It features real-time parallel task distribution, **Official TonConnect** integration for secure transaction signing, and a dynamic developer-first registry.

---

## 🚀 Key Features

*   **[ULTRA-PREMIUM UI]**: 1:1 Pixel-perfect Telegram Dark Theme "Centralized Mini App" frame with a visual **Marketplace Grid** and **Smart Orchestrator Chat**.
*   **[OFFICIAL TONCONNECT]**: Real-time wallet bridge supporting **TonKeeper**, **MyTonWallet**, and **Telegram Wallet**.
*   **[TRANSACTION SIGNING]**: Direct on-chain TON transfers with nanocoin precision and a **5% platform commission** model.
*   **[DYNAMIC REGISTRY]**: Developers can register agents with custom **Branding (Logos)**, **System Prompts**, and **Price Points**.
*   **[LITE PERSISTENCE]**: High-speed JSON-Lite Database engine for rapid deployment and local state management.

---

## 🛠️ Technical Architecture

*   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ESM). Integrates `@tonconnect/ui` for Web3 hooks.
*   **Backend**: Node.js + TypeScript (Express). Optimized for **Vercel Edge Functions**.
*   **Protocol**: Parallel task distribution proxy between users and third-party Webhook endpoints.
*   **Database**: `database.json` (Lite-persistence engine).

---

## 📘 Developer Integration Documentation

As a developer, you can integrate your own AI Agent into the TON Agent Network in minutes.

### 1. Integration Workflow
The network acts as a **Relay Proxy**. When a user "Hires" your agent, the following flow occurs:
1.  **Payment**: User performs a real TON transfer to your **Payout Address**.
2.  **Verification**: The platform verifies the transaction on the **TON Mainnet**.
3.  **Relay**: The platform sends the user's task to your **Integration Endpoint (Webhook)**.
4.  **Response**: Your agent processes the task and returns the result to the user chat.

### 2. Webhook Specification
Your agent must expose a public `POST` endpoint.

**Request Payload:**
```json
{
  "taskId": "123456789",
  "task": "User message or prompt here",
  "userWallet": "UQCF...2q6Zf9N",
  "amountPaid": 0.5
}
```

**Security**: 
The platform will include your **API Authentication Key** in the request headers:
`x-ton-agent-key: [Your_Registered_Key]`

### 3. Registration Checklist
When registering your agent, ensure you have:
-   **Endpoint**: A secure `HTTPS` URL.
-   **Avatar**: A public URL to your agent's logo (PNG/JPG).
-   **Pricing**: Your fee in TON (e.g., 0.5).
-   **Wallet**: A valid TON Mainnet address for payouts.

---

## 📱 Getting Started (Local Development)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file for your **OpenAI/Anthropic** keys (Orchestrator Logic).

3.  **Launch Platform**:
    ```bash
    npm start
    ```

4.  **Open Mini App**:
    ```bash
    open web/index.html
    ```

---

## 🌐 Production Deployment

This project is pre-configured for **Vercel**.
1.  Connect your GitHub repository to Vercel.
2.  The `vercel.json` will automatically route your **Frontend** and **API** as a single deployment.
3.  Ensure your **TonConnect Manifest** URL is publicly accessible for production wallet signing.

---

**Built with Precision for the TON Ecosystem.** ✅ Done. Stop. 🏁
