// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const registrationForm = document.getElementById('registrationForm');
const termsModal = document.getElementById('termsModal');
const agreeBtn = document.getElementById('agreeBtn');
const disagreeBtn = document.getElementById('disagreeBtn');
const ageSelect = document.getElementById('age');
const usersList = document.getElementById('usersList');
const welcomeUsername = document.getElementById('welcomeUsername');
const logoutBtn = document.getElementById('logoutBtn');
const privateChatModal = document.getElementById('privateChatModal');
const closeChatBtn = document.getElementById('closeChatBtn');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');

// New modal elements
const genderFilterBtn = document.getElementById('genderFilterBtn');
const genderFilterModal = document.getElementById('genderFilterModal');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const inboxBtn = document.getElementById('inboxBtn');
const inboxModal = document.getElementById('inboxModal');
const inboxList = document.getElementById('inboxList');
const friendsBtn = document.getElementById('friendsBtn');
const friendsModal = document.getElementById('friendsModal');
const friendsList = document.getElementById('friendsList');
const randomBtn = document.getElementById('randomBtn');

// User data storage
let currentUser = null;
let currentChatUser = null;
let users = [];
let messages = {};
let chatHistory = [];
let inboxMessages = [];
let friends = [];
let currentGenderFilter = 'all';

// Initialize age dropdown (18-99)
function initializeAgeDropdown() {
    for (let i = 18; i <= 99; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
    }
}

