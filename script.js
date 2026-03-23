// Comprehensive Model Limits from User
const MODEL_LIMITS = {
    // The Gemini Core Family
    "gemini-2.5-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.5-pro": { category: "Text-out models", rpm: 2, tpm: 32000, rpd: 50 },
    "gemini-2.0-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.0-flash-exp": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.0-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.5-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-3-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-3.1-pro": { category: "Text-out models", rpm: 2, tpm: 32000, rpd: 50 },
    "gemini-3.1-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },

    // Audio / TTS
    "gemini-2.5-flash-tts": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.5-pro-tts": { category: "Multi-modal generative models", rpm: 2, tpm: 32000, rpd: 50 },
    "gemini-2.5-flash-native-audio": { category: "Live API", rpm: 15, tpm: 1000000, rpd: 1500 },

    // The Gemma 3 Family (Open Weights) - always use -it suffix
    "gemma-3-1b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemma-3-4b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemma-3-12b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemma-3-27b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },

    // Image Generation (Imagen & Nano Banana)
    "imagen-4": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "imagen-4-ultra": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "imagen-4-fast": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "nano-banana": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "nano-banana-pro": { category: "Multi-modal generative models", rpm: 2, tpm: 32000, rpd: 50 },
    "nano-banana-2": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },

    // Video Generation (Veo)
    "veo-3": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "veo-3-fast": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },

    // Specialty Tools & Embeddings
    "text-embedding-001": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "text-embedding-2": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-robotics-er-1.5-preview": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "gemini-2.5-computer-use": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
    "deep-research-pro-preview": { category: "Agents", rpm: 2, tpm: 32000, rpd: 50 }
};

// Human-readable display names for each API model ID
const MODEL_DISPLAY_NAMES = {
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
    "gemini-2.0-flash": "Gemini 2 Flash",
    "gemini-2.0-flash-exp": "Gemini 2 Flash Exp",
    "gemini-2.0-flash-lite": "Gemini 2 Flash Lite",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
    "gemini-3-flash": "Gemini 3 Flash",
    "gemini-3.1-pro": "Gemini 3.1 Pro",
    "gemini-3.1-flash-lite": "Gemini 3.1 Flash Lite",
    "gemini-2.5-flash-tts": "Gemini 2.5 Flash TTS",
    "gemini-2.5-pro-tts": "Gemini 2.5 Pro TTS",
    "gemini-2.5-flash-native-audio": "Gemini 2.5 Flash Native Audio",
    "gemma-3-1b-it": "Gemma 3 1B",
    "gemma-3-2b-it": "Gemma 3 2B",
    "gemma-3-4b-it": "Gemma 3 4B",
    "gemma-3-12b-it": "Gemma 3 12B",
    "gemma-3-27b-it": "Gemma 3 27B",
    "imagen-4": "Imagen 4 Generate",
    "imagen-4-ultra": "Imagen 4 Ultra Generate",
    "imagen-4-fast": "Imagen 4 Fast Generate",
    "nano-banana": "Nano Banana",
    "nano-banana-pro": "Nano Banana Pro",
    "nano-banana-2": "Nano Banana 2",
    "veo-3": "Veo 3 Generate",
    "veo-3-fast": "Veo 3 Fast Generate",
    "text-embedding-001": "Gemini Embedding 1",
    "text-embedding-2": "Gemini Embedding 2",
    "gemini-robotics-er-1.5-preview": "Gemini Robotics ER 1.5 Preview",
    "gemini-2.5-computer-use": "Computer Use Preview",
    "deep-research-pro-preview": "Deep Research Pro Preview"
};

// Global variables
let allModels = [];
let currentModels = [];
let chatHistory = [];
let charts = {};
let isGenerating = false;
let currentGenerationController = null;

// Data version for forcing updates
const DATA_VERSION = "5.0";
const LAST_UPDATE_KEY = 'lastModelsUpdate';

// Initialize on page load
function init() {
    console.log("Initializing AI Studio Manager...");
    // Validate and reset data if needed
    validateAndResetData();

    loadFromLocalStorage();
    console.log(`Loaded ${allModels.length} models from storage.`);

    // Ensure allModels is populated if localStorage was empty
    if (allModels.length === 0) {
        console.log("Storage empty, initializing from static limits...");
        initModelsFromStaticData();
    }

    renderModels();
    updateChatModelSelect();
    updateStats();
    checkAPIConnection();
    setupEventListeners();

    // Check for daily updates
    checkDailyUpdate();

    // Start periodic limit resets
    startLimitResets();

    lucide.createIcons();
    console.log("Initialization complete.");
}

