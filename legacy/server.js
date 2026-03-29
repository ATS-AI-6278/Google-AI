const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta";

// Helper to format Google API Error
const formatError = (err) => {
    let message = "An error occurred";
    let code = 500;
    
    if (err && typeof err === 'object') {
        message = err.message || err.statusText || message;
        code = err.status || err.code || code;
    } else if (typeof err === 'string') {
        message = err;
    }

    return {
        error: {
            message: message,
            type: "api_error",
            code: code
        }
    };
};

// 1. Models List
app.get('/v1/models', async (req, res) => {
    try {
        const response = await fetch(`${GOOGLE_API_URL}/models?key=${GOOGLE_API_KEY}`);
        const data = await response.json();
        
        if (data.error) throw data.error;
        
        // Map to OpenAI model format
        const models = (data.models || []).map(m => ({
            id: m.name.split('/').pop(),
            object: "model",
            created: Date.now(),
            owned_by: "google"
        }));
        
        res.json({ object: "list", data: models });
    } catch (error) {
        res.status(500).json(formatError(error));
    }
});

// 2. Chat Completions (OpenAI Compatible)
app.post('/v1/chat/completions', async (req, res) => {
    const { model, messages, stream, temperature, max_tokens } = req.body;
    
    // Validate model name (ensure it doesn't have double 'models/' prefix)
    let modelName = model.startsWith('models/') ? model : `models/${model}`;
    
    // Fix for Gemma 3 Models - Require "-it" suffix
    if (modelName.includes('gemma-3') && !modelName.endsWith('-it')) {
        modelName = `${modelName}-it`;
    }
    
    // Prepare Google AI payload
    const googlePayload = {
        contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        })),
        generationConfig: {
            temperature: temperature || 0.7,
            maxOutputTokens: max_tokens || 1024
        }
    };

    try {
        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const response = await fetch(`${GOOGLE_API_URL}/${modelName}:streamGenerateContent?alt=sse&key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(googlePayload)
            });

            response.body.on('data', (chunk) => {
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                            
                            const openAiChunk = {
                                id: Date.now().toString(),
                                object: "chat.completion.chunk",
                                created: Math.floor(Date.now() / 1000),
                                model: model,
                                choices: [{
                                    index: 0,
                                    delta: { content: text },
                                    finish_reason: json.candidates?.[0]?.finishReason === "STOP" ? "stop" : null
                                }]
                            };
                            res.write(`data: ${JSON.stringify(openAiChunk)}\n\n`);
                        } catch (e) {
                            // Skip non-json or malformed lines
                        }
                    }
                });
            });

            response.body.on('end', () => {
                res.write('data: [DONE]\n\n');
                res.end();
            });
        } else {
            const response = await fetch(`${GOOGLE_API_URL}/${modelName}:generateContent?key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(googlePayload)
            });
            
            const data = await response.json();
            if (data.error) throw data.error;

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            res.json({
                id: Date.now().toString(),
                object: "chat.completion",
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                    index: 0,
                    message: { role: "assistant", content: text },
                    finish_reason: "stop"
                }],
                usage: data.usageMetadata
            });
        }
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json(formatError(error));
        }
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Google AI Manager Backend serving on http://localhost:${PORT}`);
    console.log(`🌐 Compatibility Layer active at http://localhost:${PORT}/v1`);
});
