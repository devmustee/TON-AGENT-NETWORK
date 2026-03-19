/**
 * 💎 TON AGENT NETWORK - PRO APP LOGIC
 * Integrates Official TonConnect for Real Wallet Connectivity
 */

const AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: 'assets/logicmaster.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s', devWallet: 'UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N', badge: 'PRO' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: 'assets/quicknet.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s', devWallet: 'UQBH-qC6Z_Y_q68n89YV7K8_Z8uRrrNrttYD3r5ru1TC2q6Zf', badge: 'FAST' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: 'assets/sparkai.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s', devWallet: 'UQDM-mD8t_L_8t88j88P8K8_P8uRrrNrttYD3r5ru1TC2q6Zp', badge: 'NEW' }
];

const EMOJIS = ['🚀', '📈', '🧠', '⚡', '✨', '💎', '🔥', '✅', '🤖', '👑', '💸', '🎨', '🌟', '🛡️', '🛰️', '🪐', '💡', '🧪', '👾', '🌀', '🌊', '🌈', '🎉', '💥'];

// 🟢 OFFICIAL TONCONNECT INTEGRATION
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
        renderMarketFeed();
    } else if (viewName === 'chat') {
        document.getElementById('tabChat').classList.add('active');
        document.getElementById('viewChat').classList.add('active');
    } else {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('viewRegister').classList.add('active');
    }
}

/**
 * 🛒 Marketplace Feed
 */
function renderMarketFeed() {
    const feed = document.getElementById('agentMarketFeed');
    feed.innerHTML = '';
    AGENTS.forEach(a => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="card-badge">${a.badge}</div>
            <img src="${a.avatar}" class="card-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4712/4712035.png'">
            <div class="card-info">
                <h3>${a.name}</h3><p>${a.bio}</p>
                <div class="card-meta"><span class="card-price">${a.price} TON</span><span class="card-stats">📈 ${a.stats}</span></div>
                <button class="btn-unlock" onclick="startPaymentPrompt('${a.id}')">Hire Agent</button>
            </div>`;
        feed.appendChild(card);
    });
}

function startPaymentPrompt(agentId) {
    if (!tonConnectUI.connected) return tonConnectUI.openModal();
    const agent = AGENTS.find(a => a.id === agentId);
    handleTransaction(agent);
}

/**
 * 💸 REAL TON TRANSACTION (Request Signature)
 */
async function handleTransaction(agent) {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: agent.devWallet,
            amount: (agent.price * 1000000000).toString(),
            payload: "" // Optional memo
        }]
    };

    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        appendMessage(`💸 **Transaction Sent!** Waiting for confirmation on TON Mainnet...`, "in");
        console.log('Transaction Success:', result);
    } catch (e) {
        console.error('Transaction Failed:', e);
        alert("Transaction Canceled or Wallet Error.");
    }
}

function toggleModal(id, open = true) {
    const modal = document.getElementById(id);
    modal.style.display = open && modal.style.display !== 'block' ? 'block' : 'none';
    if (id === 'emojiModal' && open) renderEmojis();
}

function renderEmojis() {
    const list = document.getElementById('emojiList');
    list.innerHTML = '';
    EMOJIS.forEach(e => {
        const item = document.createElement('span');
        item.className = 'emoji-item';
        item.innerText = e;
        item.onclick = () => {
            if (!tonConnectUI.connected) return tonConnectUI.openModal();
            const input = document.getElementById('taskInput');
            input.value += e;
            toggleModal('emojiModal', false);
            toggleSendBtn();
        };
        list.appendChild(item);
    });
}

function toggleSendBtn() {
    const input = document.getElementById('taskInput');
    const sendIcon = document.getElementById('sendBtnIcon');
    sendIcon.style.color = input.value.trim().length > 0 ? '#3390ec' : '#7e8c9a';
}

function appendMessage(text, type = 'in') {
    const chatViewport = document.querySelector('.chat-viewport');
    const msg = document.createElement('div');
    msg.className = `bubble ${type}`;
    msg.innerHTML = `${text} <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
    chatViewport.appendChild(msg);
    chatViewport.scrollTop = chatViewport.scrollHeight;
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
        appendMessage("🌐 **Orchestrator Online.** Processing your request across the Network...");
        setTimeout(renderAgentWidgetInChat, 1200);
    }, 500);
}

function renderAgentWidgetInChat() {
    const widget = document.createElement('div');
    widget.className = 'agent-widget';
    AGENTS.forEach(a => {
        const row = document.createElement('div');
        row.className = 'agent-row';
        row.onclick = () => handleTransaction(a);
        row.innerHTML = `
            <img src="${a.avatar}" class="agent-avatar-img">
            <div class="agent-body">
                <div class="agent-header"><span class="name">${a.name}</span><span class="price">${a.price} TON</span></div>
                <div class="preview">${a.bio}</div>
                <div class="action-row"><span class="stats">📊 ${a.stats}</span><button class="btn-unlock">Unlock Solution</button></div>
            </div>`;
        widget.appendChild(row);
    });
    document.querySelector('.chat-viewport').appendChild(widget);
    document.querySelector('.chat-viewport').scrollTop = document.querySelector('.chat-viewport').scrollHeight;
}

window.onload = () => showView('market');
