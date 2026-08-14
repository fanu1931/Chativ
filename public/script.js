// Global variables
let landingPage, chatPage, nicknameInput, ageInput, countryInput, stateInput, enterChatBtn;
let welcomeMessage, navUsername, logoutBtn, messagesContainer, messageInput, sendMessageBtn;
let roomsContainer, inboxContainer, usersList, privateChatModal, privateChatTitle;
let closePrivateChatBtn, privateMessages, privateMessageInput, sendPrivateMessageBtn;
let termsModal, termsAgreeBtn, termsDisagreeBtn, landingHamburgerMenu;
let genderDropdown, genderDropdownMenu, soundToggle, onlineCount, chatTabs;
let historyModal, historyModalClose, searchModal, searchModalClose, searchInput, searchButton, searchResults;
let friendsModal, friendsModalClose, loginModal, loginModalClose, registerModal, registerModalClose;
let switchToRegister, switchToLogin, loginSubmit, registerSubmit, mobileLogoutBtn;
let hamburgerMenu, mobileNavMenu, mobileMenuClose, backdropOverlay, mobileLeaveChatBtn;
let chatView, roomsView, usersView, privateView, mobileRoomsContainer, mobileUsersList, mobileInboxContainer, navTabs;
let freeChatRoomsBtn, oneOnOneChatBtn, chatRoomsBtn, profileBtn;
let profileModal, closeProfileBtn, updateProfileBtn, legalModal, modalTitle, modalBody, modalClose;

// Store current users for filtering
let allUsers = [];
let currentGenderFilter = 'all';

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

// Initialize DOM elements when page loads
function initializeDOMElements() {
    // DOM Elements
    landingPage = document.getElementById('landing-page');
    chatPage = document.getElementById('chat-page');
    nicknameInput = document.getElementById('nickname');
    ageInput = document.getElementById('age');
    countryInput = document.getElementById('country');
    stateInput = document.getElementById('state');
    enterChatBtn = document.getElementById('enter-chat');
    welcomeMessage = document.getElementById('welcome-message');
    navUsername = document.getElementById('nav-username');
    logoutBtn = document.getElementById('logout-btn');
    messagesContainer = document.getElementById('messages-container');
    messageInput = document.getElementById('message-input');
    sendMessageBtn = document.getElementById('send-message');
    roomsContainer = document.getElementById('rooms-container');
    inboxContainer = document.getElementById('inbox-container');
    usersList = document.getElementById('users-list');
    privateChatModal = document.getElementById('private-chat-modal');
    privateChatTitle = document.getElementById('private-chat-title');
    closePrivateChatBtn = document.getElementById('close-private-chat');
    privateMessages = document.getElementById('private-messages');
    privateMessageInput = document.getElementById('private-message-input');
    sendPrivateMessageBtn = document.getElementById('send-private-message');

    // New DOM Elements for Chatib redesign
    termsModal = document.getElementById('terms-modal');
    termsAgreeBtn = document.getElementById('terms-agree');
    termsDisagreeBtn = document.getElementById('terms-disagree');
    landingHamburgerMenu = document.getElementById('landing-hamburger-menu');
    genderDropdown = document.getElementById('gender-dropdown');
    genderDropdownMenu = document.getElementById('gender-dropdown-menu');
    soundToggle = document.getElementById('sound-toggle');
    onlineCount = document.getElementById('online-count');
    chatTabs = document.querySelectorAll('.chat-tab');

    // New modal elements
    historyModal = document.getElementById('history-modal');
    historyModalClose = document.getElementById('history-modal-close');
    searchModal = document.getElementById('search-modal');
    searchModalClose = document.getElementById('search-modal-close');
    searchInput = document.getElementById('search-input');
    searchButton = document.getElementById('search-button');
    searchResults = document.getElementById('search-results');
    friendsModal = document.getElementById('friends-modal');
    friendsModalClose = document.getElementById('friends-modal-close');

    // Login and Register modal elements
    loginModal = document.getElementById('login-modal');
    loginModalClose = document.getElementById('login-modal-close');
    registerModal = document.getElementById('register-modal');
    registerModalClose = document.getElementById('register-modal-close');
    switchToRegister = document.getElementById('switch-to-register');
    switchToLogin = document.getElementById('switch-to-login');
    loginSubmit = document.getElementById('login-submit');
    registerSubmit = document.getElementById('register-submit');

    // Logout elements
    mobileLogoutBtn = document.getElementById('mobile-logout');

    // Mobile menu elements
    hamburgerMenu = document.getElementById('hamburger-menu');
    mobileNavMenu = document.getElementById('mobile-nav-menu');
    mobileMenuClose = document.getElementById('mobile-menu-close');
    backdropOverlay = document.getElementById('backdrop-overlay');
    mobileLeaveChatBtn = document.getElementById('mobile-leave-chat');

    // Mobile navigation elements
    chatView = document.getElementById('chat-view');
    roomsView = document.getElementById('rooms-view');
    usersView = document.getElementById('users-view');
    privateView = document.getElementById('private-view');
    mobileRoomsContainer = document.getElementById('mobile-rooms-container');
    mobileUsersList = document.getElementById('mobile-users-list');
    mobileInboxContainer = document.getElementById('mobile-inbox-container');
    navTabs = document.querySelectorAll('.nav-tab');

    // Header navigation elements
    freeChatRoomsBtn = document.getElementById('free-chat-rooms');
    oneOnOneChatBtn = document.getElementById('one-on-one-chat');
    chatRoomsBtn = document.getElementById('chat-rooms');
    profileBtn = document.getElementById('profile');

    // Profile modal elements
    profileModal = document.getElementById('profile-modal');
    closeProfileBtn = document.getElementById('close-profile');
    updateProfileBtn = document.getElementById('update-profile');

    // Legal modal elements
    legalModal = document.getElementById('legal-modal');
    modalTitle = document.getElementById('modal-title');
    modalBody = document.getElementById('modal-body');
    modalClose = document.getElementById('modal-close');
}

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