// Generate sample users
function generateSampleUsers() {
    const genders = ['male', 'female'];
    const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Brazil', 'Japan', 'South Korea', 'China', 'Russia', 'Mexico', 'South Africa', 'Singapore', 'UAE'];
    const states = ['California', 'New York', 'Texas', 'Maharashtra', 'Karnataka', 'Ontario', 'Bavaria', 'New South Wales', 'São Paulo', 'Tokyo', 'Seoul', 'Moscow', 'Cape Town', 'Singapore', 'Dubai'];
    const names = ['Alex', 'Emma', 'James', 'Sophia', 'Michael', 'Olivia', 'David', 'Isabella', 'William', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Daniel', 'Abigail'];

    for (let i = 0; i < 17; i++) {
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const age = Math.floor(Math.random() * (45 - 18 + 1)) + 18;

        users.push({
            id: i + 1,
            username: name,
            gender: gender,
            age: age,
            country: country,
            state: state,
            online: true
        });
    }
}

// Get country flag emoji
function getCountryFlag(country) {
    const flags = {
        'India': '🇮🇳',
        'USA': '🇺🇸',
        'UK': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Spain': '🇪🇸',
        'Italy': '🇮🇹',
        'Netherlands': '🇳🇱',
        'Brazil': '🇧🇷',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'China': '🇨🇳',
        'Russia': '🇷🇺',
        'Mexico': '🇲🇽',
        'South Africa': '🇿🇦',
        'Singapore': '🇸🇬',
        'UAE': '🇦🇪'
    };
    return flags[country] || '🌍';
}

// Render users list
function renderUsers(filterGender = 'all') {
    usersList.innerHTML = '';
    
    const filteredUsers = filterGender === 'all' 
        ? users 
        : users.filter(user => user.gender === filterGender);

    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-avatar ${user.gender}">
                ${user.gender === 'female' ? '♀' : '♂'}
            </div>
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-details">${user.age} Yrs • ${user.state}</div>
                <div class="user-details">${user.country}</div>
            </div>
            <div class="user-flag">${getCountryFlag(user.country)}</div>
        `;
        
        userCard.addEventListener('click', () => openPrivateChat(user));
        usersList.appendChild(userCard);
    });

    // Update online count
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = filteredUsers.length;
    }
}

// Form validation and submission
registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const age = document.getElementById('age').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value.trim();

    // Validate all fields
    if (!username) {
        alert('Please enter a username');
        return;
    }

    if (!gender) {
        alert('Please select your gender');
        return;
    }

    if (!age) {
        alert('Please select your age');
        return;
    }

    if (!country) {
        alert('Please select your country');
        return;
    }

    if (!state) {
        alert('Please enter your state');
        return;
    }

    // Store current user data
    currentUser = {
        username: username,
        gender: gender,
        age: age,
        country: country,
        state: state
    };

    // Show terms modal
    termsModal.classList.add('active');
});

// Terms modal buttons
agreeBtn.addEventListener('click', function() {
    // Hide terms modal
    termsModal.classList.remove('active');
    
    // Hide landing screen
    loginScreen.style.display = 'none';
    
    // Show chat screen
    chatScreen.style.display = 'block';
    
    // Update welcome message
    welcomeUsername.textContent = currentUser.username;
    
    // Initialize chat functionality
    initializeChat();
});

disagreeBtn.addEventListener('click', function() {
    // Hide terms modal and stay on landing page
    termsModal.classList.remove('active');
});

// Initialize chat functionality
function initializeChat() {
    generateSampleUsers();
    renderUsers();
    generateSampleFriends();
    generateSampleInbox();
    generateSampleHistory();
}

// Generate sample friends
function generateSampleFriends() {
    const friendCount = Math.floor(Math.random() * 4) + 2; // 2-5 friends
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < friendCount && i < shuffledUsers.length; i++) {
        friends.push({
            ...shuffledUsers[i],
            status: Math.random() > 0.3 ? 'online' : 'offline'
        });
    }
}

// Generate sample inbox messages
function generateSampleInbox() {
    const messageCount = Math.floor(Math.random() * 4) + 3; // 3-6 messages
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < messageCount && i < shuffledUsers.length; i++) {
        const user = shuffledUsers[i];
        const messages = [
            "Hey! How are you doing?",
            "Would you like to chat?",
            "I saw your profile, nice to meet you!",
            "What are you up to today?",
            "Looking for new friends!",
            "Hello from the other side!"
        ];
        
        inboxMessages.push({
            id: i + 1,
            user: user,
            message: messages[Math.floor(Math.random() * messages.length)],
            time: getRandomTime(),
            unread: Math.random() > 0.5
        });
    }
}

// Generate sample chat history
function generateSampleHistory() {
    const historyCount = Math.floor(Math.random() * 5) + 3; // 3-7 history items
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < historyCount && i < shuffledUsers.length; i++) {
        const user = shuffledUsers[i];
        const previews = [
            "That was a great conversation!",
            "We should chat again sometime.",
            "Thanks for the interesting talk.",
            "Had fun chatting with you!",
            "Looking forward to our next chat."
        ];
        
        chatHistory.push({
            id: i + 1,
            user: user,
            lastMessage: previews[Math.floor(Math.random() * previews.length)],
            time: getRandomTime(),
            messageCount: Math.floor(Math.random() * 20) + 5
        });
    }
}

// Get random time within last 24 hours
function getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    if (hours === 0) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return '1d ago';
    }
}

// Open private chat
function openPrivateChat(user) {
    currentChatUser = user;
    
    // Update modal header
    document.getElementById('chatUserName').textContent = user.username;
    const chatAvatar = document.getElementById('chatUserAvatar');
    chatAvatar.className = `chat-avatar ${user.gender}`;
    chatAvatar.textContent = user.gender === 'female' ? '♀' : '♂';
    
    // Clear and load messages
    chatMessages.innerHTML = '';
    if (messages[user.id]) {
        messages[user.id].forEach(msg => renderMessage(msg));
    } else {
        // Add welcome message
        const welcomeMsg = {
            type: 'received',
            content: `Hi ${currentUser.username}! I'm ${user.username}. How are you today?`,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        messages[user.id] = [welcomeMsg];
        renderMessage(welcomeMsg);
    }
    
    // Show modal
    privateChatModal.classList.add('active');
    
    // Focus on input
    messageInput.focus();
}

// Close private chat
closeChatBtn.addEventListener('click', function() {
    privateChatModal.classList.remove('active');
    currentChatUser = null;
});

// Render message
function renderMessage(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.type}`;
    messageDiv.innerHTML = `
        <div class="message-content">${msg.content}</div>
        <div class="message-time">${msg.time}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentChatUser) return;

    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Add sent message
    const sentMsg = {
        type: 'sent',
        content: content,
        time: time
    };
    
    // Store message
    if (!messages[currentChatUser.id]) {
        messages[currentChatUser.id] = [];
    }
    messages[currentChatUser.id].push(sentMsg);
    
    // Update chat history
    updateChatHistory(currentChatUser, content);
    
    renderMessage(sentMsg);
    messageInput.value = '';

    // Simulate response after 1-2 seconds
    setTimeout(() => {
        const responses = [
            "That's interesting!",
            "I see what you mean.",
            "Tell me more about that.",
            "That sounds great!",
            "I agree with you.",
            "Really? That's cool!",
            "Thanks for sharing.",
            "I understand.",
            "That makes sense.",
            "Good point!"
        ];
        
        const responseMsg = {
            type: 'received',
            content: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        messages[currentChatUser.id].push(responseMsg);
        
        if (currentChatUser) {
            renderMessage(responseMsg);
        }
    }, 1000 + Math.random() * 1000);
}