// Initialize models from static MODEL_LIMITS data
function initModelsFromStaticData() {
    allModels = Object.keys(MODEL_LIMITS).map(key => ({
        name: key,
        displayName: MODEL_DISPLAY_NAMES[key] || key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        category: MODEL_LIMITS[key].category,
        description: `High-performance ${MODEL_LIMITS[key].category} model.`,
        rpm: { used: 0, limit: MODEL_LIMITS[key].rpm },
        tpm: { used: 0, limit: MODEL_LIMITS[key].tpm },
        rpd: { used: 0, limit: MODEL_LIMITS[key].rpd },
        status: 'available'
    }));
    currentModels = [...allModels];
    saveToLocalStorage();
}

// Validate stored data and reset if using old format
function validateAndResetData() {
    const savedVersion = localStorage.getItem('dataVersion');
    const savedModels = localStorage.getItem('googleAIModels');

    // If no version or old version, clear localStorage
    if (savedVersion !== DATA_VERSION) {
        console.log('Data version mismatch. Resetting to new model format...');
        localStorage.removeItem('googleAIModels');
        localStorage.removeItem('chatHistory');
        localStorage.setItem('dataVersion', DATA_VERSION);
        return;
    }

    // Check if saved models have correct format (API names)
    if (savedModels) {
        try {
            const models = JSON.parse(savedModels);
            const hasInvalidModels = models.some(m => {
                // Check if model name contains spaces (old format)
                return m.name.includes(' ') && !m.name.includes('-');
            });

            if (hasInvalidModels) {
                console.log('Old model format detected. Resetting...');
                localStorage.removeItem('googleAIModels');
                localStorage.removeItem('chatHistory');
                // Reset to default models
                allModels = [...modelsData, ...toolsData];
                currentModels = [...allModels];
                saveToLocalStorage();
            }
        } catch (e) {
            console.error('Error validating models:', e);
            localStorage.removeItem('googleAIModels');
        }
    }
}

// Check and perform daily updates
function checkDailyUpdate() {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    const today = new Date().toISOString().split('T')[0];

    if (lastUpdate !== today) {
        console.log('Performing daily model update...');
        performDailyUpdate();
        localStorage.setItem(LAST_UPDATE_KEY, today);
    }
}

// Perform daily update from API
async function performDailyUpdate() {
    try {
        // Fetch current quota/usage from API
        const response = await fetch(`${configManager.getApiUrl()}/models?key=${configManager.getApiKey()}`);
        if (response.ok) {
            const data = await response.json();
            if (data.models) {
                updateModelsFromAPI(data.models);
                console.log('Daily update completed successfully');
            }
        }
    } catch (error) {
        console.error('Daily update failed:', error);
    }
}

// Update statistics
function updateStats() {
    const totalModels = document.getElementById('total-models');
    const availableModels = document.getElementById('available-models');
    const limitedModels = document.getElementById('limited-models');
    const unavailableModels = document.getElementById('unavailable-models');
    const modelsCount = document.getElementById('models-count');

    if (totalModels) totalModels.textContent = allModels.length;
    if (availableModels) availableModels.textContent = allModels.filter(m => m.status === 'available').length;
    if (limitedModels) limitedModels.textContent = allModels.filter(m => m.status === 'limited').length;
    if (unavailableModels) unavailableModels.textContent = allModels.filter(m => m.status === 'unavailable').length;
    if (modelsCount) modelsCount.textContent = allModels.length;
}

