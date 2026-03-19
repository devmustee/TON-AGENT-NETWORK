let isWalletConnected = false;
let userWalletAddress = "";

const AGENTS = [
    { id: 'agentQuality', name: 'LogicMaster', price: 0.5, avatar: 'assets/logicmaster.png', bio: 'Premium deep-reasoning for complex architectures.', stats: '96% | 4.2s' },
    { id: 'agentFast', name: 'QuickNet', price: 0.1, avatar: 'assets/quicknet.png', bio: 'High-speed summarizing. Optimized for speed.', stats: '88% | 0.8s' },
    { id: 'agentCreative', name: 'SparkAI', price: 0.3, avatar: 'assets/sparkai.png', bio: 'Creative Perspective: Unique neural perspectives.', stats: '91% | 1.9s' }
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

/**
 * 🔐 WALLET CONNECT (TON)
 * Simulates a secure TON wallet connection (e.g. TonKeeper / TonConnect)
 */
function handleConnect() {
    isWalletConnected = true;
    userWalletAddress = "UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N"; // Simulated address
    
    const btn = document.getElementById('connectWallet');
    btn.innerHTML = userWalletAddress.slice(0, 6) + "..." + userWalletAddress.slice(-4);
    btn.style.background = "var(--tg-bubble-out)";
    
    appendMessage("✅ **Wallet Connected!** You can now interact with agents and unlock solutions directly via TON Mainnet.", "in");
    alert(`🚀 TON Wallet Connected Successfully!\nAddress: ${userWalletAddress}`);
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
            if (!isWalletConnected) return alert("⚠️ Please connect your TON wallet first!");
            const input = document.getElementById('taskInput');
            input.value += e;
            toggleModal('emojiModal', false);
            toggleSendBtn();
        };
        list.appendChild(item);
    });
}

function selectAttach(type) {
    if (!isWalletConnected) return alert("⚠️ Please connect your TON wallet first!");
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
    if (!isWalletConnected) {
        alert("⚠️ Connection Required: You must connect your TON wallet to interact with agents.");
        return;
    }

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

/**
 * ⚡ TRANSACTION SIGNING (TON)
 * Simulates a TON transfer transaction for an agent unlock.
 */
function startPayment(agentId, amount) {
    if (!isWalletConnected) return alert("⚠️ Please connect your wallet first!");
    
    const receivingAddress = "UQCFatxg0rLG4YU_uRgs9rKhnrrNrttYD3r5ru1TC2q6Zf9N";
    
    // Construct the TON Transfer Bridge Link (Simulated Signing Request)
    const paymentLink = `ton://transfer/${receivingAddress}?amount=${amount * 1000000000}&text=Unlock_${agentId}`;
    
    alert(`💎 **TRANSACTION SIGNING** 💎\n\nRequesting signature to transfer ${amount} TON to ${receivingAddress}.\n(This includes the 5% platform commission)`);
    
    // In a real app, this would open TonConnect or TonKeeper for signing
    console.log(`🚀 Transaction Initiated: ${paymentLink}`);
    
    setTimeout(() => {
        appendMessage(`💸 **Transaction Signed!** Verifying ${amount} TON payment on TON Mainnet...`, "in");
        setTimeout(() => {
            appendMessage(`✅ **Payment Confirmed!** Agent solution unlocked for task reference: ${agentId}`, "in");
        }, 1500);
    }, 500);
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
