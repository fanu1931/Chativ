// DOM Elements
const landingPage = document.getElementById('landing-page');
const chatPage = document.getElementById('chat-page');
const nicknameInput = document.getElementById('nickname');
const ageInput = document.getElementById('age');
const countryInput = document.getElementById('country');
const stateInput = document.getElementById('state');
const enterChatBtn = document.getElementById('enter-chat');
const welcomeMessage = document.getElementById('welcome-message');
const navUsername = document.getElementById('nav-username');
const logoutBtn = document.getElementById('logout-btn');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
const roomsContainer = document.getElementById('rooms-container');
const inboxContainer = document.getElementById('inbox-container');
const usersList = document.getElementById('users-list');
const privateChatModal = document.getElementById('private-chat-modal');
const privateChatTitle = document.getElementById('private-chat-title');
const closePrivateChatBtn = document.getElementById('close-private-chat');
const privateMessages = document.getElementById('private-messages');
const privateMessageInput = document.getElementById('private-message-input');
const sendPrivateMessageBtn = document.getElementById('send-private-message');

// New DOM Elements for Chatib redesign
const termsModal = document.getElementById('terms-modal');
const termsAgreeBtn = document.getElementById('terms-agree');
const termsDisagreeBtn = document.getElementById('terms-disagree');
const landingHamburgerMenu = document.getElementById('landing-hamburger-menu');
const genderDropdown = document.getElementById('gender-dropdown');
const genderDropdownMenu = document.getElementById('gender-dropdown-menu');
const soundToggle = document.getElementById('sound-toggle');
const onlineCount = document.getElementById('online-count');
const chatTabs = document.querySelectorAll('.chat-tab');

// New modal elements
const historyModal = document.getElementById('history-modal');
const historyModalClose = document.getElementById('history-modal-close');
const searchModal = document.getElementById('search-modal');
const searchModalClose = document.getElementById('search-modal-close');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const friendsModal = document.getElementById('friends-modal');
const friendsModalClose = document.getElementById('friends-modal-close');

// Login and Register modal elements
const loginModal = document.getElementById('login-modal');
const loginModalClose = document.getElementById('login-modal-close');
const registerModal = document.getElementById('register-modal');
const registerModalClose = document.getElementById('register-modal-close');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const loginSubmit = document.getElementById('login-submit');
const registerSubmit = document.getElementById('register-submit');

// Logout elements
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout');

// Store current users for filtering
let allUsers = [];
let currentGenderFilter = 'all';

// Mobile menu elements
const hamburgerMenu = document.getElementById('hamburger-menu');
const mobileNavMenu = document.getElementById('mobile-nav-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const backdropOverlay = document.getElementById('backdrop-overlay');
const mobileLeaveChatBtn = document.getElementById('mobile-leave-chat');

// Mobile navigation elements
const chatView = document.getElementById('chat-view');
const roomsView = document.getElementById('rooms-view');
const usersView = document.getElementById('users-view');
const privateView = document.getElementById('private-view');
const mobileRoomsContainer = document.getElementById('mobile-rooms-container');
const mobileUsersList = document.getElementById('mobile-users-list');
const mobileInboxContainer = document.getElementById('mobile-inbox-container');
const navTabs = document.querySelectorAll('.nav-tab');

// Header navigation elements
const freeChatRoomsBtn = document.getElementById('free-chat-rooms');
const oneOnOneChatBtn = document.getElementById('one-on-one-chat');
const chatRoomsBtn = document.getElementById('chat-rooms');
const profileBtn = document.getElementById('profile');

// Profile modal elements
const profileModal = document.getElementById('profile-modal');
const closeProfileBtn = document.getElementById('close-profile');
const updateProfileBtn = document.getElementById('update-profile');

// Legal modal elements
const legalModal = document.getElementById('legal-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// User data
let currentUser = {
    nickname: '',
    age: '',
    gender: '',
    country: '',
    state: ''
};

let currentPrivateChatUser = null;
let socket = null;
let privateMessageHistory = {};

// Initialize Socket.io
function initSocket() {
    socket = io();

    // Listen for chat messages
    socket.on('chat-message', (data) => {
        displayMessage(data);
    });

    // Listen for system messages
    socket.on('system-message', (data) => {
        displaySystemMessage(data.message);
    });

    // Listen for user list updates
    socket.on('user-list', (users) => {
        displayUsers(users);
    });



    // Listen for private messages
    socket.on('private-message', (data) => {
        displayPrivateMessage(data);
    });

    // Listen for errors
    socket.on('error', (data) => {
        alert(data.message);
    });
}

// Get selected gender from radio buttons
function getSelectedGender() {
    const genderRadios = document.getElementsByName('gender');
    for (const radio of genderRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return '';
}

// Handle state dropdown "Other" option
const stateSelect = document.getElementById('state');
const stateManual = document.getElementById('state-manual');

stateSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
        stateManual.style.display = 'block';
        stateManual.required = true;
        stateSelect.required = false;
    } else {
        stateManual.style.display = 'none';
        stateManual.required = false;
        stateSelect.required = true;
    }
});