// Setup Event Listeners
function setupEventListeners() {
    // Temperature slider
    const tempSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temp-value');
    if (tempSlider && tempValue) {
        tempSlider.addEventListener('input', (e) => {
            tempValue.textContent = e.target.value;
        });
    }

    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// API Connection Status
async function checkAPIConnection() {
    const statusDot = document.getElementById('api-status');
    const statusText = document.getElementById('api-status-text');

    try {
        // Test API and fetch live models
        const models = await aiAPI.listModels();

        if (statusDot && statusText) {
            statusDot.className = 'w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
            statusText.innerText = 'Connected';
            statusText.className = 'text-sm font-medium text-green-600';
        }

        // Update models with real API data if available
        if (models && models.length > 0) {
            updateAllModelsFromAPI(models);
        }
    } catch (error) {
        console.warn('API Connection Error:', error);

        if (statusDot && statusText) {
            statusDot.className = 'w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]';
            statusText.innerText = 'Disconnected';
            statusText.className = 'text-sm font-medium text-red-600';
        }
    } finally {
        // Always ensure models are rendered
        if (allModels.length === 0) {
            initModelsFromStaticData();
        }
        renderModels();
        updateStats();
    }
}

// Transform API models into app format
function updateAllModelsFromAPI(apiModels) {
    const newModels = apiModels.map(m => {
        // Find if we already have this model stored for usage persistence
        const existing = allModels.find(em => em.name === m.name);

        // Base model structure
        const model = {
            name: m.name,
            displayName: m.displayName || m.name.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: determineCategory(m),
            description: m.description || '',
            rpm: existing ? existing.rpm : { used: 0, limit: determineLimit(m, 'rpm') },
            tpm: existing ? existing.tpm : { used: 0, limit: determineLimit(m, 'tpm') },
            rpd: existing ? existing.rpd : { used: 0, limit: determineLimit(m, 'rpd') },
            status: existing ? existing.status : 'available'
        };

        return model;
    });

    allModels = newModels;
    filterModels(); // Re-render with new models
    updateChatModelSelect();
    updateStats();
    saveToLocalStorage();
}

function determineCategory(m) {
    const key = m.name.toLowerCase().replace('models/', '');
    if (MODEL_LIMITS[key]) return MODEL_LIMITS[key].category;

    if (m.name.includes('vision') || m.name.includes('imagen')) return 'Multi-modal generative models';
    if (m.name.includes('embedding')) return 'Other models';
    if (m.name.includes('gemini-2') || m.name.includes('gemini-1.5')) return 'Text-out models';
    return 'Other models';
}

function determineLimit(m, type) {
    const key = m.name.toLowerCase().replace('models/', '');
    if (MODEL_LIMITS[key] && MODEL_LIMITS[key][type] !== undefined) {
        return MODEL_LIMITS[key][type];
    }

    // Default fallback rate limits
    if (type === 'rpm') return m.name.includes('pro') ? 2 : 15;
    if (type === 'tpm') return m.name.includes('pro') ? 32000 : 1000000;
    if (type === 'rpd') return m.name.includes('pro') ? 50 : 1500;
    return -1;
}

// Update models from API data
function updateModelsFromAPI(apiModels) {
    // Map API models to our format
    apiModels.forEach(apiModel => {
        const existingModel = allModels.find(m => m.name === apiModel.name);
        if (existingModel) {
            // Update with API information
            existingModel.supportedGenerationMethods = apiModel.supportedGenerationMethods || [];
            existingModel.description = apiModel.description || '';
        }
    });

    saveToLocalStorage();
    renderModels();
}

// Local Storage Management
function saveToLocalStorage() {
    localStorage.setItem('googleAIModels', JSON.stringify(allModels));
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    localStorage.setItem('dataVersion', DATA_VERSION);
}

function loadFromLocalStorage() {
    const savedModels = localStorage.getItem('googleAIModels');
    const savedChat = localStorage.getItem('chatHistory');

    if (savedModels) {
        allModels = JSON.parse(savedModels);
        currentModels = [...allModels];
    }

    if (savedChat) {
        chatHistory = JSON.parse(savedChat);
    }
}

// Tab Switching
function switchTab(tabId) {
    const sections = ['models-section', 'analytics-section', 'chat-section'];
    const tabs = ['models-tab', 'analytics-tab', 'chat-tab'];

    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.classList.remove('active');
    });

    const targetSection = document.getElementById(`${tabId}-section`);
    const targetTab = document.getElementById(`${tabId}-tab`);
    const mainContent = document.querySelector('.main-content');

    if (targetSection) targetSection.classList.remove('hidden');
    if (targetTab) targetTab.classList.add('active');

    // Dynamic padding for Chat focus
    if (mainContent) {
        if (tabId === 'chat') {
            mainContent.style.padding = '20px';
        } else {
            mainContent.style.padding = '40px';
        }
    }

    if (tabId === 'analytics') {
        setTimeout(() => initCharts(), 100);
    }

    if (tabId === 'chat') {
        renderChatMessages();
    }

    // Refresh icons for new section
    if (window.lucide) {
        lucide.createIcons();
    }
}

