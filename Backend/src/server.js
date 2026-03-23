require('dotenv').config({ override: true });
const app = require('./app');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const asteroidRoutes = require('./routes/asteroids');
const alertRoutes = require('./routes/alerts');
const newsRoutes = require('./routes/newsRoutes');
const apodRoutes = require('./routes/apodRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const { startCron } = require('./services/notificationServices');

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URI,
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/apod', apodRoutes);
app.use('/api/media', mediaRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`🚀 AstroSera API → http://localhost:${PORT}`);
    console.log(`💾 JSON file DB (no MongoDB needed)`);
    startCron();
    console.log(`⏰ Alert cron started (every 30 min)`);
});





///////////////////////////////////////gemini pro code//////////////////////////////////////////////////////////////

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Allows React to talk to Node

// const app = express();
// app.use(cors());
// app.use(express.json()); // Allows Express to read JSON data

// // Connect to MongoDB (Replace with your actual MongoDB connection string)
// mongoose.connect('mongodb://localhost:27017/astrosera', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Connect your new routes!
// const gamificationRoutes = require('./routes/gamification');
// app.use('/api/gamification', gamificationRoutes);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










/////////////////////chatgpt code//////////////////////////////////////////////////////////////


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ MongoDB connection (no old options)
// mongoose.connect('mongodb://localhost:27017/astrosera')
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Routes
// const gamificationRoutes = require('./routes/gamification');
// app.use('/api/gamification', gamificationRoutes);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







//////////////////////after added dotev////////////////////////////

// require('dotenv').config();   // load .env file

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Connect using .env MongoDB Atlas URI
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Routes
// const gamificationRoutes = require('./routes/gamification');
// app.use('/api/gamification', gamificationRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