// Handle edit state dropdown "Other" option
const editStateSelect = document.getElementById('edit-state');
const editStateManual = document.getElementById('edit-state-manual');

if (editStateSelect) {
    editStateSelect.addEventListener('change', function() {
        if (this.value === 'Other') {
            editStateManual.style.display = 'block';
        } else {
            editStateManual.style.display = 'none';
        }
    });
}

// Get state value (from dropdown or manual input)
function getStateValue() {
    if (stateSelect.value === 'Other') {
        return stateManual.value.trim();
    }
    return stateSelect.value;
}

// Get edit state value (from dropdown or manual input)
function getEditStateValue() {
    if (editStateSelect && editStateSelect.value === 'Other') {
        return editStateManual ? editStateManual.value.trim() : '';
    }
    return editStateSelect ? editStateSelect.value : '';
}

// Login and Register link functionality
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('hidden');
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('hidden');
});

// Login modal close button
loginModalClose.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

// Register modal close button
registerModalClose.addEventListener('click', () => {
    registerModal.classList.add('hidden');
});

// Switch to Register from Login
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('hidden');
    registerModal.classList.remove('hidden');
});

// Switch to Login from Register
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// Login form submission
loginSubmit.addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // For demo purposes, simulate login by using the main form
    alert('Login feature is for demonstration. Please use the main form to enter chat.');
    loginModal.classList.add('hidden');
});

// Register form submission
registerSubmit.addEventListener('click', () => {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('register-confirm-password').value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // For demo purposes, simulate registration
    alert('Registration feature is for demonstration. Please use the main form to enter chat.');
    registerModal.classList.add('hidden');
});

// Close modals on outside click
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

registerModal.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.classList.add('hidden');
    }
});

// Terms modal functionality
enterChatBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    const age = ageInput.value;
    const gender = getSelectedGender();
    const country = countryInput.value;
    const state = getStateValue();

    if (!nickname || !age || !gender || !country || !state) {
        alert('Please fill in all fields');
        return;
    }

    if (age < 18) {
        alert('You must be 18 or older to join this chat.');
        return;
    }

    // Show terms modal
    termsModal.classList.remove('hidden');
});

termsAgreeBtn.addEventListener('click', () => {
    // Proceed with chat entry
    const nickname = nicknameInput.value.trim();
    const age = ageInput.value;
    const gender = getSelectedGender();
    const country = countryInput.value;
    const state = getStateValue();

    currentUser = { nickname, age, gender, country, state };

    // Save state to localStorage
    localStorage.setItem('userState', state);

    // Initialize socket and join
    initSocket();
    socket.emit('join', currentUser);

    // Update UI
    landingPage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    welcomeMessage.textContent = `Welcome to ${state} Chat Room`;
    navUsername.textContent = nickname;

    // Clear messages
    messagesContainer.innerHTML = '';
    displaySystemMessage(`Welcome to ${state} Chat Room!`);
    
    // Display state room in sidebar
    displayRooms();
    
    // Initialize inbox
    displayInbox();

    // Hide terms modal
    termsModal.classList.add('hidden');
});

termsDisagreeBtn.addEventListener('click', () => {
    termsModal.classList.add('hidden');
});

// Enter chat room (original functionality moved to terms agree)
function enterChatRoom() {
    const nickname = nicknameInput.value.trim();
    const age = ageInput.value;
    const gender = getSelectedGender();
    const country = countryInput.value;
    const state = stateInput.value.trim();

    if (!nickname || !age || !gender || !country || !state) {
        alert('Please fill in all fields');
        return;
    }

    if (age < 18) {
        alert('You must be 18 or older to join this chat.');
        return;
    }

    currentUser = { nickname, age, gender, country, state };

    // Save state to localStorage
    localStorage.setItem('userState', state);

    // Initialize socket and join
    initSocket();
    socket.emit('join', currentUser);

    // Update UI
    landingPage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    welcomeMessage.textContent = `Welcome to ${state} Chat Room`;
    navUsername.textContent = nickname;

    // Clear messages
    messagesContainer.innerHTML = '';
    displaySystemMessage(`Welcome to ${state} Chat Room!`);
    
    // Display state room in sidebar
    displayRooms();
    
    // Initialize inbox
    displayInbox();
}