// Update chat history
function updateChatHistory(user, lastMessage) {
    const existingHistory = chatHistory.find(h => h.user.id === user.id);
    if (existingHistory) {
        existingHistory.lastMessage = lastMessage;
        existingHistory.time = 'Just now';
        existingHistory.messageCount++;
    } else {
        chatHistory.unshift({
            id: chatHistory.length + 1,
            user: user,
            lastMessage: lastMessage,
            time: 'Just now',
            messageCount: 1
        });
    }
}

// Send message button click
sendMessageBtn.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Gender Filter Modal
genderFilterBtn.addEventListener('click', function() {
    genderFilterModal.classList.add('active');
});

// Gender filter options
document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
        const filter = this.dataset.filter;
        currentGenderFilter = filter;
        
        // Update active state
        document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Update icon
        const icon = genderFilterBtn.querySelector('.action-icon');
        if (filter === 'female') {
            icon.textContent = '♀';
            icon.style.color = '#ff69b4';
        } else if (filter === 'male') {
            icon.textContent = '♂';
            icon.style.color = '#0088cc';
        } else {
            icon.textContent = '⚥';
            icon.style.color = '';
        }
        
        renderUsers(currentGenderFilter);
        genderFilterModal.classList.remove('active');
    });
});

// History Modal
historyBtn.addEventListener('click', function() {
    renderHistory();
    historyModal.classList.add('active');
});

function renderHistory() {
    historyList.innerHTML = '';
    
    if (chatHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📜</div>
                <div class="empty-state-text">No chat history yet</div>
                <div class="empty-state-subtext">Start chatting to build your history</div>
            </div>
        `;
        return;
    }
    
    chatHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-user">
                <div class="history-avatar ${item.user.gender}">
                    ${item.user.gender === 'female' ? '♀' : '♂'}
                </div>
                <div class="history-username">${item.user.username}</div>
            </div>
            <div class="history-preview">${item.lastMessage}</div>
            <div class="history-time">${item.time} • ${item.messageCount} messages</div>
        `;
        
        historyItem.addEventListener('click', () => {
            historyModal.classList.remove('active');
            openPrivateChat(item.user);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Search Modal
searchBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchModal.classList.add('active');
    searchInput.focus();
});

searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    let filteredUsers = users.filter(user => {
        if (searchType === 'all') {
            return user.username.toLowerCase().includes(query) ||
                   user.state.toLowerCase().includes(query) ||
                   user.country.toLowerCase().includes(query);
        } else if (searchType === 'username') {
            return user.username.toLowerCase().includes(query);
        } else if (searchType === 'state') {
            return user.state.toLowerCase().includes(query);
        } else if (searchType === 'country') {
            return user.country.toLowerCase().includes(query);
        }
        return false;
    });
    
    renderSearchResults(filteredUsers);
});

function renderSearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No users found matching your search</div>';
        return;
    }
    
    results.forEach(user => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="user-avatar ${user.gender}" style="width: 40px; height: 40px; font-size: 18px;">
                ${user.gender === 'female' ? '♀' : '♂'}
            </div>
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-details">${user.age} Yrs • ${user.state}</div>
                <div class="user-details">${user.country}</div>
            </div>
            <div class="user-flag">${getCountryFlag(user.country)}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            searchModal.classList.remove('active');
            openPrivateChat(user);
        });
        
        searchResults.appendChild(resultItem);
    });
}

// Search type change
document.querySelectorAll('input[name="searchType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (searchInput.value.trim()) {
            searchInput.dispatchEvent(new Event('input'));
        }
    });
});

// Inbox Modal
inboxBtn.addEventListener('click', function() {
    renderInbox();
    inboxModal.classList.add('active');
});