function updateAPIStatus(connected, message) {
    const statusDot = document.getElementById('api-status');
    const statusText = document.getElementById('api-status-text');

    if (connected) {
        statusDot.className = 'w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        statusText.innerText = 'Connected';
        statusText.className = 'text-sm font-medium text-green-600';
    } else {
        statusDot.className = 'w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]';
        statusText.innerText = message || 'Disconnected';
        statusText.className = 'text-sm font-medium text-red-600';
    }
}

// Model Rendering
function renderModels(modelsToRender = allModels) {
    const grid = document.getElementById('models-grid');
    if (!grid) return;

    grid.innerHTML = '';

    modelsToRender.forEach(model => {
        const card = document.createElement('div');
        card.className = 'premium-card elevation-1';

        const rpmPercent = model.rpm.limit > 0 ? (model.rpm.used / model.rpm.limit) * 100 : 0;
        const tpmPercent = model.tpm.limit > 0 ? (model.tpm.used / model.tpm.limit) * 100 : 0;

        const statusBadgeClass = model.status === 'available' ? 'badge-available' : model.status === 'limited' ? 'badge-limited' : 'badge-unavailable';

        // Format limits for display
        const formatLimit = (val) => val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val;

        card.innerHTML = `
        <div class="flex items-start justify-between mb-6">
            <div class="p-3 bg-gray-50 rounded-2xl">
                <i data-lucide="${model.category.includes('Multi-modal') ? 'layers' : 'type'}" class="w-6 h-6 text-blue-500"></i>
            </div>
            <span class="badge ${statusBadgeClass}">${model.status}</span>
        </div>
        <h3 class="text-lg font-bold mb-1 truncate">${model.displayName || model.name}</h3>
        <p class="text-[10px] uppercase font-bold text-[#86868b] tracking-widest mb-6">${model.category}</p>
        
        <div class="space-y-4">
            <div>
                <div class="flex justify-between text-[11px] font-bold mb-1.5">
                    <span class="text-[#86868b]">RPM</span>
                    <span class="${rpmPercent > 80 ? 'text-red-500' : 'text-gray-900'}">${model.rpm.used} / ${model.rpm.limit}</span>
                </div>
                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min(rpmPercent, 100)}%"></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-[11px] font-bold mb-1.5">
                    <span class="text-[#86868b]">TPM</span>
                    <span class="${tpmPercent > 80 ? 'text-red-500' : 'text-gray-900'}">${formatLimit(model.tpm.used)} / ${formatLimit(model.tpm.limit)}</span>
                </div>
                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-purple-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min(tpmPercent, 100)}%"></div>
                </div>
            </div>
            <div class="pt-2 flex items-center justify-between text-[10px] font-bold text-[#86868b]">
                <span>DAILY RPD</span>
                <span class="text-[#1d1d1f]">${model.rpd.used} / ${model.rpd.limit}</span>
            </div>
        </div>
    `;

        grid.appendChild(card);
    });

    // Initialize icons
    lucide.createIcons();
}

// Filtering
function filterModels() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    currentModels = allModels.filter(model => {
        const matchesCategory = !categoryFilter || model.category === categoryFilter;
        const matchesStatus = !statusFilter || model.status === statusFilter;
        const matchesSearch = !searchTerm ||
            model.name.toLowerCase().includes(searchTerm) ||
            (model.displayName && model.displayName.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesStatus && matchesSearch;
    });

    renderModels();
}

// Model Selection
function selectModel(modelName) {
    switchTab('chat');
    document.getElementById('chat-model-select').value = modelName;
}

// Model Editing (simplified)
function editModel(modelName) {
    const model = allModels.find(m => m.name === modelName);
    if (model) {
        const newRpm = prompt(`Update RPM usage for ${modelName} (current: ${model.rpm.used}):`, model.rpm.used);
        if (newRpm !== null) {
            model.rpm.used = parseInt(newRpm) || 0;
            saveToLocalStorage();
            renderModels();
        }
    }
}

