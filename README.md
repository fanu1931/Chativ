# Chativ Clone - Real-time Chat Application

A Chativ-style chat application with Socket.io, featuring state-based rooms, private messaging, and safety features.

## Features

- Real-time chat in state-based rooms
- Private messaging between users
- Profanity filter (English, Hindi, Marathi)
- Phone number, link, and UPI ID detection
- Rate limiting (3 messages per 2 seconds)
- User reporting system (3 reports = 30-minute ban)
- User profiles with nickname, age, gender, country, and state

## Tech Stack

- Node.js
- Express.js
- Socket.io
- HTML/CSS/JavaScript (vanilla)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Railway (Recommended)

Railway is the easiest platform for deploying Socket.io applications with WebSocket support.

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Railway will automatically detect the Node.js app
5. Add environment variable: `PORT=3000` (Railway sets this automatically)
6. Click "Deploy"

Your app will be live at `https://your-app-name.up.railway.app`

### Render

Render also supports WebSockets and offers free hosting.

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variable: `PORT=3000`
6. Click "Deploy Web Service"

Your app will be live at `https://your-app-name.onrender.com`

### Heroku

Heroku requires a buildpack for Socket.io to work properly.

1. Install the Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Push code: `git push heroku main`
6. Set environment variable: `heroku config:set PORT=3000`

Your app will be live at `https://your-app-name.herokuapp.com`

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## License

ISC
