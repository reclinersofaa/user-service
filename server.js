const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const promClient = require('prom-client');
promClient.collectDefaultMetrics();

// Middleware
app.use(express.json());

// Health check endpoint (required for Kubernetes)
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'user-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Basic user endpoints
app.get('/api/users', (req, res) => {
    res.json({
        message: 'User service is running',
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
    });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        id: parseInt(id),
        name: 'Sample User',
        email: 'user@example.com',
        message: 'User retrieved successfully'
    });
});

app.post('/api/users', (req, res) => {
    res.status(201).json({
        message: 'User created successfully',
        user: { id: 3, ...req.body }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