// Logout functionality
function handleLogout() {
    if (socket) {
        socket.disconnect();
    }
    chatPage.classList.add('hidden');
    landingPage.classList.remove('hidden');
    
    // Reset form
    nicknameInput.value = '';
    ageInput.value = '';
    countryInput.value = '';
    stateSelect.value = '';
    stateManual.value = '';
    stateManual.style.display = 'none';
    stateSelect.required = true;
    stateManual.required = false;
    
    // Reset gender radio buttons
    const genderRadios = document.getElementsByName('gender');
    for (const radio of genderRadios) {
        radio.checked = false;
    }
    
    messagesContainer.innerHTML = '';
    
    // Reset user data
    currentUser = {
        nickname: '',
        age: '',
        gender: '',
        country: '',
        state: ''
    };
    
    // Clear private message history
    privateMessageHistory = {};
}

logoutBtn.addEventListener('click', handleLogout);

// Mobile logout
mobileLogoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    handleLogout();
});

// Send message
sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    socket.emit('chat-message', { message });
    messageInput.value = '';
}

// Display message in chat
function displayMessage(data) {
    const messageDiv = document.createElement('div');
    const isOwn = data.nickname === currentUser.nickname;
    
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="nickname">${data.nickname}</span>
            <span class="timestamp">${data.timestamp}</span>
        </div>
        <div class="message-bubble">${escapeHtml(data.message)}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Display system message
function displaySystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Display current state room
function displayRooms() {
    // Desktop sidebar - show current state room only
    roomsContainer.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = currentUser.state;
    li.className = 'active';
    roomsContainer.appendChild(li);
    
    // Mobile view
    mobileRoomsContainer.innerHTML = '';
    const mobileLi = document.createElement('li');
    mobileLi.textContent = currentUser.state;
    mobileLi.className = 'active';
    mobileRoomsContainer.appendChild(mobileLi);
}

// Display inbox/private messages
function displayInbox() {
    inboxContainer.innerHTML = '';
    
    const conversations = Object.keys(privateMessageHistory);
    
    if (conversations.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'inbox-empty';
        emptyLi.textContent = 'No private messages yet';
        inboxContainer.appendChild(emptyLi);
        return;
    }
    
    conversations.forEach(nickname => {
        const history = privateMessageHistory[nickname];
        const lastMessage = history[history.length - 1];
        const li = document.createElement('li');
        
        const initials = nickname.substring(0, 2).toUpperCase();
        // Default to male avatar color for inbox
        const genderClass = 'male';
        
        li.innerHTML = `
            <div class="inbox-avatar ${genderClass}">${initials}</div>
            <div class="inbox-info">
                <div class="inbox-name">${escapeHtml(nickname)}</div>
                <div class="inbox-preview">${escapeHtml(lastMessage.message)}</div>
            </div>
        `;
        
        li.addEventListener('click', () => {
            openPrivateChat(nickname);
        });
        
        inboxContainer.appendChild(li);
    });
}

// Display mobile inbox/private messages
function displayMobileInbox() {
    mobileInboxContainer.innerHTML = '';
    
    const conversations = Object.keys(privateMessageHistory);
    
    if (conversations.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'inbox-empty';
        emptyLi.textContent = 'No private messages yet';
        mobileInboxContainer.appendChild(emptyLi);
        return;
    }
    
    conversations.forEach(nickname => {
        const history = privateMessageHistory[nickname];
        const lastMessage = history[history.length - 1];
        const li = document.createElement('li');
        
        const initials = nickname.substring(0, 2).toUpperCase();
        // Default to male avatar color for mobile inbox
        const genderClass = 'male';
        
        li.innerHTML = `
            <div class="inbox-avatar ${genderClass}">${initials}</div>
            <div class="inbox-info">
                <div class="inbox-name">${escapeHtml(nickname)}</div>
                <div class="inbox-preview">${escapeHtml(lastMessage.message)}</div>
            </div>
        `;
        
        li.addEventListener('click', () => {
            openPrivateChat(nickname);
        });
        
        mobileInboxContainer.appendChild(li);
    });
}

// Display online users
function displayUsers(users) {
    // Store all users for filtering
    allUsers = users;
    
    // Apply gender filter if set
    let filteredUsers = users;
    if (currentGenderFilter !== 'all') {
        filteredUsers = users.filter(user => 
            user.gender.toLowerCase() === currentGenderFilter
        );
    }
    
    // Sort users: same state first, then others
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a.state === currentUser.state && b.state !== currentUser.state) {
            return -1;
        }
        if (a.state !== currentUser.state && b.state === currentUser.state) {
            return 1;
        }
        return 0;
    });

    // Update online count
    onlineCount.textContent = users.length;

    // Desktop sidebar
    usersList.innerHTML = '';
    sortedUsers.forEach(user => {
        const li = document.createElement('li');
        
        const initials = user.nickname.substring(0, 2).toUpperCase();
        const countryFlag = getCountryFlag(user.country);
        const genderClass = user.gender.toLowerCase() === 'female' ? 'female' : 'male';
        
        li.innerHTML = `
            <div class="user-avatar ${genderClass}">${initials}</div>
            <div class="user-info-text">
                <div class="user-name">${escapeHtml(user.nickname)}</div>
                <div class="user-details">${user.age} Yrs, ${user.state} <span class="country-flag">${countryFlag}</span></div>
            </div>
            <div class="online-status"></div>
        `;
        
        if (user.nickname !== currentUser.nickname) {
            li.addEventListener('click', (e) => {
                openPrivateChat(user.nickname);
            });
        }
        
        usersList.appendChild(li);
    });
    
    // Mobile view
    mobileUsersList.innerHTML = '';
    sortedUsers.forEach(user => {
        const li = document.createElement('li');
        
        const initials = user.nickname.substring(0, 2).toUpperCase();
        const countryFlag = getCountryFlag(user.country);
        const genderClass = user.gender.toLowerCase() === 'female' ? 'female' : 'male';
        
        li.innerHTML = `
            <div class="user-avatar ${genderClass}">${initials}</div>
            <div class="user-info-text">
                <div class="user-name">${escapeHtml(user.nickname)}</div>
                <div class="user-details">${user.age} Yrs, ${user.state} <span class="country-flag">${countryFlag}</span></div>
            </div>
            <div class="online-status"></div>
        `;
        
        if (user.nickname !== currentUser.nickname) {
            li.addEventListener('click', (e) => {
                openPrivateChat(user.nickname);
            });
        }
        
        mobileUsersList.appendChild(li);
    });
}