function renderInbox() {
    inboxList.innerHTML = '';
    
    if (inboxMessages.length === 0) {
        inboxList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📥</div>
                <div class="empty-state-text">No messages in your inbox</div>
                <div class="empty-state-subtext">Messages will appear here when you receive them</div>
            </div>
        `;
        return;
    }
    
    inboxMessages.forEach(msg => {
        const inboxItem = document.createElement('div');
        inboxItem.className = `inbox-item ${msg.unread ? 'unread' : ''}`;
        inboxItem.innerHTML = `
            <div class="inbox-header">
                <div class="inbox-user">
                    <div class="inbox-avatar ${msg.user.gender}">
                        ${msg.user.gender === 'female' ? '♀' : '♂'}
                    </div>
                    <div class="inbox-username">${msg.user.username}</div>
                </div>
                <div class="inbox-time">${msg.time}</div>
            </div>
            <div class="inbox-message">${msg.message}</div>
            ${msg.unread ? '<span class="inbox-badge">New</span>' : ''}
        `;
        
        inboxItem.addEventListener('click', () => {
            msg.unread = false;
            inboxModal.classList.remove('active');
            openPrivateChat(msg.user);
        });
        
        inboxList.appendChild(inboxItem);
    });
}

// Friends Modal
friendsBtn.addEventListener('click', function() {
    renderFriends();
    friendsModal.classList.add('active');
});

function renderFriends() {
    friendsList.innerHTML = '';
    
    if (friends.length === 0) {
        friendsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-text">No friends yet</div>
                <div class="empty-state-subtext">Add users to your friends list to see them here</div>
            </div>
        `;
        return;
    }
    
    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.innerHTML = `
            <div class="friend-avatar ${friend.gender}">
                ${friend.gender === 'female' ? '♀' : '♂'}
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-details">${friend.age} Yrs • ${friend.country}</div>
                <div class="friend-status">${friend.status === 'online' ? '🟢 Online' : '⚫ Offline'}</div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn chat">Chat</button>
                <button class="friend-action-btn remove">Remove</button>
            </div>
        `;
        
        // Chat button
        friendItem.querySelector('.chat').addEventListener('click', () => {
            friendsModal.classList.remove('active');
            openPrivateChat(friend);
        });
        
        // Remove button
        friendItem.querySelector('.remove').addEventListener('click', (e) => {
            e.stopPropagation();
            friends = friends.filter(f => f.id !== friend.id);
            renderFriends();
        });
        
        friendsList.appendChild(friendItem);
    });
}

// Random Chat
randomBtn.addEventListener('click', function() {
    const onlineUsers = users.filter(user => user.online);
    if (onlineUsers.length === 0) {
        alert('No online users available for random chat');
        return;
    }
    
    const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    openPrivateChat(randomUser);
});

// Close modal buttons
document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.classList.remove('active');
    });
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Logout functionality
logoutBtn.addEventListener('click', function() {
    // Reset everything
    currentUser = null;
    currentChatUser = null;
    users = [];
    messages = {};
    chatHistory = [];
    inboxMessages = [];
    friends = [];
    currentGenderFilter = 'all';
    
    // Reset form
    registrationForm.reset();
    
    // Reset gender filter icon
    const icon = genderFilterBtn.querySelector('.action-icon');
    icon.textContent = '⚥';
    icon.style.color = '';
    
    // Reset gender filter modal options
    document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.filter-option[data-filter="all"]').classList.add('active');
    
    // Show landing screen
    loginScreen.style.display = 'flex';
    chatScreen.style.display = 'none';
    
    // Close any open modals
    privateChatModal.classList.remove('active');
    termsModal.classList.remove('active');
    genderFilterModal.classList.remove('active');
    historyModal.classList.remove('active');
    searchModal.classList.remove('active');
    inboxModal.classList.remove('active');
    friendsModal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === termsModal) {
        termsModal.classList.remove('active');
    }
    if (e.target === privateChatModal) {
        privateChatModal.classList.remove('active');
        currentChatUser = null;
    }
    if (e.target === genderFilterModal) {
        genderFilterModal.classList.remove('active');
    }
    if (e.target === historyModal) {
        historyModal.classList.remove('active');
    }
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
    }
    if (e.target === inboxModal) {
        inboxModal.classList.remove('active');
    }
    if (e.target === friendsModal) {
        friendsModal.classList.remove('active');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAgeDropdown();
});
