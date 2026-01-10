const express = require('express')

const app = express()

// Middleware
app.use(express.json())

// Test route
app.get('/', (req, res) => {
    res.send('🚀 Express server is running')
})

module.exports = app