// Get state value (from dropdown or manual input)
function getStateValue() {
    const stateSelect = document.getElementById('state');
    const stateManual = document.getElementById('state-manual');
    if (stateSelect && stateSelect.value === 'Other') {
        return stateManual ? stateManual.value.trim() : '';
    }
    return stateSelect ? stateSelect.value : '';
}

// Get edit state value (from dropdown or manual input)
function getEditStateValue() {
    const editStateSelect = document.getElementById('edit-state');
    const editStateManual = document.getElementById('edit-state-manual');
    if (editStateSelect && editStateSelect.value === 'Other') {
        return editStateManual ? editStateManual.value.trim() : '';
    }
    return editStateSelect ? editStateSelect.value : '';
}

// Logout functionality
function handleLogout() {
    if (socket) {
        socket.disconnect();
    }
    if (chatPage) chatPage.classList.add('hidden');
    if (landingPage) landingPage.classList.remove('hidden');
    
    // Reset form
    if (nicknameInput) nicknameInput.value = '';
    if (ageInput) ageInput.value = '';
    if (countryInput) countryInput.value = '';
    
    const stateSelect = document.getElementById('state');
    const stateManual = document.getElementById('state-manual');
    if (stateSelect) stateSelect.value = '';
    if (stateManual) stateManual.value = '';
    if (stateManual) stateManual.style.display = 'none';
    if (stateSelect) stateSelect.required = true;
    if (stateManual) stateManual.required = false;
    
    // Reset gender radio buttons
    const genderRadios = document.getElementsByName('gender');
    for (const radio of genderRadios) {
        radio.checked = false;
    }
    
    if (messagesContainer) messagesContainer.innerHTML = '';
    
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

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    socket.emit('chat-message', { message });
    messageInput.value = '';
}

