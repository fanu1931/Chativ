const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Store users and state rooms
const users = {};
const stateRooms = {};

// Dummy/simulated users configuration
const dummyUsers = [
    // Females (10)
    { nickname: 'Priya_27', age: 27, gender: 'Female', country: 'India', state: 'Maharashtra' },
    { nickname: 'Neha_29', age: 29, gender: 'Female', country: 'India', state: 'Delhi' },
    { nickname: 'Pooja_26', age: 26, gender: 'Female', country: 'India', state: 'Karnataka' },
    { nickname: 'Sneha_31', age: 31, gender: 'Female', country: 'India', state: 'Gujarat' },
    { nickname: 'Ananya_28', age: 28, gender: 'Female', country: 'India', state: 'West Bengal' },
    { nickname: 'Ritu_33', age: 33, gender: 'Female', country: 'India', state: 'Punjab' },
    { nickname: 'Kavya_30', age: 30, gender: 'Female', country: 'India', state: 'Tamil Nadu' },
    { nickname: 'Meera_34', age: 34, gender: 'Female', country: 'India', state: 'Rajasthan' },
    { nickname: 'Divya_26', age: 26, gender: 'Female', country: 'India', state: 'Uttar Pradesh' },
    { nickname: 'Tanvi_32', age: 32, gender: 'Female', country: 'India', state: 'Madhya Pradesh' },
    // Males (6)
    { nickname: 'Rahul_28', age: 28, gender: 'Male', country: 'India', state: 'Maharashtra' },
    { nickname: 'Amit_32', age: 32, gender: 'Male', country: 'India', state: 'Haryana' },
    { nickname: 'Vikram_35', age: 35, gender: 'Male', country: 'India', state: 'Karnataka' },
    { nickname: 'Rohan_27', age: 27, gender: 'Male', country: 'India', state: 'Delhi' },
    { nickname: 'Akash_30', age: 30, gender: 'Male', country: 'India', state: 'Gujarat' },
    { nickname: 'Sameer_34', age: 34, gender: 'Male', country: 'India', state: 'Telangana' }
];

// Auto-reply messages for dummy users
const autoReplies = [
    'Hey! How are you?',
    'Hi there, welcome!',
    'Hello! Nice to meet you!',
    'Hey! What brings you here?',
    'Hi! How can I help you today?'
];

// Safety and anti-abuse systems
const userReports = {}; // Track reports against users
const bannedUsers = {}; // Track temporarily banned users
const userMessageHistory = {}; // Track message timestamps for rate limiting

// Profanity filter - English, Hindi, Marathi
const badWords = [
    // English
    'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'bastard', 'whore', 'slut',
    'dick', 'cock', 'pussy', 'cunt', 'fag', 'nigger', 'nigga', 'retard',
    'idiot', 'stupid', 'moron', 'loser', 'ugly', 'fat', 'kill', 'die',
    'rape', 'abuse', 'hate', 'terrorist', 'suicide', 'murder',
    // Hindi
    'chutiya', 'madarchod', 'behenchod', 'randi', 'kutta', 'kamine',
    'harami', 'sala', 'sali', 'gandu', 'lund', 'choot', 'bhosda',
    'haramkhor', 'pagal', 'ullu', 'kutta', 'kaminapan', 'behnke',
    // Marathi
    'chutya', 'madarchod', 'randi', 'kutta', 'ghandi', 'pandhrya',
    'bhosdicha', 'land', 'pussy', 'gandu', 'harami', 'sala', 'sali',
    'kamine', 'bhadwa', 'randichi', 'chakka', 'hijra', 'kutrya'
];

// Function to check for profanity
function containsProfanity(message) {
    const lowerMessage = message.toLowerCase();
    return badWords.some(word => lowerMessage.includes(word));
}

// Function to censor profanity
function censorProfanity(message) {
    let censoredMessage = message;
    badWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        censoredMessage = censoredMessage.replace(regex, '*'.repeat(word.length));
    });
    return censoredMessage;
}

// Function to detect phone numbers
function containsPhoneNumber(message) {
    // Match 10-digit phone numbers (with or without country code)
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\d{10}/;
    return phoneRegex.test(message);
}

// Function to detect links/URLs
function containsLink(message) {
    // Match http, https, www, and common domain patterns
    const linkRegex = /(https?:\/\/|www\.|\.com|\.org|\.net|\.in|\.co|\.io|\.gov|\.edu|wa\.me|whatsapp\.com|upi\/|paytm|phonepe|gpay)/i;
    return linkRegex.test(message);
}

// Function to detect UPI IDs
function containsUPI(message) {
    // Match UPI ID patterns (user@upi or user@bank)
    const upiRegex = /[a-zA-Z0-9._-]+@(upi|okhdfcbank|okicici|oksbi|okaxis|ybl)/i;
    return upiRegex.test(message);
}