// Get country flag emoji
function getCountryFlag(country) {
    const flags = {
        'India': '🇮🇳',
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Other': '🌍'
    };
    return flags[country] || '🌍';
}

// Open private chat
function openPrivateChat(nickname) {
    currentPrivateChatUser = nickname;
    privateChatTitle.textContent = `Private Chat with ${nickname}`;
    privateMessages.innerHTML = '';
    
    // Load message history if exists
    if (privateMessageHistory[nickname]) {
        privateMessageHistory[nickname].forEach(msg => {
            const isOwn = msg.from === currentUser.nickname;
            const messageDiv = document.createElement('div');
            
            messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
            
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="nickname">${isOwn ? 'To: ' + msg.to : 'From: ' + msg.from}</span>
                    <span class="timestamp">${msg.timestamp}</span>
                </div>
                <div class="message-bubble">${escapeHtml(msg.message)}</div>
            `;
            
            privateMessages.appendChild(messageDiv);
        });
        privateMessages.scrollTop = privateMessages.scrollHeight;
    }
    
    privateChatModal.classList.remove('hidden');
    privateMessageInput.focus();
}

// Close private chat
closePrivateChatBtn.addEventListener('click', () => {
    privateChatModal.classList.add('hidden');
    currentPrivateChatUser = null;
});

// Send private message
sendPrivateMessageBtn.addEventListener('click', sendPrivateMessage);
privateMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendPrivateMessage();
    }
});

function sendPrivateMessage() {
    const message = privateMessageInput.value.trim();
    if (!message || !currentPrivateChatUser) return;

    socket.emit('private-message', {
        targetNickname: currentPrivateChatUser,
        message: message
    });
    
    privateMessageInput.value = '';
}

// Display private message
function displayPrivateMessage(data) {
    const isOwn = data.from === currentUser.nickname;
    const otherUser = isOwn ? data.to : data.from;
    
    // Store message in history
    if (!privateMessageHistory[otherUser]) {
        privateMessageHistory[otherUser] = [];
    }
    privateMessageHistory[otherUser].push(data);
    
    // Update inbox
    displayInbox();
    
    // Update inbox notification badge
    updateInboxBadge();
    
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="nickname">${isOwn ? 'To: ' + data.to : 'From: ' + data.from}</span>
            <span class="timestamp">${data.timestamp}</span>
        </div>
        <div class="message-bubble">${escapeHtml(data.message)}</div>
    `;
    
    privateMessages.appendChild(messageDiv);
    privateMessages.scrollTop = privateMessages.scrollHeight;
    
    // If modal is closed and we receive a message, open it
    if (privateChatModal.classList.contains('hidden')) {
        openPrivateChat(otherUser);
    }
}

// Update inbox notification badge
function updateInboxBadge() {
    const inboxBadge = document.getElementById('inbox-badge');
    const conversationCount = Object.keys(privateMessageHistory).length;
    
    if (conversationCount > 0) {
        inboxBadge.textContent = conversationCount;
        inboxBadge.classList.add('active');
    } else {
        inboxBadge.classList.remove('active');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Report user
function reportUser(nickname) {
    if (confirm(`Are you sure you want to report ${nickname} for abusive behavior?`)) {
        socket.emit('report-user', { targetNickname: nickname });
    }
}

// Close modal on outside click
privateChatModal.addEventListener('click', (e) => {
    if (e.target === privateChatModal) {
        privateChatModal.classList.add('hidden');
        currentPrivateChatUser = null;
    }
});

// Mobile Navigation
function switchMobileTab(tab) {
    // Update nav tabs
    navTabs.forEach(navTab => {
        navTab.classList.remove('active');
        if (navTab.dataset.tab === tab) {
            navTab.classList.add('active');
        }
    });
    
    // Hide all views
    chatView.classList.remove('active');
    chatView.classList.add('hidden');
    roomsView.classList.remove('active');
    roomsView.classList.add('hidden');
    usersView.classList.remove('active');
    usersView.classList.add('hidden');
    privateView.classList.remove('active');
    privateView.classList.add('hidden');
    
    // Show selected view
    switch(tab) {
        case 'chat':
            chatView.classList.remove('hidden');
            chatView.classList.add('active');
            break;
        case 'rooms':
            roomsView.classList.remove('hidden');
            roomsView.classList.add('active');
            break;
        case 'users':
            usersView.classList.remove('hidden');
            usersView.classList.add('active');
            break;
        case 'private':
            privateView.classList.remove('hidden');
            privateView.classList.add('active');
            displayMobileInbox();
            break;
    }
}

// Add event listeners to mobile nav tabs
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchMobileTab(tabName);
    });
});

// Header navigation event listeners
freeChatRoomsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Return to main chat view
    switchMobileTab('chat');
    // On desktop, ensure chat view is visible
    chatView.classList.add('active');
    roomsView.classList.remove('active');
    usersView.classList.remove('active');
});

oneOnOneChatBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Open private messaging panel - show most recent private chat or list
    const conversations = Object.keys(privateMessageHistory);
    if (conversations.length > 0) {
        // Open most recent conversation
        openPrivateChat(conversations[conversations.length - 1]);
    } else {
        // Show private chat list tab to start a private chat
        switchMobileTab('private');
        // On desktop, scroll to inbox sidebar
        const inboxSidebar = document.querySelector('.inbox-list');
        if (inboxSidebar) {
            inboxSidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

chatRoomsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Toggle/show rooms list
    switchMobileTab('rooms');
    // On desktop, scroll to rooms sidebar
    const roomsSidebar = document.querySelector('.sidebar-left');
    if (roomsSidebar) {
        roomsSidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

profileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Open profile modal
    openProfileModal();
});

// Profile modal functions
function openProfileModal() {
    // Populate edit fields with current user data
    document.getElementById('edit-nickname').value = currentUser.nickname;
    
    // Populate age dropdown
    const editAgeSelect = document.getElementById('edit-age');
    editAgeSelect.innerHTML = '';
    for (let i = 18; i <= 99; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i == currentUser.age) {
            option.selected = true;
        }
        editAgeSelect.appendChild(option);
    }
    
    // Set gender radio
    const genderRadios = document.getElementsByName('edit-gender');
    for (const radio of genderRadios) {
        if (radio.value === currentUser.gender) {
            radio.checked = true;
        }
    }
    
    // Set country
    document.getElementById('edit-country').value = currentUser.country;
    
    // Set state
    if (editStateSelect) {
        // Check if current state is in the dropdown
        let stateFound = false;
        for (let i = 0; i < editStateSelect.options.length; i++) {
            if (editStateSelect.options[i].value === currentUser.state) {
                editStateSelect.selectedIndex = i;
                stateFound = true;
                break;
            }
        }
        
        if (!stateFound) {
            editStateSelect.value = 'Other';
            editStateManual.style.display = 'block';
            editStateManual.value = currentUser.state;
        } else {
            editStateManual.style.display = 'none';
            editStateManual.value = '';
        }
    }
    
    // Set avatar initials
    const initials = currentUser.nickname.substring(0, 2).toUpperCase();
    document.getElementById('profile-avatar-circle').textContent = initials;
    
    // Show modal
    profileModal.classList.remove('hidden');
}

closeProfileBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
});

