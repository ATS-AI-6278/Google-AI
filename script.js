// Google AI Studio Model Data with correct API names
const modelsData = [
    {
        name: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        category: "Text-out models",
        rpm: { used: 3, limit: 5 },
        tpm: { used: 206, limit: 250000 },
        rpd: { used: 5, limit: 20 },
        status: "available"
    },
    {
        name: "gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        category: "Text-out models",
        rpm: { used: 9, limit: 15 },
        tpm: { used: 5850, limit: 250000 },
        rpd: { used: 113, limit: 500 },
        status: "available"
    },
    {
        name: "gemini-1.5-pro",
        displayName: "Gemini 1.5 Pro",
        category: "Text-out models",
        rpm: { used: 4, limit: 30 },
        tpm: { used: 12180, limit: 15000 },
        rpd: { used: 46, limit: 14400 },
        status: "available"
    },
    {
        name: "gemini-1.5-flash-8b",
        displayName: "Gemini 1.5 Flash 8B",
        category: "Text-out models",
        rpm: { used: 1, limit: 10 },
        tpm: { used: 10820, limit: 250000 },
        rpd: { used: 2, limit: 20 },
        status: "available"
    },
    {
        name: "gemini-2.0-flash-exp",
        displayName: "Gemini 2.0 Flash Exp",
        category: "Text-out models",
        rpm: { used: 0, limit: 5 },
        tpm: { used: 0, limit: 250000 },
        rpd: { used: 0, limit: 20 },
        status: "available"
    },
    {
        name: "gemma-2-2b-it",
        displayName: "Gemma 2 2B IT",
        category: "Other models",
        rpm: { used: 0, limit: 30 },
        tpm: { used: 0, limit: 15000 },
        rpd: { used: 0, limit: 14400 },
        status: "available"
    },
    {
        name: "gemma-2-9b-it",
        displayName: "Gemma 2 9B IT",
        category: "Other models",
        rpm: { used: 0, limit: 30 },
        tpm: { used: 0, limit: 15000 },
        rpd: { used: 0, limit: 14400 },
        status: "available"
    },
    {
        name: "gemma-2-27b-it",
        displayName: "Gemma 2 27B IT",
        category: "Other models",
        rpm: { used: 0, limit: 30 },
        tpm: { used: 0, limit: 15000 },
        rpd: { used: 0, limit: 14400 },
        status: "available"
    },
    {
        name: "imagen-3.0-generate-001",
        displayName: "Imagen 3 Generate",
        category: "Multi-modal generative models",
        rpm: { used: 0, limit: 25 },
        tpm: { used: 0, limit: 0 },
        rpd: { used: 0, limit: 0 },
        status: "available"
    },
    {
        name: "text-embedding-004",
        displayName: "Text Embedding 004",
        category: "Other models",
        rpm: { used: 0, limit: 100 },
        tpm: { used: 0, limit: 30000 },
        rpd: { used: 0, limit: 1000 },
        status: "available"
    }
];

// Tool models with correct API names
const toolsData = [
    {
        name: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        category: "Tools",
        tool: "Map grounding",
        rpm: { used: 0, limit: 500 },
        tpm: { used: 0, limit: 0 },
        rpd: { used: 0, limit: 0 },
        status: "available"
    },
    {
        name: "gemini-1.5-pro",
        displayName: "Gemini 1.5 Pro",
        category: "Tools",
        tool: "Map grounding",
        rpm: { used: 0, limit: 500 },
        tpm: { used: 0, limit: 0 },
        rpd: { used: 0, limit: 0 },
        status: "available"
    },
    {
        name: "gemini-1.5-flash",
        displayName: "Gemini 1.5 Flash",
        category: "Tools",
        tool: "Map grounding",
        rpm: { used: 0, limit: 500 },
        tpm: { used: 0, limit: 0 },
        rpd: { used: 0, limit: 0 },
        status: "available"
    },
    {
        name: "gemini-1.5-flash-8b",
        displayName: "Gemini 1.5 Flash 8B",
        category: "Tools",
        tool: "Map grounding",
        rpm: { used: 0, limit: 500 },
        tpm: { used: 0, limit: 0 },
        rpd: { used: 0, limit: 0 },
        status: "available"
    }
];

// Global variables
let allModels = [...modelsData, ...toolsData];
let currentModels = [...allModels];
let chatHistory = [];
let charts = {};
let isGenerating = false;
let currentGenerationController = null;