// Refresh Models
async function refreshModels() {
    const refreshBtn = event.target.closest('button');
    const icon = refreshBtn.querySelector('i');

    // Add spinning animation
    icon.style.animation = 'spin 1s linear infinite';

    try {
        await checkAPIConnection();

        // Show success feedback
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Updated</span>';
        refreshBtn.classList.add('bg-green-100', 'text-green-700');

        setTimeout(() => {
            refreshBtn.innerHTML = originalContent;
            refreshBtn.classList.remove('bg-green-100', 'text-green-700');
            lucide.createIcons();
        }, 2000);

    } catch (error) {
        console.error('Refresh failed:', error);

        // Show error feedback
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i><span>Error</span>';
        refreshBtn.classList.add('bg-red-100', 'text-red-700');

        setTimeout(() => {
            refreshBtn.innerHTML = originalContent;
            refreshBtn.classList.remove('bg-red-100', 'text-red-700');
            lucide.createIcons();
        }, 2000);
    } finally {
        // Remove spinning animation
        icon.style.animation = '';
    }
}

// Chat Interface
function updateChatModelSelect() {
    const select = document.getElementById('chat-model-select');
    if (!select) return;

    select.innerHTML = '';

    const availableModels = allModels.filter(model => model.status === 'available');
    availableModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name; // Use API name for value
        const displayName = model.displayName || model.name;
        option.textContent = `${displayName} (${model.category})`;
        select.appendChild(option);
    });
}

async function sendMessage() {
    if (isGenerating) return;

    const input = document.getElementById('chat-input');
    const modelSelect = document.getElementById('chat-model-select');
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');
    const tempSlider = document.getElementById('temperature');
    const maxTokensInput = document.getElementById('max-tokens');

    const message = input.value.trim();
    if (!message) return;

    const selectedModel = modelSelect.value;
    const temperature = parseFloat(tempSlider.value);
    const maxTokens = parseInt(maxTokensInput.value);

    // Add user message
    chatHistory.push({
        type: 'user',
        message: message,
        model: selectedModel,
        timestamp: new Date().toISOString()
    });

    renderChatMessages();
    input.value = '';

    // Show loading state
    isGenerating = true;
    sendBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');

    // Add assistant message placeholder
    const assistantMessage = {
        type: 'assistant',
        message: '',
        model: selectedModel,
        timestamp: new Date().toISOString(),
        isStreaming: true
    };
    chatHistory.push(assistantMessage);
    renderChatMessages();

    const messageIndex = chatHistory.length - 1;
    let fullResponse = '';

    try {
        await aiAPI.streamContent(selectedModel, message, {
            temperature,
            maxOutputTokens: maxTokens
        }, (chunk) => {
            fullResponse += chunk;
            chatHistory[messageIndex].message = fullResponse;
            // Throttle rendering for performance if needed, but for now simple update
            renderLastMessage(messageIndex);
        });

        chatHistory[messageIndex].isStreaming = false;

        // Update model usage (estimate)
        updateStats();
        if (typeof initCharts === 'function') initCharts();

    } catch (error) {
        console.error('API Error:', error);
        chatHistory[messageIndex].message = `Error: ${error.message}. Please check your API configuration and try again.`;
        chatHistory[messageIndex].isError = true;
        chatHistory[messageIndex].isStreaming = false;
    } finally {
        isGenerating = false;
        sendBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        renderChatMessages();
        saveToLocalStorage();
    }
}

// Helper to render only the last message for performance during streaming
function renderLastMessage(index) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const existingMessages = container.querySelectorAll('.chat-message');
    if (existingMessages[index]) {
        const msg = chatHistory[index];
        const contentDiv = existingMessages[index].querySelector('.markdown-content');
        if (contentDiv) {
            contentDiv.innerHTML = marked.parse(msg.message) + (msg.isStreaming ? '<span class="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>' : '');
        }
    } else {
        renderChatMessages();
    }
    container.scrollTop = container.scrollHeight;
}

// Simple token estimator (4 chars / token)
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

function stopGeneration() {
    if (currentGenerationController) {
        currentGenerationController.abort();
        currentGenerationController = null;
    }

    isGenerating = false;
    const sendBtn = document.getElementById('send-btn');
    const stopBtn = document.getElementById('stop-btn');

    sendBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');

    // Remove loading message
    const loadingIndex = chatHistory.findIndex(msg => msg.isLoading);
    if (loadingIndex !== -1) {
        chatHistory.splice(loadingIndex, 1);
        renderChatMessages();
    }
}

