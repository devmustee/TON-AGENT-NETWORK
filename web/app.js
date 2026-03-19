const AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: '/Users/user/.gemini/antigravity/brain/94bbe715-35e0-45c2-826f-5dffc52640ec/logicmaster_agent_avatar_1773955787080.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: '/Users/user/.gemini/antigravity/brain/94bbe715-35e0-45c2-826f-5dffc52640ec/quicknet_agent_avatar_1773955695322.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: '/Users/user/.gemini/antigravity/brain/94bbe715-35e0-45c2-826f-5dffc52640ec/sparkai_agent_avatar_icon_1773956124689.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s' }
];

const EMOJIS = ['🚀', '📈', '🧠', '⚡', '✨', '💎', '🔥', '✅', '🤖', '👑', '💸', '🎨', '🌟', '🛡️', '🛰️', '🪐', '💡', '🧪', '👾', '🌀', '🌊', '🌈', '🎉', '💥'];

function showView(viewName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    if (viewName === 'market') {
        document.getElementById('tabMarket').classList.add('active');
        document.getElementById('viewMarket').classList.add('active');
    } else {
        document.getElementById('tabRegister').classList.add('active');
        document.getElementById('viewRegister').classList.add('active');
    }
}

function handleConnect() {
    const btn = document.getElementById('connectWallet');
    btn.innerHTML = "UQCF...2q6Zf9N";
    btn.style.background = "#2b5278";
    alert("🚀 TON Wallet Connected (UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N)");
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
            const input = document.getElementById('taskInput');
            input.value += e;
            toggleModal('emojiModal', false);
            toggleSendBtn();
        };
        list.appendChild(item);
    });
}

function selectAttach(type) {
    alert(`Attachment Mode: Select ${type}`);
    toggleModal('attachModal', false);
}

function toggleSendBtn() {
    const input = document.getElementById('taskInput');
    const sendIcon = document.getElementById('sendBtnIcon');
    sendIcon.style.color = input.value.trim().length > 0 ? '#50a7ea' : '#7e8c9a';
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
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'out');
    input.value = '';
    toggleSendBtn();
    setTimeout(() => {
        appendMessage("🤖 Aggregating agent responses for your request...");
        setTimeout(renderAgentWidget, 1000);
    }, 500);
}

function renderAgentWidget() {
    const widget = document.createElement('div');
    widget.className = 'agent-widget';
    AGENTS.forEach(a => {
        const row = document.createElement('div');
        row.className = 'agent-row';
        row.onclick = () => startPayment(a.id, a.price);
        row.innerHTML = `
            <img src="${a.avatar}" class="agent-avatar-img">
            <div class="agent-body">
                <div class="agent-header">
                    <span class="name">${a.name}</span>
                    <span class="price">${a.price} TON</span>
                </div>
                <div class="preview">${a.bio}</div>
                <div class="action-row"><span class="stats">📊 ${a.stats}</span><button class="btn-unlock">Unlock</button></div>
            </div>`;
        widget.appendChild(row);
    });
    document.querySelector('.chat-viewport').appendChild(widget);
    document.querySelector('.chat-viewport').scrollTop = document.querySelector('.chat-viewport').scrollHeight;
}

function startPayment(id, amount) {
    alert(`Authorize ${amount} TON payment via TON Wallet for Unlock_${id}\n(Includes 5% Commission)`);
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