// Display message in chat
function displayMessage(data) {
    if (!messagesContainer) return;
    
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
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Display current state room
function displayRooms() {
    // Desktop sidebar - show current state room only
    if (roomsContainer) {
        roomsContainer.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = currentUser.state;
        li.className = 'active';
        roomsContainer.appendChild(li);
    }
    
    // Mobile view
    if (mobileRoomsContainer) {
        mobileRoomsContainer.innerHTML = '';
        const mobileLi = document.createElement('li');
        mobileLi.textContent = currentUser.state;
        mobileLi.className = 'active';
        mobileRoomsContainer.appendChild(mobileLi);
    }
}

// Display inbox/private messages
function displayInbox() {
    if (!inboxContainer) return;
    
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
    if (!mobileInboxContainer) return;
    
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
    if (onlineCount) onlineCount.textContent = users.length;

    // Desktop sidebar
    if (usersList) {
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
    }
    
    // Mobile view
    if (mobileUsersList) {
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
    if (privateChatTitle) privateChatTitle.textContent = `Private Chat with ${nickname}`;
    if (privateMessages) privateMessages.innerHTML = '';
    
    // Load message history if exists
    if (privateMessageHistory[nickname] && privateMessages) {
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
    
    if (privateChatModal) privateChatModal.classList.remove('hidden');
    if (privateMessageInput) privateMessageInput.focus();
}

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
    
    if (privateMessages) {
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
    }
    
    // If modal is closed and we receive a message, open it
    if (privateChatModal && privateChatModal.classList.contains('hidden')) {
        openPrivateChat(otherUser);
    }
}

// Update inbox notification badge
function updateInboxBadge() {
    const inboxBadge = document.getElementById('inbox-badge');
    const conversationCount = Object.keys(privateMessageHistory).length;
    
    if (inboxBadge) {
        if (conversationCount > 0) {
            inboxBadge.textContent = conversationCount;
            inboxBadge.classList.add('active');
        } else {
            inboxBadge.classList.remove('active');
        }
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
    if (chatView) {
        chatView.classList.remove('active');
        chatView.classList.add('hidden');
    }
    if (roomsView) {
        roomsView.classList.remove('active');
        roomsView.classList.add('hidden');
    }
    if (usersView) {
        usersView.classList.remove('active');
        usersView.classList.add('hidden');
    }
    if (privateView) {
        privateView.classList.remove('active');
        privateView.classList.add('hidden');
    }
    
    // Show selected view
    switch(tab) {
        case 'chat':
            if (chatView) chatView.classList.remove('hidden');
            if (chatView) chatView.classList.add('active');
            break;
        case 'rooms':
            if (roomsView) roomsView.classList.remove('hidden');
            if (roomsView) roomsView.classList.add('active');
            break;
        case 'users':
            if (usersView) usersView.classList.remove('hidden');
            if (usersView) usersView.classList.add('active');
            break;
        case 'private':
            if (privateView) privateView.classList.remove('hidden');
            if (privateView) privateView.classList.add('active');
            displayMobileInbox();
            break;
    }
}

// Profile modal functions
function openProfileModal() {
    // Populate edit fields with current user data
    const editNickname = document.getElementById('edit-nickname');
    if (editNickname) editNickname.value = currentUser.nickname;
    
    // Populate age dropdown
    const editAgeSelect = document.getElementById('edit-age');
    if (editAgeSelect) {
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
    }
    
    // Set gender radio
    const genderRadios = document.getElementsByName('edit-gender');
    for (const radio of genderRadios) {
        if (radio.value === currentUser.gender) {
            radio.checked = true;
        }
    }
    
    // Set country
    const editCountry = document.getElementById('edit-country');
    if (editCountry) editCountry.value = currentUser.country;
    
    // Set state
    const editStateSelect = document.getElementById('edit-state');
    const editStateManual = document.getElementById('edit-state-manual');
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
            if (editStateManual) editStateManual.style.display = 'block';
            if (editStateManual) editStateManual.value = currentUser.state;
        } else {
            if (editStateManual) editStateManual.style.display = 'none';
            if (editStateManual) editStateManual.value = '';
        }
    }
    
    // Set avatar initials
    const initials = currentUser.nickname.substring(0, 2).toUpperCase();
    const profileAvatarCircle = document.getElementById('profile-avatar-circle');
    if (profileAvatarCircle) profileAvatarCircle.textContent = initials;
    
    // Show modal
    if (profileModal) profileModal.classList.remove('hidden');
}

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

// Initialize event listeners and setup
function initializeEventListeners() {
    // Handle state dropdown "Other" option
    const stateSelect = document.getElementById('state');
    const stateManual = document.getElementById('state-manual');

    if (stateSelect) {
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
    }

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

    // Login and Register link functionality
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.remove('hidden');
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) registerModal.classList.remove('hidden');
        });
    }

    // Login modal close button
    if (loginModalClose) {
        loginModalClose.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Register modal close button
    if (registerModalClose) {
        registerModalClose.addEventListener('click', () => {
            registerModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Switch to Register from Login
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.add('hidden');
            if (registerModal) registerModal.classList.remove('hidden');
        });
    }

    // Switch to Login from Register
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) registerModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        });
    }

    // Login form submission
    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            // For demo purposes, simulate login by using the main form
            alert('Login feature is for demonstration. Please use the main form to enter chat.');
            if (loginModal) loginModal.classList.add('hidden');
        });
    }

    // Register form submission
    if (registerSubmit) {
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
            if (registerModal) registerModal.classList.add('hidden');
        });
    }

    // Close modals on outside click
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
                if (backdropOverlay) backdropOverlay.classList.remove('active');
            }
        });
    }

    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                registerModal.classList.add('hidden');
                if (backdropOverlay) backdropOverlay.classList.remove('active');
            }
        });
    }

    // Terms modal functionality
    if (enterChatBtn) {
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
            if (termsModal) termsModal.classList.remove('hidden');
        });
    }

    if (termsAgreeBtn) {
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
            if (landingPage) landingPage.classList.add('hidden');
            if (chatPage) chatPage.classList.remove('hidden');
            if (welcomeMessage) welcomeMessage.textContent = `Welcome to ${state} Chat Room`;
            if (navUsername) navUsername.textContent = nickname;

            // Clear messages
            if (messagesContainer) messagesContainer.innerHTML = '';
            displaySystemMessage(`Welcome to ${state} Chat Room!`);
            
            // Display state room in sidebar
            displayRooms();
            
            // Initialize inbox
            displayInbox();

            // Hide terms modal
            if (termsModal) termsModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    if (termsDisagreeBtn) {
        termsDisagreeBtn.addEventListener('click', () => {
            if (termsModal) termsModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Mobile logout
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            handleLogout();
        });
    }

    // Send message
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Close private chat
    if (closePrivateChatBtn) {
        closePrivateChatBtn.addEventListener('click', () => {
            if (privateChatModal) privateChatModal.classList.add('hidden');
            currentPrivateChatUser = null;
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Send private message
    if (sendPrivateMessageBtn) {
        sendPrivateMessageBtn.addEventListener('click', sendPrivateMessage);
    }
    if (privateMessageInput) {
        privateMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendPrivateMessage();
            }
        });
    }

    // Close modal on outside click
    if (privateChatModal) {
        privateChatModal.addEventListener('click', (e) => {
            if (e.target === privateChatModal) {
                privateChatModal.classList.add('hidden');
                currentPrivateChatUser = null;
                if (backdropOverlay) backdropOverlay.classList.remove('active');
            }
        });
    }

    // Add event listeners to mobile nav tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchMobileTab(tabName);
        });
    });

    // Header navigation event listeners
    if (freeChatRoomsBtn) {
        freeChatRoomsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Return to main chat view
            switchMobileTab('chat');
            // On desktop, ensure chat view is visible
            if (chatView) chatView.classList.add('active');
            if (roomsView) roomsView.classList.remove('active');
            if (usersView) usersView.classList.remove('active');
        });
    }

    if (oneOnOneChatBtn) {
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
    }

    if (chatRoomsBtn) {
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
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Open profile modal
            openProfileModal();
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            if (profileModal) profileModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    if (updateProfileBtn) {
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
            if (welcomeMessage) welcomeMessage.textContent = `Welcome to ${newState} Chat Room`;
            displayRooms();

            // Close modal
            if (profileModal) profileModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');

            // Show success message
            displaySystemMessage('Profile updated successfully!');
        });
    }

    // Close profile modal on outside click
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.add('hidden');
                if (backdropOverlay) backdropOverlay.classList.remove('active');
            }
        });
    }

    // Hamburger menu toggle
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            if (mobileNavMenu) mobileNavMenu.classList.toggle('active');
            if (backdropOverlay) backdropOverlay.classList.toggle('active');
        });
    }

    // Close mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
            if (mobileNavMenu) mobileNavMenu.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Close mobile menu when clicking backdrop
    if (backdropOverlay) {
        backdropOverlay.addEventListener('click', () => {
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
            if (mobileNavMenu) mobileNavMenu.classList.remove('active');
            backdropOverlay.classList.remove('active');
        });
    }

    // Mobile navigation menu clicks
    const mobileFreeChatRooms = document.getElementById('mobile-free-chat-rooms');
    if (mobileFreeChatRooms) {
        mobileFreeChatRooms.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            switchMobileTab('chat');
        });
    }

    const mobileOneOnOneChat = document.getElementById('mobile-one-on-one-chat');
    if (mobileOneOnOneChat) {
        mobileOneOnOneChat.addEventListener('click', (e) => {
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
    }

    const mobileProfile = document.getElementById('mobile-profile');
    if (mobileProfile) {
        mobileProfile.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            if (profileModal) profileModal.classList.remove('hidden');
        });
    }

    const mobileLogout = document.getElementById('mobile-logout');
    if (mobileLogout) {
        mobileLogout.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            // Trigger logout functionality
            handleLogout();
        });
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
        modalClose.addEventListener('click', () => {
            closeModal();
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Close modal on outside click
    if (legalModal) {
        legalModal.addEventListener('click', (e) => {
            if (e.target === legalModal) {
                closeModal();
                if (backdropOverlay) backdropOverlay.classList.remove('active');
            }
        });
    }

    // Gender dropdown functionality
    if (genderDropdown) {
        genderDropdown.addEventListener('click', () => {
            if (genderDropdownMenu) genderDropdownMenu.classList.toggle('active');
        });
    }

    // Close gender dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (genderDropdown && !genderDropdown.contains(e.target)) {
            if (genderDropdownMenu) genderDropdownMenu.classList.remove('active');
        }
    });

    // Gender filter items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const filter = item.getAttribute('data-filter');
            // Apply gender filter to user list
            currentGenderFilter = filter;
            displayUsers(allUsers);
            if (genderDropdownMenu) genderDropdownMenu.classList.remove('active');
        });
    });

    // Sound toggle functionality
    let soundEnabled = true;
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const soundIcon = soundToggle.querySelector('.sound-icon');
            if (soundIcon) soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        });
    }

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

    // Landing hamburger menu
    if (landingHamburgerMenu) {
        landingHamburgerMenu.addEventListener('click', () => {
            landingHamburgerMenu.classList.toggle('active');
            // You may want to show a mobile menu here
            // For now, it toggles the animation
        });
    }

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
                    if (historyModal) historyModal.classList.add('active');
                    break;
                case 'Search':
                    // Open search modal
                    if (searchModal) searchModal.classList.add('active');
                    if (searchInput) searchInput.focus();
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
                    if (friendsModal) friendsModal.classList.add('active');
                    break;
                case 'Random':
                    // Select random user and open private chat
                    selectRandomUser();
                    break;
            }
        });
    });

    // Modal close buttons
    if (historyModalClose) {
        historyModalClose.addEventListener('click', () => {
            if (historyModal) historyModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    if (searchModalClose) {
        searchModalClose.addEventListener('click', () => {
            if (searchModal) searchModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    if (friendsModalClose) {
        friendsModalClose.addEventListener('click', () => {
            if (friendsModal) friendsModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        });
    }

    // Close modals on outside click
    [historyModal, searchModal, friendsModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    if (backdropOverlay) backdropOverlay.classList.remove('active');
                }
            });
        }
    });

    // Search functionality
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
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
            if (chatView) {
                chatView.classList.remove('active');
                chatView.classList.remove('hidden');
            }
            if (roomsView) {
                roomsView.classList.remove('active');
                roomsView.classList.add('hidden');
            }
            if (usersView) {
                usersView.classList.remove('active');
                usersView.classList.add('hidden');
            }
            if (privateView) {
                privateView.classList.remove('active');
                privateView.classList.add('hidden');
            }
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && legalModal && legalModal.classList.contains('active')) {
            closeModal();
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && termsModal && !termsModal.classList.contains('hidden')) {
            termsModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && loginModal && !loginModal.classList.contains('hidden')) {
            loginModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && registerModal && !registerModal.classList.contains('hidden')) {
            registerModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && historyModal && historyModal.classList.contains('active')) {
            historyModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && friendsModal && friendsModal.classList.contains('active')) {
            friendsModal.classList.remove('active');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && privateChatModal && !privateChatModal.classList.contains('hidden')) {
            privateChatModal.classList.add('hidden');
            currentPrivateChatUser = null;
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
        if (e.key === 'Escape' && profileModal && !profileModal.classList.contains('hidden')) {
            profileModal.classList.add('hidden');
            if (backdropOverlay) backdropOverlay.classList.remove('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    initializeDOMElements();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Hide all modals
    if (termsModal) termsModal.classList.add('hidden');
    if (legalModal) legalModal.classList.add('hidden');
    if (historyModal) historyModal.classList.add('hidden');
    if (searchModal) searchModal.classList.add('hidden');
    if (friendsModal) friendsModal.classList.add('hidden');
    if (loginModal) loginModal.classList.add('hidden');
    if (registerModal) registerModal.classList.add('hidden');
    if (privateChatModal) privateChatModal.classList.add('hidden');
    if (profileModal) profileModal.classList.add('hidden');
    
    // Ensure backdrop overlay is hidden
    if (backdropOverlay) backdropOverlay.classList.remove('active');
    
    // Ensure mobile menu is closed
    if (mobileNavMenu) mobileNavMenu.classList.remove('active');
    if (hamburgerMenu) hamburgerMenu.classList.remove('active');

    // Load saved state from localStorage
    const savedState = localStorage.getItem('userState');
    if (savedState && stateInput) {
        stateInput.value = savedState;
    }

    // Initialize mobile view on page load
    if (window.innerWidth <= 768) {
        switchMobileTab('chat');
    }
});

// Helper function to close mobile menu
function closeMobileMenu() {
    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
    if (mobileNavMenu) mobileNavMenu.classList.remove('active');
    if (backdropOverlay) backdropOverlay.classList.remove('active');
}

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
        if (modalTitle) modalTitle.textContent = content.title;
        if (modalBody) modalBody.innerHTML = content.content;
        if (legalModal) legalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    if (legalModal) legalModal.classList.remove('active');
    document.body.style.overflow = '';
}

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

// Search functionality
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
}
