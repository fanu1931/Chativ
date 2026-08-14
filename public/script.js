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
const genderFilter = document.getElementById('genderFilter');

// User data storage
let currentUser = null;
let currentChatUser = null;
let users = [];
let messages = {};

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
        renderMessage({
            type: 'received',
            content: `Hi ${currentUser.username}! I'm ${user.username}. How are you today?`,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
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

// Send message button click
sendMessageBtn.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Gender filter
let currentGenderFilter = 'all';
genderFilter.addEventListener('click', function() {
    if (currentGenderFilter === 'all') {
        currentGenderFilter = 'female';
    } else if (currentGenderFilter === 'female') {
        currentGenderFilter = 'male';
    } else {
        currentGenderFilter = 'all';
    }
    
    // Update icon
    const icon = genderFilter.querySelector('.action-icon');
    if (currentGenderFilter === 'female') {
        icon.textContent = '♀';
        icon.style.color = '#ff69b4';
    } else if (currentGenderFilter === 'male') {
        icon.textContent = '♂';
        icon.style.color = '#0088cc';
    } else {
        icon.textContent = '⚥';
        icon.style.color = '';
    }
    
    renderUsers(currentGenderFilter);
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
    currentGenderFilter = 'all';
    
    // Reset form
    registrationForm.reset();
    
    // Reset gender filter icon
    const icon = genderFilter.querySelector('.action-icon');
    icon.textContent = '⚥';
    icon.style.color = '';
    
    // Show landing screen
    loginScreen.style.display = 'flex';
    chatScreen.style.display = 'none';
    
    // Close any open modals
    privateChatModal.classList.remove('active');
    termsModal.classList.remove('active');
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
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAgeDropdown();
});