// Function to check rate limiting
function checkRateLimit(socketId) {
    const now = Date.now();
    if (!userMessageHistory[socketId]) {
        userMessageHistory[socketId] = [];
    }
    
    // Remove messages older than 2 seconds
    userMessageHistory[socketId] = userMessageHistory[socketId].filter(
        timestamp => now - timestamp < 2000
    );
    
    // Check if user has sent more than 3 messages in 2 seconds
    if (userMessageHistory[socketId].length >= 3) {
        return false; // Rate limit exceeded
    }
    
    userMessageHistory[socketId].push(now);
    return true; // Within rate limit
}

// Function to check if user is banned
function isUserBanned(socketId) {
    if (bannedUsers[socketId]) {
        const banEndTime = bannedUsers[socketId];
        if (Date.now() < banEndTime) {
            return true;
        } else {
            // Ban expired, remove from banned list
            delete bannedUsers[socketId];
            return false;
        }
    }
    return false;
}

// Function to ban user for 30 minutes
function banUser(socketId) {
    const banEndTime = Date.now() + (30 * 60 * 1000); // 30 minutes
    bannedUsers[socketId] = banEndTime;
    
    // Disconnect the user
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
        socket.emit('error', { 
            message: 'You have been temporarily banned for 30 minutes due to multiple reports.' 
        });
        socket.disconnect();
    }
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins with their info
    socket.on('join', (userData) => {
        // Check if user is banned
        if (isUserBanned(socket.id)) {
            socket.emit('error', { 
                message: 'You are temporarily banned. Please try again later.' 
            });
            socket.disconnect();
            return;
        }

        const { nickname, age, gender, country, state } = userData;
        
        users[socket.id] = {
            nickname,
            age,
            gender,
            country,
            state,
            socketId: socket.id
        };

        // Initialize reports for this user
        userReports[socket.id] = [];

        // Initialize state room if it doesn't exist
        if (!stateRooms[state]) {
            stateRooms[state] = [];
        }

        // Join the state room
        socket.join(state);

        // Add user to state room users list
        stateRooms[state].push({
            socketId: socket.id,
            nickname,
            age,
            gender,
            country,
            state
        });

        // Notify others in the state room
        socket.to(state).emit('system-message', {
            message: `${nickname} has joined the room`,
            type: 'join'
        });

        // Send updated user list to all in state room (including all dummy users)
        const allUsers = [...stateRooms[state]];
        
        // Add all dummy users
        dummyUsers.forEach(dummyUser => {
            allUsers.push({
                socketId: `dummy_${dummyUser.nickname}`,
                nickname: dummyUser.nickname,
                age: dummyUser.age,
                gender: dummyUser.gender,
                country: dummyUser.country,
                state: dummyUser.state,
                isDummy: true
            });
        });
        
        io.to(state).emit('user-list', allUsers);

        console.log(`${nickname} joined ${state}`);
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
        const user = users[socket.id];
        if (!user) return;

        // Check if user is banned
        if (isUserBanned(socket.id)) {
            socket.emit('error', { 
                message: 'You are temporarily banned. Please try again later.' 
            });
            return;
        }

        // Check rate limiting
        if (!checkRateLimit(socket.id)) {
            socket.emit('error', { 
                message: 'Please wait before sending another message.' 
            });
            return;
        }

        const message = data.message;

        // Check for phone numbers
        if (containsPhoneNumber(message)) {
            socket.emit('error', { 
                message: 'Phone numbers are not allowed in messages.' 
            });
            return;
        }

        // Check for links/URLs
        if (containsLink(message)) {
            socket.emit('error', { 
                message: 'Links and URLs are not allowed in messages.' 
            });
            return;
        }

        // Check for UPI IDs
        if (containsUPI(message)) {
            socket.emit('error', { 
                message: 'UPI IDs and payment requests are not allowed in messages.' 
            });
            return;
        }

        // Censor profanity
        const censoredMessage = censorProfanity(message);

        const messageData = {
            nickname: user.nickname,
            message: censoredMessage,
            state: user.state,
            timestamp: new Date().toLocaleTimeString(),
            gender: user.gender
        };

        // Send to all users in the state room including sender
        io.to(user.state).emit('chat-message', messageData);
    });

    // Handle private messages
    socket.on('private-message', (data) => {
        const sender = users[socket.id];
        if (!sender) return;

        // Check if user is banned
        if (isUserBanned(socket.id)) {
            socket.emit('error', { 
                message: 'You are temporarily banned. Please try again later.' 
            });
            return;
        }

        // Check rate limiting
        if (!checkRateLimit(socket.id)) {
            socket.emit('error', { 
                message: 'Please wait before sending another message.' 
            });
            return;
        }

        const message = data.message;

        // Check for phone numbers
        if (containsPhoneNumber(message)) {
            socket.emit('error', { 
                message: 'Phone numbers are not allowed in messages.' 
            });
            return;
        }

        // Check for links/URLs
        if (containsLink(message)) {
            socket.emit('error', { 
                message: 'Links and URLs are not allowed in messages.' 
            });
            return;
        }

        // Check for UPI IDs
        if (containsUPI(message)) {
            socket.emit('error', { 
                message: 'UPI IDs and payment requests are not allowed in messages.' 
            });
            return;
        }

        // Censor profanity
        const censoredMessage = censorProfanity(message);

        // Check if target is a dummy user
        const dummyUser = dummyUsers.find(u => u.nickname === data.targetNickname);
        
        if (dummyUser) {
            // Send the real user's message to themselves (echo back)
            const messageData = {
                from: sender.nickname,
                to: dummyUser.nickname,
                message: censoredMessage,
                timestamp: new Date().toLocaleTimeString(),
                gender: sender.gender
            };
            
            io.to(socket.id).emit('private-message', messageData);
            
            // Trigger auto-reply after random 2-4 seconds for every message
            const randomDelay = Math.floor(Math.random() * 2000) + 2000; // 2000-4000ms
            setTimeout(() => {
                const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                const autoReplyData = {
                    from: dummyUser.nickname,
                    to: sender.nickname,
                    message: randomReply,
                    timestamp: new Date().toLocaleTimeString(),
                    gender: dummyUser.gender
                };
                
                io.to(socket.id).emit('private-message', autoReplyData);
            }, randomDelay);
            return;
        }

        const targetUser = Object.values(users).find(
            u => u.nickname === data.targetNickname
        );

        if (targetUser) {
            const messageData = {
                from: sender.nickname,
                to: targetUser.nickname,
                message: censoredMessage,
                timestamp: new Date().toLocaleTimeString(),
                gender: sender.gender
            };

            // Send to both sender and receiver
            io.to(socket.id).emit('private-message', messageData);
            io.to(targetUser.socketId).emit('private-message', messageData);
        } else {
            socket.emit('error', { message: 'User not found' });
        }
    });

    // Handle user reports
    socket.on('report-user', (data) => {
        const reporter = users[socket.id];
        if (!reporter) return;

        const targetNickname = data.targetNickname;
        const targetUser = Object.values(users).find(
            u => u.nickname === targetNickname
        );

        if (targetUser) {
            // Check if reporter has already reported this user
            if (userReports[targetUser.socketId]) {
                const hasAlreadyReported = userReports[targetUser.socketId].some(
                    report => report.reporterSocketId === socket.id
                );
                
                if (hasAlreadyReported) {
                    socket.emit('error', { 
                        message: 'You have already reported this user.' 
                    });
                    return;
                }
            }

            // Add report
            if (!userReports[targetUser.socketId]) {
                userReports[targetUser.socketId] = [];
            }

            userReports[targetUser.socketId].push({
                reporterSocketId: socket.id,
                reporterNickname: reporter.nickname,
                timestamp: Date.now()
            });

            const reportCount = userReports[targetUser.socketId].length;

            // Notify reporter
            socket.emit('system-message', {
                message: `Thank you for reporting ${targetNickname}. Report count: ${reportCount}/3`
            });

            // Check if user should be banned (3+ reports from different users)
            if (reportCount >= 3) {
                console.log(`User ${targetNickname} has been reported ${reportCount} times. Banning...`);
                banUser(targetUser.socketId);
                
                // Notify the room
                io.to(targetUser.state).emit('system-message', {
                    message: `${targetNickname} has been banned due to multiple reports.`,
                    type: 'ban'
                });
            }
        } else {
            socket.emit('error', { message: 'User not found' });
        }
    });


    // Handle disconnect
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            // Remove from state room users
            if (stateRooms[user.state]) {
                stateRooms[user.state] = stateRooms[user.state].filter(u => u.socketId !== socket.id);

                // Notify state room
                socket.to(user.state).emit('system-message', {
                    message: `${user.nickname} has left the room`,
                    type: 'leave'
                });
                
                // Send updated user list including all dummy users
                const allUsers = [...stateRooms[user.state]];
                
                // Add all dummy users
                dummyUsers.forEach(dummyUser => {
                    allUsers.push({
                        socketId: `dummy_${dummyUser.nickname}`,
                        nickname: dummyUser.nickname,
                        age: dummyUser.age,
                        gender: dummyUser.gender,
                        country: dummyUser.country,
                        state: dummyUser.state,
                        isDummy: true
                    });
                });
                
                io.to(user.state).emit('user-list', allUsers);
            }

            // Remove user
            delete users[socket.id];

            console.log(`${user.nickname} disconnected`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