updateProfileBtn.addEventListener('click', () => {
    // Get updated values
    const newAge = document.getElementById('edit-age').value;
    const newGender = getSelectedEditGender();
    const newCountry = document.getElementById('edit-country').value;
    const newState = getEditStateValue().trim();
    
    // Validate
    if (!newAge || !newGender || !newCountry || !newState) {
        alert('Please fill in all fields');
        return;
    }
    
    if (newAge < 18) {
        alert('You must be 18 or older');
        return;
    }
    
    // Update current user
    currentUser.age = newAge;
    currentUser.gender = newGender;
    currentUser.country = newCountry;
    currentUser.state = newState;
    
    // Update socket with new info
    if (socket) {
        socket.emit('update-user', currentUser);
    }
    
    // Update UI
    welcomeMessage.textContent = `Welcome to ${newState} Chat Room`;
    displayRooms();
    
    // Close modal
    profileModal.classList.add('hidden');
    
    // Show success message
    displaySystemMessage('Profile updated successfully!');
});

// Get selected gender from edit radio buttons
function getSelectedEditGender() {
    const genderRadios = document.getElementsByName('edit-gender');
    for (const radio of genderRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return '';
}

// Close profile modal on outside click
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.add('hidden');
    }
});

// Initialize on page load

// Load saved state from localStorage
const savedState = localStorage.getItem('userState');
if (savedState) {
    stateSelect.value = savedState;
}

// Hamburger menu toggle
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    mobileNavMenu.classList.toggle('active');
    backdropOverlay.classList.toggle('active');
});

// Close mobile menu
mobileMenuClose.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    backdropOverlay.classList.remove('active');
});

// Close mobile menu when clicking backdrop
backdropOverlay.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    backdropOverlay.classList.remove('active');
});

// Mobile navigation menu clicks
document.getElementById('mobile-free-chat-rooms').addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    switchMobileTab('chat');
});

document.getElementById('mobile-one-on-one-chat').addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    // Open most recent private chat or show private chat list
    const conversations = Object.keys(privateMessageHistory);
    if (conversations.length > 0) {
        openPrivateChat(conversations[conversations.length - 1]);
    } else {
        switchMobileTab('private');
    }
});

document.getElementById('mobile-profile').addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    profileModal.classList.remove('hidden');
});

document.getElementById('mobile-logout').addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    // Trigger logout functionality
    handleLogout();
});

// Helper function to close mobile menu
function closeMobileMenu() {
    hamburgerMenu.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    backdropOverlay.classList.remove('active');
}

// Initialize mobile view on page load
if (window.innerWidth <= 768) {
    switchMobileTab('chat');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        // Mobile: show appropriate view
        if (!chatView.classList.contains('active') && 
            !roomsView.classList.contains('active') && 
            !usersView.classList.contains('active') &&
            !privateView.classList.contains('active')) {
            switchMobileTab('chat');
        }
    } else {
        // Desktop: remove mobile view classes
        chatView.classList.remove('active');
        roomsView.classList.remove('active');
        usersView.classList.remove('active');
        privateView.classList.remove('active');
    }
});