function updateModelUsage(modelName, usage) {
    const model = allModels.find(m => m.name === modelName);
    if (model && usage) {
        // Update model usage based on API response
        if (usage.promptTokenCount) {
            model.tpm.used += usage.promptTokenCount;
        }
        if (usage.candidatesTokenCount) {
            model.tpm.used += usage.candidatesTokenCount;
        }
        model.rpm.used += 1;

        // Update status if needed
        const rpmPercentage = (model.rpm.used / model.rpm.limit) * 100;
        if (rpmPercentage >= 90) {
            model.status = 'limited';
        }

        saveToLocalStorage();
        renderModels();
    }
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    if (chatHistory.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-12 space-y-4">
                <div class="p-6 bg-blue-50 rounded-full">
                    <i data-lucide="message-circle" class="w-12 h-12 text-blue-500 opacity-20"></i>
                </div>
                <h3 class="text-xl font-bold tracking-tight">How can I help today?</h3>
                <p class="text-sm text-[#86868b] max-w-sm">Select a model on the left to start a conversation.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = '';

    chatHistory.forEach((msg, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} w-full mb-6`;

        const isError = msg.isError || false;

        messageDiv.innerHTML = `
        <div class="max-w-[85%] lg:max-w-[70%] ${msg.type === 'user' ? 'ml-12' : 'mr-12'}">
            <div class="chat-bubble ${msg.type === 'user'
                ? 'chat-bubble-user shadow-md'
                : isError
                    ? 'bg-red-50 text-red-800 border border-red-100'
                    : 'chat-bubble-assistant border border-gray-100 shadow-sm'
            } ${msg.isStreaming ? 'apple-glass animate-pulse' : ''} transition-all duration-300">
                ${msg.isStreaming && !msg.message
                ? `<div class="flex items-center space-x-2 py-1">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                       </div>`
                : `<div class="markdown-content text-[14px] leading-relaxed">${marked.parse(msg.message)}${msg.isStreaming ? '<span class="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>' : ''}</div>`
            }
            </div>
            <div class="flex items-center space-x-2 mt-2 px-1 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">
                <span class="text-blue-600">${msg.type === 'assistant' ? (getModelDisplayName(msg.model) || msg.model) : 'ME'}</span>
                <span>•</span>
                <span>${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                ${msg.usage ? `<span>•</span><span>${msg.usage.totalTokenCount || 0} tokens</span>` : ''}
            </div>
        </div>
    `;

        container.appendChild(messageDiv);
    });

    // Auto scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatHistory = [];
        renderChatMessages();
        saveToLocalStorage();
    }
}

// Analytics
function initCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    // Usage Trend Chart (7-Day)
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    const history = usageTracker.getUsageHistory(7);
    const dates = Object.keys(history).reverse();

    charts.trend = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Requests',
                data: dates.map(d => Object.values(history[d]).reduce((sum, m) => sum + m.requests, 0)),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Tokens (k)',
                data: dates.map(d => Object.values(history[d]).reduce((sum, m) => sum + m.totalTokens, 0) / 1000),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Model Efficiency Radar Chart
    const efficiencyCtx = document.getElementById('efficiencyChart').getContext('2d');
    const topModels = allModels.slice(0, 5);

    charts.efficiency = new Chart(efficiencyCtx, {
        type: 'radar',
        data: {
            labels: ['Availability', 'RPM Headroom', 'TPM Headroom', 'Stability', 'Capability'],
            datasets: topModels.map((m, i) => ({
                label: m.displayName || m.name,
                data: [
                    m.status === 'available' ? 100 : m.status === 'limited' ? 50 : 0,
                    m.rpm.limit > 0 ? (1 - (m.rpm.used / m.rpm.limit)) * 100 : 100,
                    m.tpm.limit > 0 ? (1 - (m.tpm.used / m.tpm.limit)) * 100 : 100,
                    90 + (Math.random() * 10), // Placeholder for stability
                    m.name.includes('pro') ? 100 : 70 // Capability heuristic
                ],
                borderColor: `hsl(${i * 72}, 70%, 50%)`,
                backgroundColor: `hsla(${i * 72}, 70%, 50%, 0.2)`
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // RPM Usage Chart
    const rpmCtx = document.getElementById('rpmChart').getContext('2d');
    const topRpmModels = allModels
        .filter(m => m.rpm.limit > 0)
        .sort((a, b) => (b.rpm.used / b.rpm.limit) - (a.rpm.used / a.rpm.limit))
        .slice(0, 10);

    charts.rpm = new Chart(rpmCtx, {
        type: 'bar',
        data: {
            labels: topRpmModels.map(m => m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name),
            datasets: [{
                label: 'RPM Usage %',
                data: topRpmModels.map(m => ((m.rpm.used / m.rpm.limit) * 100).toFixed(1)),
                backgroundColor: '#8b5cf6'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // TPM Usage Chart
    const tpmCtx = document.getElementById('tpmChart').getContext('2d');
    const topTpmModels = allModels
        .filter(m => m.tpm.limit > 0)
        .sort((a, b) => (b.tpm.used / b.tpm.limit) - (a.tpm.used / a.tpm.limit))
        .slice(0, 10);

    charts.tpm = new Chart(tpmCtx, {
        type: 'bar',
        data: {
            labels: topTpmModels.map(m => m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name),
            datasets: [{
                label: 'TPM %',
                data: topTpmModels.map(m => ((m.tpm.used / m.tpm.limit) * 100).toFixed(1)),
                backgroundColor: '#06b6d4'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });

    // Type Mix Chart (Usage Chart)
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    const categories = [...new Set(allModels.map(m => m.category))];
    const categoryCounts = categories.map(cat => allModels.filter(m => m.category === cat).length);

    charts.usage = new Chart(usageCtx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: categoryCounts,
                backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
            },
            cutout: '70%'
        }
    });

    // Latency Distribution
    const latencyCtx = document.getElementById('latencyChart').getContext('2d');
    charts.latency = new Chart(latencyCtx, {
        type: 'bar',
        data: {
            labels: topModels.map(m => m.name),
            datasets: [{
                label: 'Avg Response Time (ms)',
                data: topModels.map(() => 400 + Math.random() * 1200), // Simulated latency
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Activity Heatmap
    const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const dayData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));

    charts.heatmap = new Chart(heatmapCtx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Requests',
                data: dayData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
                y: { display: false }
            }
        }
    });

    // Update statistics table
    updateStatsTable();
}

function updateStatsTable() {
    const tbody = document.getElementById('stats-table');
    tbody.innerHTML = '';

    allModels.forEach(model => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50/50 transition-colors';

        const rpmUsage = model.rpm.limit > 0 ? ((model.rpm.used / model.rpm.limit) * 100).toFixed(1) : '0';
        const tpmUsage = model.tpm.limit > 0 ? ((model.tpm.used / model.tpm.limit) * 100).toFixed(1) : '0';
        const rpdUsage = model.rpd.limit > 0 ? ((model.rpd.used / model.rpd.limit) * 100).toFixed(1) : '0';

        const statusBadgeClass = model.status === 'available' ? 'badge-available' : model.status === 'limited' ? 'badge-limited' : 'badge-unavailable';

        row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-bold text-[#1d1d1f]">${model.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">${model.category}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
            <div class="text-sm font-semibold ${rpmUsage > 80 ? 'text-red-500' : 'text-gray-900'}">${rpmUsage}%</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
            <div class="text-sm font-semibold ${tpmUsage > 80 ? 'text-red-500' : 'text-gray-900'}">${tpmUsage}%</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
            <div class="text-sm font-semibold ${rpdUsage > 80 ? 'text-red-500' : 'text-gray-900'}">${rpdUsage}%</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="badge ${statusBadgeClass}">${model.status}</span>
        </td>
    `;

        tbody.appendChild(row);
    });
}

