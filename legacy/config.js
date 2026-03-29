// Configuration Management
class ConfigManager {
    constructor() {
        this.config = {
            apiKey: localStorage.getItem('google_ai_api_key') || '',
            apiUrl: localStorage.getItem('google_ai_api_url') || 'https://generativelanguage.googleapis.com/v1beta',
            useLocalAPI: localStorage.getItem('use_local_api') === 'true',
            timeout: 30000,
            maxRetries: 3,
            debug: localStorage.getItem('google_ai_debug') === 'true'
        };
        this.loadConfig();
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('aiStudioConfig');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
    }

    saveConfig() {
        localStorage.setItem('aiStudioConfig', JSON.stringify(this.config));
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Persist individual keys so constructor always picks them up on reload
        if (newConfig.apiKey !== undefined) {
            localStorage.setItem('google_ai_api_key', newConfig.apiKey);
        }
        if (newConfig.apiUrl !== undefined) {
            localStorage.setItem('google_ai_api_url', newConfig.apiUrl);
        }
        if (newConfig.useLocalAPI !== undefined) {
            localStorage.setItem('use_local_api', String(newConfig.useLocalAPI));
        }
        if (newConfig.debug !== undefined) {
            localStorage.setItem('google_ai_debug', String(newConfig.debug));
        }
        this.saveConfig();
    }

    getApiKey() {
        return this.config.apiKey;
    }

    getApiUrl() {
        if (this.config.useLocalAPI) {
            // Return local backend URL
            return this.config.apiUrl === 'https://generativelanguage.googleapis.com/v1beta'
                ? 'http://localhost:3001/v1'
                : (this.config.apiUrl || 'http://localhost:3001/v1');
        } else {
            // Return official Google API URL
            return this.config.apiUrl === 'http://localhost:3001/v1'
                ? 'https://generativelanguage.googleapis.com/v1beta'
                : (this.config.apiUrl || 'https://generativelanguage.googleapis.com/v1beta');
        }
    }

    isDebug() {
        return this.config.debug;
    }

    getUseLocalAPI() {
        return this.config.useLocalAPI;
    }
}

// Google AI API Integration
class GoogleAIAPI {
    constructor(configManager) {
        this.config = configManager;
    }

    async listModels() {
        const url = this.config.getUseLocalAPI()
            ? `${this.config.getApiUrl()}/models`
            : `${this.config.getApiUrl()}/models?key=${this.config.getApiKey()}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) throw data.error;

            // Backend returns { data: [...] }, Google returns { models: [...] }
            return data.data || data.models || [];
        } catch (error) {
            console.error('List Models Error:', error);
            throw error;
        }
    }

    async generateContent(modelName, prompt, options = {}) {
        // Ensure model name is in 'models/name' format
        const fullModelName = modelName.startsWith('models/') ? modelName : `models/${modelName}`;
        const url = `${this.config.getApiUrl()}/${fullModelName}:generateContent?key=${this.config.getApiKey()}`;

        if (this.config.isDebug()) {
            console.log('API Request URL:', url);
            console.log('Model:', fullModelName);
            console.log('Prompt:', prompt);
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxOutputTokens || 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const text = await response.text();
                    try {
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.error?.message || errorMessage;
                    } catch (e) {
                        if (text.length < 100 && !text.includes('<!DOCTYPE')) errorMessage = text;
                    }
                } catch (e) { }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Track usage
            if (window.usageTracker) {
                usageTracker.trackUsage(modelName, data);
            }

            return {
                text: data.candidates[0]?.content?.parts[0]?.text || 'No response generated.',
                usage: data.usageMetadata || {},
                model: modelName,
                finishReason: data.candidates[0]?.finishReason || 'UNKNOWN'
            };

        } catch (error) {
            console.error('Google AI API Error:', error);
            throw error;
        }
    }

    async streamContent(modelName, prompt, options = {}, onChunk) {
        let fullModelName = modelName.startsWith('models/') ? modelName : `models/${modelName}`;

        let url;
        let requestBody;
        let headers = { 'Content-Type': 'application/json' };

        if (this.config.getUseLocalAPI()) {
            url = `${this.config.getApiUrl()}/chat/completions`;
            requestBody = {
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
                temperature: options.temperature || 0.7,
                max_tokens: options.maxOutputTokens || 1024
            };
        } else {
            // Fix for Gemma 3 Models - Require "-it" suffix
            if (fullModelName.includes('gemma-3') && !fullModelName.endsWith('-it')) {
                fullModelName = `${fullModelName}-it`;
            }
            url = `${this.config.getApiUrl()}/${fullModelName}:streamGenerateContent?alt=sse&key=${this.config.getApiKey()}`;
            requestBody = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    maxOutputTokens: options.maxOutputTokens || 8192,
                }
            };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const text = await response.text();
                    try {
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.error?.message || errorMessage;
                    } catch (e) {
                        if (text.length < 100 && !text.includes('<!DOCTYPE')) errorMessage = text;
                    }
                } catch (e) { }
                throw new Error(errorMessage);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;

                    // Handle SSE format
                    let jsonStr = trimmedLine;
                    if (trimmedLine.startsWith('data: ')) {
                        jsonStr = trimmedLine.substring(6);
                    }

                    if (jsonStr === '[DONE]') continue;

                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.candidates && data.candidates[0]) {
                            const chunk = data.candidates[0].content?.parts[0]?.text || '';
                            if (chunk) onChunk(chunk);
                        } else if (data.content && data.content.parts) {
                            // Some versions return content/parts directly
                            const chunk = data.content.parts[0]?.text || '';
                            if (chunk) onChunk(chunk);
                        }
                    } catch (e) {
                        if (this.config.isDebug()) console.warn('Failed to parse stream chunk:', jsonStr, e);
                    }
                }
            }

        } catch (error) {
            console.error('Google AI Streaming Error:', error);
            throw error;
        }
    }

}

// Usage Tracking
class UsageTracker {
    constructor() {
        this.usageData = this.loadUsageData();
    }

    loadUsageData() {
        const saved = localStorage.getItem('aiUsageData');
        return saved ? JSON.parse(saved) : {};
    }

    saveUsageData() {
        localStorage.setItem('aiUsageData', JSON.stringify(this.usageData));
    }

    trackUsage(modelName, apiResponse) {
        const today = new Date().toISOString().split('T')[0];

        if (!this.usageData[today]) {
            this.usageData[today] = {};
        }

        if (!this.usageData[today][modelName]) {
            this.usageData[today][modelName] = {
                requests: 0,
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0
            };
        }

        const usage = this.usageData[today][modelName];
        const metadata = apiResponse.usageMetadata || {};

        usage.requests += 1;
        usage.promptTokens += metadata.promptTokenCount || 0;
        usage.completionTokens += metadata.candidatesTokenCount || 0;
        usage.totalTokens += metadata.totalTokenCount || 0;

        this.saveUsageData();
    }

    getUsageHistory(days = 7) {
        const history = {};
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            history[dateStr] = this.usageData[dateStr] || {};
        }

        return history;
    }

    getTotalUsage(modelName, days = 7) {
        const history = this.getUsageHistory(days);
        let total = { requests: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };

        Object.values(history).forEach(dayData => {
            if (dayData[modelName]) {
                const usage = dayData[modelName];
                total.requests += usage.requests;
                total.promptTokens += usage.promptTokens;
                total.completionTokens += usage.completionTokens;
                total.totalTokens += usage.totalTokens;
            }
        });

        return total;
    }
}

// Initialize global instances
const configManager = new ConfigManager();
const aiAPI = new GoogleAIAPI(configManager);
const usageTracker = new UsageTracker();