// Initialize on page load
function init() {
    loadFromLocalStorage();
    renderModels();
    updateChatModelSelect();
    updateStats();
    checkAPIConnection();
    setupEventListeners();
    lucide.createIcons();
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
    const statusElement = document.getElementById('api-status');
    const statusText = document.getElementById('api-status-text');
    
    try {
        // Test API with a simple models list request
        const models = await aiAPI.listModels();
        
        if (statusElement && statusText) {
            statusElement.className = 'api-status connected';
            statusText.textContent = 'Connected';
            statusText.className = 'text-green-600';
        }
        
        // Update models with real API data
        if (models.length > 0) {
            updateModelsFromAPI(models);
        }
    } catch (error) {
        console.error('API Connection Error:', error);
        
        if (statusElement && statusText) {
            statusElement.className = 'api-status disconnected';
            statusText.textContent = 'Disconnected';
            statusText.className = 'text-red-600';
        }
    }
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
function switchTab(tabName) {
    // Hide all sections
    document.getElementById('models-section').classList.add('hidden');
    document.getElementById('analytics-section').classList.add('hidden');
    document.getElementById('chat-section').classList.add('hidden');
    
    // Remove active class from all tabs
    document.querySelectorAll('nav button').forEach(tab => {
        tab.classList.remove('tab-active', 'text-blue-600');
        tab.classList.add('text-gray-500');
    });
    
    // Show selected section and activate tab
    document.getElementById(`${tabName}-section`).classList.remove('hidden');
    document.getElementById(`${tabName}-tab`).classList.add('tab-active', 'text-blue-600');
    document.getElementById(`${tabName}-tab`).classList.remove('text-gray-500');
    
    // Initialize charts when analytics tab is opened
    if (tabName === 'analytics') {
        setTimeout(() => initCharts(), 100);
    }
    
    // Render chat messages when chat tab is opened
    if (tabName === 'chat') {
        renderChatMessages();
    }
}

// Model Rendering
function renderModels() {
    const grid = document.getElementById('models-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    currentModels.forEach(model => {
        const card = createModelCard(model);
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

function createModelCard(model) {
    const card = document.createElement('div');
    card.className = 'model-card glass-morphism rounded-xl p-6 hover:shadow-xl';
    
    const rpmPercentage = model.rpm.limit > 0 ? (model.rpm.used / model.rpm.limit) * 100 : 0;
    const tpmPercentage = model.tpm.limit > 0 ? (model.tpm.used / model.tpm.limit) * 100 : 0;
    const rpdPercentage = model.rpd.limit > 0 ? (model.rpd.used / model.rpd.limit) * 100 : 0;
    
    const statusColor = model.status === 'available' ? 'green' : 
                       model.status === 'limited' ? 'yellow' : 'red';
    
    const statusIcon = model.status === 'available' ? 'check-circle' : 
                      model.status === 'limited' ? 'alert-triangle' : 'x-circle';
    
    const displayName = model.displayName || model.name;
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${displayName}</h3>
                <span class="inline-flex items-center space-x-1 text-xs text-gray-500">
                    <i data-lucide="tag" class="w-3 h-3"></i>
                    <span>${model.category}</span>
                    ${model.tool ? `<span class="text-gray-400">•</span><span>${model.tool}</span>` : ''}
                </span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="status-badge px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-800 flex items-center space-x-1">
                    <i data-lucide="${statusIcon}" class="w-3 h-3"></i>
                    <span>${model.status}</span>
                </span>
            </div>
        </div>
        
        <div class="space-y-3">
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">RPM</span>
                    <span class="font-medium">${model.rpm.used} / ${model.rpm.limit === -1 ? '∞' : model.rpm.limit}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="usage-bar bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style="width: ${Math.min(rpmPercentage, 100)}%"></div>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">TPM</span>
                    <span class="font-medium">${model.tpm.used.toLocaleString()} / ${model.tpm.limit === -1 ? '∞' : model.tpm.limit.toLocaleString()}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="usage-bar bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style="width: ${Math.min(tpmPercentage, 100)}%"></div>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">RPD</span>
                    <span class="font-medium">${model.rpd.used} / ${model.rpd.limit === -1 ? '∞' : model.rpd.limit}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="usage-bar bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style="width: ${Math.min(rpdPercentage, 100)}%"></div>
                </div>
            </div>
        </div>
        
        <div class="mt-6 flex space-x-2">
            <button onclick="selectModel('${model.name}')" class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm rounded-lg transition-all flex items-center justify-center space-x-2">
                <i data-lucide="play" class="w-4 h-4"></i>
                <span>Use Model</span>
            </button>
            <button onclick="editModel('${model.name}')" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
                <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Filtering
function filterModels() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    currentModels = allModels.filter(model => {
        const matchesCategory = !categoryFilter || model.category === categoryFilter;
        const matchesStatus = !statusFilter || model.status === statusFilter;
        const matchesSearch = !searchTerm || model.name.toLowerCase().includes(searchTerm);
        
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
    
    // Add loading message
    const loadingMessage = {
        type: 'assistant',
        message: '<span class="loading-dots">Thinking</span>',
        model: selectedModel,
        timestamp: new Date().toISOString(),
        isLoading: true
    };
    chatHistory.push(loadingMessage);
    renderChatMessages();
    
    try {
        // Call real API
        const response = await aiAPI.generateContent(selectedModel, message, {
            temperature,
            maxOutputTokens: maxTokens
        });
        
        // Remove loading message and add real response
        chatHistory.pop();
        chatHistory.push({
            type: 'assistant',
            message: response.text,
            model: selectedModel,
            timestamp: new Date().toISOString(),
            usage: response.usage
        });
        
        // Update usage tracking
        updateModelUsage(selectedModel, response.usage);
        updateStats(); // Update stats after API call
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Remove loading message and add error message
        chatHistory.pop();
        chatHistory.push({
            type: 'assistant',
            message: `Error: ${error.message}. Please check your API configuration and try again.`,
            model: selectedModel,
            timestamp: new Date().toISOString(),
            isError: true
        });
    } finally {
        isGenerating = false;
        sendBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        
        renderChatMessages();
        saveToLocalStorage();
    }
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
    
    container.innerHTML = '';
    
    chatHistory.forEach((msg, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const messageContent = msg.isLoading ? msg.message : msg.message;
        const isError = msg.isError || false;
        
        messageDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md">
                <div class="${msg.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : isError 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-900'
                } rounded-lg px-4 py-3 shadow-sm">
                    ${msg.isLoading 
                        ? `<div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                           </div>` 
                        : `<p class="text-sm whitespace-pre-wrap">${messageContent}</p>`
                    }
                </div>
                <div class="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <span>${msg.type === 'assistant' ? (getModelDisplayName(msg.model) || msg.model) : 'You'}</span>
                    <span>•</span>
                    <span>${new Date(msg.timestamp).toLocaleTimeString()}</span>
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
    
    // Usage Overview Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    charts.usage = new Chart(usageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'Limited', 'Unavailable'],
            datasets: [{
                data: [
                    allModels.filter(m => m.status === 'available').length,
                    allModels.filter(m => m.status === 'limited').length,
                    allModels.filter(m => m.status === 'unavailable').length
                ],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categories = [...new Set(allModels.map(m => m.category))];
    charts.category = new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Models per Category',
                data: categories.map(cat => allModels.filter(m => m.category === cat).length),
                backgroundColor: '#3b82f6'
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
                    ticks: {
                        stepSize: 1
                    }
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
                label: 'TPM Usage %',
                data: topTpmModels.map(m => ((m.tpm.used / m.tpm.limit) * 100).toFixed(1)),
                backgroundColor: '#06b6d4'
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
    
    // Update statistics table
    updateStatsTable();
}

function updateStatsTable() {
    const tbody = document.getElementById('stats-table');
    tbody.innerHTML = '';
    
    allModels.forEach(model => {
        const row = document.createElement('tr');
        const rpmUsage = model.rpm.limit > 0 ? ((model.rpm.used / model.rpm.limit) * 100).toFixed(1) : 'N/A';
        const tpmUsage = model.tpm.limit > 0 ? ((model.tpm.used / model.tpm.limit) * 100).toFixed(1) : 'N/A';
        const rpdUsage = model.rpd.limit > 0 ? ((model.rpd.used / model.rpd.limit) * 100).toFixed(1) : 'N/A';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${model.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${model.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rpmUsage}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tpmUsage}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rpdUsage}%</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${model.status === 'available' ? 'green' : model.status === 'limited' ? 'yellow' : 'red'}-100 text-${model.status === 'available' ? 'green' : model.status === 'limited' ? 'yellow' : 'red'}-800">
                    ${model.status}
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Configuration Modal
function openConfigModal() {
    const modal = document.getElementById('config-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const timeoutInput = document.getElementById('timeout-input');
    const debugModeCheckbox = document.getElementById('debug-mode');
    
    // Load current config
    apiKeyInput.value = configManager.getApiKey();
    apiUrlInput.value = configManager.getApiUrl();
    timeoutInput.value = configManager.config.timeout;
    debugModeCheckbox.checked = configManager.config.debug;
    
    modal.classList.remove('hidden');
}

function closeConfigModal() {
    const modal = document.getElementById('config-modal');
    modal.classList.add('hidden');
}

function saveConfig() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const timeoutInput = document.getElementById('timeout-input');
    const debugModeCheckbox = document.getElementById('debug-mode');
    
    const newConfig = {
        apiKey: apiKeyInput.value,
        apiUrl: apiUrlInput.value,
        timeout: parseInt(timeoutInput.value),
        debug: debugModeCheckbox.checked
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
    reader.onload = function(e) {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
