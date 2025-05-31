const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = 'http://localhost:11434';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to generate text using Ollama
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, model = 'gemma3:4b', temperature = 0.7, type = 'story' } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Create system prompt based on type
        let systemPrompt = '';
        switch (type) {
            case 'blog':
                systemPrompt = 'You are a professional blog writer. Write an engaging blog introduction that hooks the reader and introduces the topic effectively. Keep it concise and compelling.';
                break;
            case 'tweet':
                systemPrompt = 'You are a social media expert. Write a catchy, engaging tweet that is under 280 characters. Use relevant hashtags and make it shareable.';
                break;
            case 'story':
                systemPrompt = 'You are a creative storyteller. Write an engaging short story or story beginning based on the given topic. Be creative and descriptive.';
                break;
            default:
                systemPrompt = 'You are a helpful AI assistant. Respond to the user\'s request in a clear and engaging manner.';
        }

        const fullPrompt = `${systemPrompt}\n\nTopic: ${prompt}\n\nResponse:`;

        // Make request to Ollama
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: model,
            prompt: fullPrompt,
            stream: false,
            options: {
                temperature: temperature,
                top_p: 0.9,
                max_tokens: 500
            }
        });

        const generatedText = response.data.response;
        
        // Log the output
        logOutput(prompt, generatedText, type, model, temperature);
        
        res.json({ 
            success: true, 
            text: generatedText,
            model: model,
            type: type
        });

    } catch (error) {
        console.error('Error generating text:', error.message);
        res.status(500).json({ 
            error: 'Failed to generate text', 
            details: error.message 
        });
    }
});

// API endpoint to get available models
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(`${OLLAMA_URL}/api/tags`);
        const models = response.data.models || [];
        res.json({ models: models.map(model => model.name) });
    } catch (error) {
        console.error('Error fetching models:', error.message);
        res.json({ models: ['gemma3:4b', 'gemma3:1b', 'gemma3:12b', 'gemma3:27b'] });
    }
});

// Function to log outputs
function logOutput(prompt, output, type, model, temperature) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        prompt,
        output,
        type,
        model,
        temperature
    };
    
    const logFilePath = path.join(__dirname, 'outputs.log');
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFile(logFilePath, logLine, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const response = await axios.get(`${OLLAMA_URL}/api/tags`);
        res.json({ status: 'ok', ollama: 'connected' });
    } catch (error) {
        res.status(503).json({ status: 'error', ollama: 'disconnected', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`AI Writer App running on http://localhost:${PORT}`);
    console.log('Make sure Ollama is running on port 11434');
}); 