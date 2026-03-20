/**
 * 🍱 TON AGENT NETWORK - OFFICIAL PRODUCTION LOGIC
 * Fixes for: Hiring Payments (TonConnect) and Mobile Visibility (Send Bar)
 */

let isWalletConnected = false;
let userWalletAddress = "";

const CORE_AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: 'assets/logicmaster.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s', devWallet: 'UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N', badge: 'PRO' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: 'assets/quicknet.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s', devWallet: 'UQBH-qC6Z_Y_q68n89YV7K8_Z8uRrrNrttYD3r5ru1TC2q6Zf', badge: 'FAST' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: 'assets/sparkai.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s', devWallet: 'UQDM-mD8t_L_8t88j88P8K8_P8uRrrNrttYD3r5ru1TC2q6Zp', badge: 'NEW' }
];

let liveAgents = [...CORE_AGENTS]; 

// 🟢 TONCONNECT - PRODUCTION MANIFEST
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-agent-network.vercel.app/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

/**
 * 🛠️ UI HELPERS
 */
function toggleModal(id, force) {
    const el = document.getElementById(id);
    if (!el) return;
    if (force !== undefined) el.style.display = force ? 'block' : 'none';
    else el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function toggleSendBtn() {
    const input = document.getElementById('taskInput');
    const icon = document.getElementById('sendBtnIcon');
    if (!input || !icon) return;
    icon.style.color = input.value.trim() ? '#3390ec' : '#7e8c9a';
}

function selectAttach(type) {
    toggleModal('attachModal', false);
    appendMessage(`📎 Attached ${type}. Ready for tasking.`, 'out');
}

/**
 * 🛠️ VIEW MANAGEMENT
 */
function showView(viewName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // 🔥 FORCE VISIBILITY FOR MOBILE SEND BAR
    const bottomBar = document.getElementById('bottomChatBar');
    if (bottomBar) {
        bottomBar.style.display = (viewName === 'chat') ? 'flex' : 'none';
        bottomBar.style.visibility = (viewName === 'chat') ? 'visible' : 'hidden';
    }

    if (viewName === 'market') {
        document.getElementById('tabMarket').classList.add('active');
        document.getElementById('viewMarket').classList.add('active');
        fetchAgents();
    } else if (viewName === 'chat') {
        document.getElementById('tabChat').classList.add('active');
        document.getElementById('viewChat').classList.add('active');
    } else {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('viewRegister').classList.add('active');
    }
}

async function fetchAgents() {
    try {
        const res = await fetch('/api/agents');
        const dbAgents = await res.json();
        const allAgents = [...CORE_AGENTS];
        dbAgents.forEach(dbA => {
            if (!allAgents.find(a => a.id === dbA.id)) allAgents.push(dbA);
        });
        liveAgents = allAgents;
        renderMarketFeed();
    } catch (e) {
        liveAgents = [...CORE_AGENTS];
        renderMarketFeed();
    }
}

function renderMarketFeed() {
    const feed = document.getElementById('agentMarketFeed');
    if (!feed) return;
    feed.innerHTML = '';
    liveAgents.forEach(a => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${a.avatar || 'assets/logo.png'}" class="card-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3662/3662817.png'">
            </div>
            <div class="card-info">
                <div class="card-name-row">
                    <h3>${a.name}</h3>
                    <div class="card-price">${a.price} TON</div>
                </div>
                <p>${a.bio || 'AI Specialisation for TON Network.'}</p>
                <div class="card-meta">
                   <div class="card-stats">📈 ${a.stats || '100%'}</div>
                   <button class="btn-unlock" onclick="handleTransactionPrompt('${a.id}')" id="hire-${a.id}">Hire</button>
                </div>
            </div>`;
        feed.appendChild(card);
    });
}

/**
 * 💸 TON PAYMENTS (HIRING)
 */
function handleTransactionPrompt(agentId) {
    if (!tonConnectUI.connected) {
        alert("Connect your TON Wallet first! 💎");
        return tonConnectUI.openModal();
    }
    const agent = liveAgents.find(a => a.id === agentId);
    if (agent) processPayment(agent);
}

async function processPayment(agent) {
    const amountInNano = (agent.price * 1000000000).toString();
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: agent.devWallet,
            amount: amountInNano,
            payload: "" 
        }]
    };
    
    try {
        const walletName = tonConnectUI.wallet ? tonConnectUI.wallet.device.appName : "Wallet";
        alert(`💎 PAYING ${agent.name}: Confirm the ${agent.price} TON transfer in your ${walletName}.`);
        
        await tonConnectUI.sendTransaction(transaction);
        alert(`✅ SUCCESS! ${agent.name} hired. Solution unlocked.`);
        
        if (typeof appendMessage === 'function') {
            appendMessage(`💸 Payment for **${agent.name}** confirmed.`, 'in');
        }
    } catch (e) {
        console.error("Payment Failed:", e);
        alert("❌ Payment Failed: " + (e.message || "User canceled or insufficient funds."));
    }
}

async function registerNewAgent() {
    const agentPayload = {
        name: document.getElementById('regName').value,
        avatar: document.getElementById('regAvatar').value,
        bio: document.getElementById('regBio').value,
        endpoint: document.getElementById('regUrl').value,
        price: parseFloat(document.getElementById('regPrice').value) || 0.1,
        devWallet: document.getElementById('regWallet').value
    };
    if (!agentPayload.name || !agentPayload.devWallet) return alert("⚠️ Name and Wallet Address required.");
    try {
        const res = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentPayload)
        });
        if (res.ok) {
            alert("🚀 AGENT LIVE!");
            showView('market');
        }
    } catch (e) { alert("Registration failed."); }
}

function sendMessage() {
    if (!tonConnectUI.connected) return tonConnectUI.openModal();
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'out');
    input.value = '';
    toggleSendBtn(); 
    setTimeout(() => {
        appendMessage("🌐 Searching Network...");
        setTimeout(() => {
            appendMessage("✅ Found matches:");
            renderAgentWidgetInChat();
        }, 1000);
    }, 500);
}

function renderAgentWidgetInChat() {
    const widget = document.createElement('div');
    widget.className = 'agent-widget';
    liveAgents.forEach(a => {
        const row = document.createElement('div');
        row.className = 'agent-row';
        row.onclick = () => processPayment(a); // Direct pay from chat
        row.innerHTML = `
            <img src="${a.avatar || 'assets/logo.png'}" class="agent-avatar-img">
            <span class="name">${a.name}</span>
            <span class="price">${a.price} TON</span>
            <i class="fa-solid fa-chevron-right" style="font-size:0.7rem; color:var(--tg-text-muted);"></i>`;
        widget.appendChild(row);
    });
    const chatV = document.getElementById('chatList');
    if (chatV) {
        chatV.appendChild(widget);
        chatV.scrollTop = chatV.scrollHeight;
    }
}

function appendMessage(text, type = 'in') {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    const msg = document.createElement('div');
    msg.className = `bubble ${type}`;
    msg.innerHTML = `${text} <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
    chatList.appendChild(msg);
    chatList.scrollTop = chatList.scrollHeight;
}

window.onload = () => {
    showView('market');
    const reacts = ['👍', '🏙️', '🔥', '👏', '🎨', '🚀', '🙌', '💎', '📍', '💯', '✨', '⚡'];
    const grid = document.getElementById('emojiList');
    if (grid) {
        reacts.forEach(r => {
            const d = document.createElement('div');
            d.innerHTML = r;
            d.style.padding = '10px';
            d.style.fontSize = '1.5rem';
            d.onclick = () => { appendMessage(r, 'out'); toggleModal('emojiModal', false); };
            grid.appendChild(d);
        });
    }
};