// Legal content
const legalContent = {
    terms: {
        title: 'Terms of Use',
        content: `
            <h3>1. Age Restriction</h3>
            <p>You must be 18 years of age or older to use this service. By using Chatic, you represent and warrant that you are at least 18 years of age. Access to this service by minors is strictly prohibited.</p>
            
            <h3>2. User Conduct</h3>
            <p>Users agree to use this service in a responsible and respectful manner. Prohibited activities include:</p>
            <ul>
                <li>Harassment, threats, or abusive behavior</li>
                <li>Sharing personal information of others</li>
                <li>Spam or unsolicited messages</li>
                <li>Illegal activities or content</li>
                <li>Impersonation of others</li>
            </ul>
            
            <h3>3. Zero Tolerance for Abuse</h3>
            <p>Chatic maintains a zero tolerance policy for abusive behavior. Any user found engaging in harassment, threats, or other forms of abuse will be immediately banned from the service without warning.</p>
            
            <h3>4. Privacy</h3>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
            
            <h3>5. Disclaimer</h3>
            <p>Chatic is provided "as is" without warranties of any kind. We do not guarantee the accuracy, reliability, or completeness of any information shared through this service.</p>
            
            <h3>6. Termination</h3>
            <p>We reserve the right to terminate or suspend access to our service at any time, with or without cause, with or without notice.</p>
            
            <h3>7. Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.</p>
        `
    },
    privacy: {
        title: 'Privacy Policy',
        content: `
            <h3>No Personal Chat Storage</h3>
            <p>Chatic does not store personal chat conversations. Messages are transmitted in real-time and are not permanently retained on our servers. Your privacy is our priority.</p>
            
            <h3>Information Collection</h3>
            <p>Chatic collects minimal information for service functionality:</p>
            <ul>
                <li>Nickname (chosen by you)</li>
                <li>Age (required for age verification)</li>
                <li>Gender (optional)</li>
                <li>Country and State/Region (for matching)</li>
            </ul>
            
            <h3>Information Usage</h3>
            <p>We use your information to:</p>
            <ul>
                <li>Provide chat matching services</li>
                <li>Match you with other users in your region</li>
                <li>Ensure safety and compliance with age requirements</li>
                <li>Prevent abuse and violations of our terms</li>
            </ul>
            
            <h3>Standard Web Safety</h3>
            <p>We implement reasonable security measures to protect your information. However, no method of transmission over the internet is completely secure. Please follow standard web safety practices.</p>
            
            <h3>Information Sharing</h3>
            <p>We do not sell, trade, or rent your personal information to third parties. Your information may be disclosed if required by law or to protect our rights.</p>
            
            <h3>Your Rights</h3>
            <p>You have the right to request access to, correction of, or deletion of your personal information.</p>
            
            <h3>Children's Privacy</h3>
            <p>Our service is not intended for children under 18. We do not knowingly collect personal information from minors.</p>
        `
    },
    safety: {
        title: 'Safety Tips',
        content: `
            <h3>Never Share Personal Information</h3>
            <p>For your safety, never share the following with anyone on Chatic:</p>
            <ul>
                <li>Phone numbers</li>
                <li>Social media profiles or handles</li>
                <li>Money or financial information</li>
                <li>Real name, address, or location</li>
                <li>Email addresses</li>
                <li>Passwords or login credentials</li>
            </ul>
            
            <h3>Be Cautious</h3>
            <p>Not everyone is who they claim to be. Be cautious of individuals who:</p>
            <ul>
                <li>Ask for money or financial assistance</li>
                <li>Try to move the conversation to other platforms</li>
                <li>Share links to unknown websites</li>
                <li>Make unrealistic promises or claims</li>
            </ul>
            
            <h3>Trust Your Instincts</h3>
            <p>If something feels wrong or uncomfortable, end the conversation immediately. You can leave the chat at any time.</p>
            
            <h3>Report Issues</h3>
            <p>If you encounter inappropriate behavior, harassment, or suspicious activity, report it immediately. Use the leave chat button if you feel unsafe.</p>
            
            <h3>Stay Safe</h3>
            <p>Remember that Chatic is an anonymous chat service. Protect your identity by never sharing personal details that could compromise your safety.</p>
        `
    },
    about: {
        title: 'About Us',
        content: `
            <h3>What is Chatic?</h3>
            <p>Chatic is a free anonymous online chat service that connects people from around the world in real-time conversations.</p>
            
            <h3>Our Mission</h3>
            <p>We provide a safe, friendly platform for people to connect, make friends, and have meaningful conversations without the need for registration or personal information.</p>
            
            <h3>What We Offer</h3>
            <ul>
                <li>Free chat rooms with no registration required</li>
                <li>Regional matching based on your location</li>
                <li>Private messaging capabilities</li>
                <li>A safe and moderated environment</li>
                <li>Access from anywhere in the world</li>
            </ul>
            
            <h3>Our Values</h3>
            <ul>
                <li><strong>Privacy:</strong> We respect your privacy and protect your information</li>
                <li><strong>Safety:</strong> We maintain age restrictions and community guidelines</li>
                <li><strong>Accessibility:</strong> Our service is free and accessible to everyone</li>
                <li><strong>Respect:</strong> We promote respectful and friendly conversations</li>
            </ul>
            
            <h3>Technology</h3>
            <p>Chatic uses modern web technologies including Socket.io for real-time messaging, ensuring fast and reliable communication between users.</p>
        `
    },
    contact: {
        title: 'Contact Us',
        content: `
            <h3>Get in Touch</h3>
            <p>We value your feedback and are here to help. Please contact us at:</p>
            
            <h3>Email Support</h3>
            <p><strong>Email:</strong> support@chatic.online</p>
            
            <h3>Response Time</h3>
            <p>We typically respond to inquiries within 24-48 hours during business days. For urgent safety concerns, please flag them immediately in your report.</p>
            
            <h3>Feedback</h3>
            <p>We welcome your feedback and suggestions to improve our service. Please let us know how we can make Chatic better for you.</p>
        `
    }
};

// Open modal
function openModal(type) {
    const content = legalContent[type];
    if (content) {
        modalTitle.textContent = content.title;
        modalBody.innerHTML = content.content;
        legalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    legalModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for modal links
document.querySelectorAll('[data-modal]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const modalType = link.getAttribute('data-modal');
        openModal(modalType);
    });
});

