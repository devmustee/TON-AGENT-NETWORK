/**
 * 🍱 TON AGENT NETWORK - HYBRID MARKETPLACE 
 * Logic to handle both Static Seeding and Real-Time Persistence
 */

let isWalletConnected = false;
let userWalletAddress = "";

// 🧱 DEFAULT CORE AGENTS (Fallback Seed)
const CORE_AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: 'assets/logicmaster.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s', devWallet: 'UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N', badge: 'PRO' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: 'assets/quicknet.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s', devWallet: 'UQBH-qC6Z_Y_q68n89YV7K8_Z8uRrrNrttYD3r5ru1TC2q6Zf', badge: 'FAST' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: 'assets/sparkai.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s', devWallet: 'UQDM-mD8t_L_8t88j88P8K8_P8uRrrNrttYD3r5ru1TC2q6Zp', badge: 'NEW' }
];

let liveAgents = [...CORE_AGENTS]; 

// 🟢 TONCONNECT INTEGRATION
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
        fetchAgents(); // Refresh the dynamic feed
    } else if (viewName === 'chat') {
        document.getElementById('tabChat').classList.add('active');
        document.getElementById('viewChat').classList.add('active');
    } else {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('viewRegister').classList.add('active');
    }
}

/**
 * 🛒 MARKETPLACE: Fetch Dynamic & Merge with Core
 */
async function fetchAgents() {
    try {
        const res = await fetch('/api/agents');
        const dbAgents = await res.json();
        
        // Merge DB agents with Core agents, avoiding duplicates
        const allAgents = [...CORE_AGENTS];
        dbAgents.forEach(dbA => {
            if (!allAgents.find(a => a.id === dbA.id)) {
                allAgents.push(dbA);
            }
        });
        
        liveAgents = allAgents;
        renderMarketFeed();
    } catch (e) {
        console.warn("Using Offline Seed Core Agents.");
        liveAgents = [...CORE_AGENTS];
        renderMarketFeed();
    }
}

function renderMarketFeed() {
    const feed = document.getElementById('agentMarketFeed');
    feed.innerHTML = '';

    liveAgents.forEach(a => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="card-badge">${a.badge || 'NEW'}</div>
            <img src="${a.avatar || 'assets/logo.png'}" class="card-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4712/4712035.png'">
            <div class="card-info">
                <h3>${a.name}</h3><p>${a.bio || 'AI Specialization.'}</p>
                <div class="card-meta"><span class="card-price">${a.price} TON</span><span class="card-stats">${a.stats || '100%'}</span></div>
                <button class="btn-unlock" onclick="handleTransactionPrompt('${a.id}')">Hire Agent</button>
            </div>`;
        feed.appendChild(card);
    });
}

/**
 * 🛠️ REGISTER SUBMISSION
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

    if (!agentPayload.name || !agentPayload.devWallet) return alert("⚠️ Please provide at least Name and TON Payout wallet.");

    try {
        const res = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentPayload)
        });
        if (res.ok) {
            alert("🚀 AGENT LIVE!");
            nameInput.value=''; avatarInput.value=''; bioInput.value=''; urlInput.value=''; keyInput.value=''; priceInput.value=''; walletInput.value='';
            showView('market');
        }
    } catch (e) {
        alert("Server Offline. Submit via Production only.");
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

function sendMessage() {
    if (!tonConnectUI.connected) return tonConnectUI.openModal();
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'out');
    input.value = '';
    setTimeout(() => {
        appendMessage("🌐 **Orchestrator Proxy Online.** Dispatching task to Network...");
        setTimeout(renderAgentWidgetInChat, 1200);
    }, 500);
}

function renderAgentWidgetInChat() {
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
    document.querySelector('.chat-viewport').appendChild(widget);
    document.querySelector('.chat-viewport').scrollTop = document.querySelector('.chat-viewport').scrollHeight;
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
