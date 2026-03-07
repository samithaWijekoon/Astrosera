const app = require('./app')
require('dotenv').config();

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})





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