// Close modal on X button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal on outside click
if (legalModal) {
    legalModal.addEventListener('click', (e) => {
        if (e.target === legalModal) {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && legalModal.classList.contains('active')) {
        closeModal();
    }
    if (e.key === 'Escape' && termsModal && !termsModal.classList.contains('hidden')) {
        termsModal.classList.add('hidden');
    }
    if (e.key === 'Escape' && loginModal && !loginModal.classList.contains('hidden')) {
        loginModal.classList.add('hidden');
    }
    if (e.key === 'Escape' && registerModal && !registerModal.classList.contains('hidden')) {
        registerModal.classList.add('hidden');
    }
});

// Gender dropdown functionality
genderDropdown.addEventListener('click', () => {
    genderDropdownMenu.classList.toggle('active');
});

// Close gender dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!genderDropdown.contains(e.target)) {
        genderDropdownMenu.classList.remove('active');
    }
});

// Gender filter items
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const filter = item.getAttribute('data-filter');
        // Apply gender filter to user list
        currentGenderFilter = filter;
        displayUsers(allUsers);
        genderDropdownMenu.classList.remove('active');
    });
});

// Sound toggle functionality
let soundEnabled = true;
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const soundIcon = soundToggle.querySelector('.sound-icon');
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
});

// Chat tabs functionality
chatTabs.forEach(tab => {
    if (tab.classList.contains('sound-toggle')) return;
    
    tab.addEventListener('click', () => {
        chatTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.getAttribute('data-tab');
        handleTabSwitch(tabName);
    });
});

// Handle tab switching
function handleTabSwitch(tabName) {
    console.log('Switching to tab:', tabName);
    // Implement tab switching logic
    switch(tabName) {
        case 'one-on-one':
            // Show 1 on 1 chat view - this is the main chat view
            if (window.innerWidth <= 768) {
                switchMobileTab('chat');
            }
            break;
        case 'rooms':
            // Show rooms view - scroll to rooms sidebar on desktop or show rooms tab on mobile
            const roomsSidebar = document.querySelector('.rooms-list');
            if (roomsSidebar && window.innerWidth > 768) {
                roomsSidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                switchMobileTab('rooms');
            }
            break;
    }
}

// Landing hamburger menu
landingHamburgerMenu.addEventListener('click', () => {
    landingHamburgerMenu.classList.toggle('active');
    // You may want to show a mobile menu here
    // For now, it toggles the animation
});

// Sub-header icon interactions
document.querySelectorAll('.sub-header-item').forEach(item => {
    if (item.classList.contains('dropdown-trigger')) return;
    
    item.addEventListener('click', () => {
        const label = item.querySelector('.sub-header-label').textContent;
        
        // Implement specific functionality for each icon
        switch(label) {
            case 'Online':
                // Reset to all users
                currentGenderFilter = 'all';
                displayUsers(allUsers);
                break;
            case 'History':
                // Open history modal
                historyModal.classList.add('active');
                break;
            case 'Search':
                // Open search modal
                searchModal.classList.add('active');
                searchInput.focus();
                break;
            case 'Inbox':
                // Open inbox - scroll to inbox sidebar on desktop or show private tab on mobile
                const inboxSidebar = document.querySelector('.inbox-list');
                if (inboxSidebar && window.innerWidth > 768) {
                    inboxSidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    switchMobileTab('private');
                }
                break;
            case 'Friends':
                // Open friends modal
                friendsModal.classList.add('active');
                break;
            case 'Random':
                // Select random user and open private chat
                selectRandomUser();
                break;
        }
    });
});

// Modal close buttons
historyModalClose.addEventListener('click', () => {
    historyModal.classList.remove('active');
});

searchModalClose.addEventListener('click', () => {
    searchModal.classList.remove('active');
});

friendsModalClose.addEventListener('click', () => {
    friendsModal.classList.remove('active');
});

// Close modals on outside click
[historyModal, searchModal, friendsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Search functionality
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.innerHTML = '<p class="no-results">Enter a username to search</p>';
        return;
    }
    
    const results = allUsers.filter(user => 
        user.nickname.toLowerCase().includes(query) && 
        user.nickname !== currentUser.nickname
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No users found matching your search</p>';
    } else {
        searchResults.innerHTML = '';
        results.forEach(user => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="user-avatar ${user.gender.toLowerCase() === 'female' ? 'female' : 'male'}">
                    ${user.nickname.substring(0, 2).toUpperCase()}
                </div>
                <div class="user-info-text">
                    <div class="user-name">${escapeHtml(user.nickname)}</div>
                    <div class="user-details">${user.age} Yrs, ${user.state}</div>
                </div>
            `;
            div.addEventListener('click', () => {
                openPrivateChat(user.nickname);
                searchModal.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(div);
        });
    }
}

// Random user selection
function selectRandomUser() {
    const availableUsers = allUsers.filter(user => user.nickname !== currentUser.nickname);
    if (availableUsers.length === 0) {
        alert('No other users available to chat with');
        return;
    }
    
    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    openPrivateChat(randomUser.nickname);
}
