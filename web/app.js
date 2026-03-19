/**
 * 🍱 TON AGENT NETWORK - REAL-TIME MARKETPLACE LOGIC
 */

let isWalletConnected = false;
let userWalletAddress = "";
let liveAgents = []; // Fetched from the backend

// 🟢 TONCONNECT - Real Wallet 
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://raw.githubusercontent.com/ton-connect/demo-dapp/main/public/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

/**
 * 🛠️ View Management
 */
function showView(viewName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    const bottomBar = document.getElementById('bottomChatBar');
    bottomBar.style.display = (viewName === 'chat') ? 'flex' : 'none';

    if (viewName === 'market') {
        document.getElementById('tabMarket').classList.add('active');
        document.getElementById('viewMarket').classList.add('active');
        fetchAgents(); // Refresh the feed from the server
    } else if (viewName === 'chat') {
        document.getElementById('tabChat').classList.add('active');
        document.getElementById('viewChat').classList.add('active');
    } else {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('viewRegister').classList.add('active');
    }
}

/**
 * 🛒 MARKETPLACE: Fetch & Render Dynamic Agents
 */
async function fetchAgents() {
    try {
        const res = await fetch('/api/agents');
        liveAgents = await res.json();
        renderMarketFeed();
    } catch (e) {
        console.error("Marketplace Offline", e);
    }
}

function renderMarketFeed() {
    const feed = document.getElementById('agentMarketFeed');
    feed.innerHTML = '';

    // If no agents yet, show a welcome message
    if (liveAgents.length === 0) {
        feed.innerHTML = `<div class="bubble in">Welcome, pioneer. No agents are registered yet. Be the first to build on our network!</div>`;
        return;
    }

    liveAgents.forEach(a => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="card-badge">${a.badge || 'PRO'}</div>
            <img src="${a.avatar || 'assets/logo.png'}" class="card-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3662/3662817.png'">
            <div class="card-info">
                <h3>${a.name}</h3>
                <p>${a.bio || 'AI Specialisation for TON Mainnet.'}</p>
                <div class="card-meta">
                    <span class="card-price">${a.price} TON</span>
                    <span class="card-stats">📈 ${a.stats || '100% | 0.8s'}</span>
                </div>
                <button class="btn-unlock" onclick="handleTransactionPrompt('${a.id}')">Hire Agent</button>
            </div>`;
        feed.appendChild(card);
    });
}

/**
 * 🛠️ DEVELOPER PORTAL: Submit Real Agent
 */
async function registerNewAgent() {
    const nameInput = document.getElementById('regName');
    const avatarInput = document.getElementById('regAvatar');
    const bioInput = document.getElementById('regBio');
    const urlInput = document.getElementById('regUrl');
    const keyInput = document.getElementById('regKey');
    const priceInput = document.getElementById('regPrice');
    const walletInput = document.getElementById('regWallet');

    const agentPayload = {
        name: nameInput.value,
        avatar: avatarInput.value,
        bio: bioInput.value,
        endpoint: urlInput.value,
        apiKey: keyInput.value,
        price: parseFloat(priceInput.value) || 0.1,
        devWallet: walletInput.value
    };

    if (!agentPayload.name || !agentPayload.devWallet) return alert("⚠️ Please provide Name and TON Payout Address.");

    try {
        const res = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentPayload)
        });
        
        if (res.ok) {
            alert("🚀 AGENT LIVE! Your integration is now visible in the Marketplace.");
            nameInput.value=''; avatarInput.value=''; bioInput.value=''; urlInput.value=''; keyInput.value=''; priceInput.value=''; walletInput.value='';
            showView('market');
        }
    } catch (e) {
        alert("Server Offline. Local Simulation is active.");
    }
}

/**
 * 💸 PAYMENTS
 */
function handleTransactionPrompt(agentId) {
    if (!tonConnectUI.connected) return tonConnectUI.openModal();
    const agent = liveAgents.find(a => a.id === agentId);
    if (agent) processPayment(agent);
}

async function processPayment(agent) {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: agent.devWallet,
            amount: (agent.price * 1000000000).toString(),
            payload: "" 
        }]
    };
    try {
        await tonConnectUI.sendTransaction(transaction);
        appendMessage(`💸 **Signed.** Payment for ${agent.name} is on-chain. Verifying...`, "in");
    } catch (e) {
        alert("Transaction Cancelled.");
    }
}

// Messaging Logic
function sendMessage() {
    if (!tonConnectUI.connected) return tonConnectUI.openModal();
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'out');
    input.value = '';
    setTimeout(() => {
        appendMessage("🌐 **Orchestrator Search.** Searching for specialized agents...");
        setTimeout(() => {
            appendMessage("✅ **Found Agents.** Competing responses are ready to be unlocked via TON payment.");
            renderMarketFeedInChat();
        }, 1200);
    }, 500);
}

function renderMarketFeedInChat() {
    const chatViewport = document.querySelector('.chat-viewport');
    const widget = document.createElement('div');
    widget.className = 'agent-widget';
    liveAgents.forEach(a => {
        const row = document.createElement('div');
        row.className = 'agent-row';
        row.onclick = () => processPayment(a);
        row.innerHTML = `
            <img src="${a.avatar || 'assets/logo.png'}" class="agent-avatar-img">
            <div class="agent-body">
                <div class="agent-header"><span class="name">${a.name}</span><span class="price">${a.price} TON</span></div>
                <div class="preview">${a.bio}</div>
                <div class="action-row"><span class="stats">📊 ${a.stats || '100%'}</span><button class="btn-unlock">Unlock Solution</button></div>
            </div>`;
        widget.appendChild(row);
    });
    chatViewport.appendChild(widget);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

function appendMessage(text, type = 'in') {
    const chatViewport = document.querySelector('.chat-viewport');
    const msg = document.createElement('div');
    msg.className = `bubble ${type}`;
    msg.innerHTML = `${text} <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
    chatViewport.appendChild(msg);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

window.onload = () => showView('market');