// Configuration Modal
function openConfigModal() {
    const modal = document.getElementById('config-modal');
    if (!modal) return;

    const apiKeyInput = document.getElementById('api-key-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const useLocalApiCheckbox = document.getElementById('use-local-api');
    const debugModeCheckbox = document.getElementById('debug-mode');

    // Load current config safely
    if (apiKeyInput) apiKeyInput.value = configManager.getApiKey();
    if (apiUrlInput) apiUrlInput.value = configManager.getApiUrl();
    if (useLocalApiCheckbox) useLocalApiCheckbox.checked = configManager.config.useLocalAPI;
    if (debugModeCheckbox) debugModeCheckbox.checked = configManager.config.debug;

    modal.classList.remove('hidden');
}

function closeConfigModal() {
    const modal = document.getElementById('config-modal');
    modal.classList.add('hidden');
}

function loadConfig() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const useLocalApiCheckbox = document.getElementById('use-local-api');
    const debugModeCheckbox = document.getElementById('debug-mode');

    if (apiKeyInput) apiKeyInput.value = configManager.getApiKey();
    if (apiUrlInput) apiUrlInput.value = configManager.getApiUrl();
    if (useLocalApiCheckbox) useLocalApiCheckbox.checked = configManager.config.useLocalAPI;
    if (debugModeCheckbox) debugModeCheckbox.checked = configManager.config.debug;
}

