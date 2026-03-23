// Configuration Management
class ConfigManager {
    constructor() {
        this.config = {
            apiKey: 'AIzaSyCX5kRZrpl9lZrTAl928LtRcFNDa3bItjo',
            apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
            timeout: 30000,
            maxRetries: 3,
            debug: false
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
        this.saveConfig();
    }

    getApiKey() {
        return this.config.apiKey;
    }

    getApiUrl() {
        return this.config.apiUrl;
    }

    isDebug() {
        return this.config.debug;
    }
}

// Google AI API Integration
class GoogleAIAPI {
    constructor(configManager) {
        this.config = configManager;
        this.usageTracker = new UsageTracker();
    }

    async generateContent(modelName, prompt, options = {}) {
        const url = `${this.config.getApiUrl()}/models/${modelName}:generateContent?key=${this.config.getApiKey()}`;
        
        console.log('API Request URL:', url);
        console.log('Model:', modelName);
        console.log('Prompt:', prompt);
        
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
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            // Track usage
            this.usageTracker.trackUsage(modelName, data);
            
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
        const url = `${this.config.getApiUrl()}/models/${modelName}:streamGenerateContent?key=${this.config.getApiKey()}`;
        
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
            }
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
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
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
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (data.candidates && data.candidates[0]) {
                                const chunk = data.candidates[0].content?.parts[0]?.text || '';
                                onChunk(chunk);
                            }
                        } catch (e) {
                            // Skip invalid JSON lines
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Google AI Streaming Error:', error);
            throw error;
        }
    }

    async listModels() {
        const url = `${this.config.getApiUrl()}/models?key=${this.config.getApiKey()}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Error fetching models:', error);
            return [];
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