function saveConfig() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const useLocalApiCheckbox = document.getElementById('use-local-api');
    const debugModeCheckbox = document.getElementById('debug-mode');

    const newConfig = {
        apiKey: apiKeyInput ? apiKeyInput.value : '',
        apiUrl: apiUrlInput ? apiUrlInput.value : '',
        useLocalAPI: useLocalApiCheckbox ? useLocalApiCheckbox.checked : false,
        debug: debugModeCheckbox ? debugModeCheckbox.checked : false
    };

    configManager.updateConfig(newConfig);
    closeConfigModal();

    // Recheck API connection with new config
    checkAPIConnection();

    // Show success message
    showNotification('Configuration saved successfully!', 'success');
}

function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('api-key-input');
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
}

// Helper function to get model display name
function getModelDisplayName(modelName) {
    const model = allModels.find(m => m.name === modelName);
    return model ? (model.displayName || model.name) : modelName;
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

    const bgColor = type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

    notification.classList.add(bgColor, 'text-white');
    notification.innerHTML = `
    <div class="flex items-center space-x-2">
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="w-5 h-5"></i>
        <span>${message}</span>
    </div>
`;

    document.body.appendChild(notification);
    lucide.createIcons();

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animation for spin
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
function exportData() {
    const data = {
        models: allModels,
        chatHistory: chatHistory,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-ai-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('import-file').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.models) {
                allModels = data.models;
                currentModels = [...allModels];
            }

            if (data.chatHistory) {
                chatHistory = data.chatHistory;
            }

            saveToLocalStorage();
            renderModels();
            updateChatModelSelect();

            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Update model usage stats
function updateModelUsage(modelName, usage) {
    const model = allModels.find(m => m.name === modelName || m.name === `models/${modelName}`);
    if (!model) return;

    // Update local model object
    model.rpm.used += 1;
    model.tpm.used += usage.totalTokenCount || 0;
    model.rpd.used += 1;

    // Ensure we don't exceed limits for status calculation (though we keep counting)
    if (model.rpm.limit > 0 && model.rpm.used >= model.rpm.limit) model.status = 'limited';
    if (model.rpd.limit > 0 && model.rpd.used >= model.rpd.limit) model.status = 'unavailable';

    // Persist to localStorage
    saveToLocalStorage();

    // Update global usage tracker (for charts)
    if (window.usageTracker) {
        usageTracker.trackUsage(modelName, { usageMetadata: usage });
    }

    // Refresh UI
    renderModels();
    updateStats();
}

// Token estimation (rough)
function estimateTokens(text) {
    if (!text) return 0;
    // Rough estimate: 1 token ~= 4 characters or 0.75 words
    return Math.ceil(text.length / 4);
}

function startLimitResets() {
    // Reset RPM and TPM every 60 seconds
    setInterval(() => {
        allModels.forEach(model => {
            model.rpm.used = 0;
            model.tpm.used = 0;
        });
        saveToLocalStorage();
        updateStats();
        if (window.debugMode) console.log("RPM and TPM limits reset.");
    }, 60000);

    // Reset RPD once a day
    setInterval(() => {
        const lastReset = localStorage.getItem('lastRpdReset');
        const now = new Date();
        const lastDate = lastReset ? new Date(parseInt(lastReset)) : null;

        if (!lastDate || now.getDate() !== lastDate.getDate()) {
            allModels.forEach(model => {
                model.rpd.used = 0;
                model.status = 'available'; // Reset status too
            });
            localStorage.setItem('lastRpdReset', now.getTime().toString());
            saveToLocalStorage();
            updateStats();
            if (window.debugMode) console.log("Daily RPD limits reset.");
        }
    }, 60000); // Check every minute
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
