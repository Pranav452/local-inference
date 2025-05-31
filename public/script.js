// Global variables
let currentModel = 'gemma3:4b';
let currentTemperature = 0.7;
let currentType = 'story';
let isGenerating = false;
let generationHistory = [];

// DOM elements
const elements = {
    connectionStatus: document.getElementById('connectionStatus'),
    contentType: document.getElementById('contentType'),
    modelSelect: document.getElementById('modelSelect'),
    temperature: document.getElementById('temperature'),
    temperatureValue: document.getElementById('temperatureValue'),
    promptInput: document.getElementById('promptInput'),
    generateBtn: document.getElementById('generateBtn'),
    outputSection: document.getElementById('outputSection'),
    outputMeta: document.getElementById('outputMeta'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    outputContent: document.getElementById('outputContent'),
    copyBtn: document.getElementById('copyBtn'),
    regenerateBtn: document.getElementById('regenerateBtn'),
    historyContainer: document.getElementById('historyContainer')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadHistory();
    checkOllamaConnection();
});

// Initialize app with default values
function initializeApp() {
    elements.temperature.value = currentTemperature;
    elements.temperatureValue.textContent = currentTemperature;
    elements.contentType.value = currentType;
    elements.modelSelect.value = currentModel;
    
    // Load available models
    loadAvailableModels();
}

// Setup all event listeners
function setupEventListeners() {
    // Temperature slider
    elements.temperature.addEventListener('input', function() {
        currentTemperature = parseFloat(this.value);
        elements.temperatureValue.textContent = currentTemperature;
    });
    
    // Content type selector
    elements.contentType.addEventListener('change', function() {
        currentType = this.value;
        updatePlaceholder();
    });
    
    // Model selector
    elements.modelSelect.addEventListener('change', function() {
        currentModel = this.value;
    });
    
    // Generate button
    elements.generateBtn.addEventListener('click', generateContent);
    
    // Enter key in prompt input
    elements.promptInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateContent();
        }
    });
    
    // Copy button
    elements.copyBtn.addEventListener('click', copyToClipboard);
    
    // Regenerate button
    elements.regenerateBtn.addEventListener('click', regenerateContent);
}

// Update placeholder text based on content type
function updatePlaceholder() {
    const placeholders = {
        story: "Enter your story prompt here... (e.g., 'A magical forest adventure', 'Space exploration in the year 3000', 'A detective solving a mysterious case')",
        blog: "Enter your blog topic here... (e.g., 'The future of renewable energy', 'Benefits of remote work', 'How to start a successful startup')",
        tweet: "Enter your tweet topic here... (e.g., 'Motivation for Monday morning', 'Latest tech trends', 'Tips for productivity')"
    };
    
    elements.promptInput.placeholder = placeholders[currentType] || placeholders.story;
}

// Check Ollama connection status
async function checkOllamaConnection() {
    const status = elements.connectionStatus;
    status.className = 'connection-status checking';
    status.innerHTML = '<i class="fas fa-circle"></i><span>Checking connection...</span>';
    
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.status === 'ok') {
            status.className = 'connection-status connected';
            status.innerHTML = '<i class="fas fa-circle"></i><span>Connected to Ollama</span>';
        } else {
            throw new Error('Ollama not connected');
        }
    } catch (error) {
        status.className = 'connection-status disconnected';
        status.innerHTML = '<i class="fas fa-circle"></i><span>Ollama disconnected</span>';
        console.error('Ollama connection error:', error);
    }
}

// Load available models from Ollama
async function loadAvailableModels() {
    try {
        const response = await fetch('/api/models');
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
            const select = elements.modelSelect;
            select.innerHTML = '';
            
            data.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = formatModelName(model);
                if (model === currentModel) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading models:', error);
    }
}

// Format model name for display
function formatModelName(modelName) {
    const modelMap = {
        'gemma3:1b': 'Gemma 3 1B (Fast)',
        'gemma3:4b': 'Gemma 3 4B (Recommended)',
        'gemma3:12b': 'Gemma 3 12B (Better Quality)',
        'gemma3:27b': 'Gemma 3 27B (Best Quality)',
        'gemma3:1b-it-qat': 'Gemma 3 1B QAT',
        'gemma3:4b-it-qat': 'Gemma 3 4B QAT',
        'gemma3:12b-it-qat': 'Gemma 3 12B QAT',
        'gemma3:27b-it-qat': 'Gemma 3 27B QAT'
    };
    
    return modelMap[modelName] || modelName;
}

// Generate content using Ollama
async function generateContent() {
    const prompt = elements.promptInput.value.trim();
    
    if (!prompt) {
        showNotification('Please enter a prompt', 'error');
        return;
    }
    
    if (isGenerating) {
        return;
    }
    
    try {
        setGeneratingState(true);
        showOutputSection();
        showLoadingSpinner();
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                model: currentModel,
                temperature: currentTemperature,
                type: currentType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayGeneratedContent(data.text, prompt);
            addToHistory(prompt, data.text, data.type, data.model, currentTemperature);
            showNotification('Content generated successfully!', 'success');
        } else {
            throw new Error(data.error || 'Failed to generate content');
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        hideOutputSection();
    } finally {
        setGeneratingState(false);
        hideLoadingSpinner();
    }
}

// Regenerate content with same prompt
function regenerateContent() {
    generateContent();
}

// Set generating state
function setGeneratingState(generating) {
    isGenerating = generating;
    elements.generateBtn.disabled = generating;
    elements.regenerateBtn.disabled = generating;
    
    if (generating) {
        elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    } else {
        elements.generateBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Generate';
    }
}

// Show output section
function showOutputSection() {
    elements.outputSection.style.display = 'block';
    elements.outputSection.classList.add('fade-in');
}

// Hide output section
function hideOutputSection() {
    elements.outputSection.style.display = 'none';
}

// Show loading spinner
function showLoadingSpinner() {
    elements.loadingSpinner.classList.add('show');
    elements.outputContent.style.display = 'none';
}

// Hide loading spinner
function hideLoadingSpinner() {
    elements.loadingSpinner.classList.remove('show');
    elements.outputContent.style.display = 'block';
}

// Display generated content
function displayGeneratedContent(content, prompt) {
    elements.outputContent.textContent = content;
    elements.outputMeta.textContent = `${formatModelName(currentModel)} • ${getTypeIcon(currentType)} ${currentType.charAt(0).toUpperCase() + currentType.slice(1)} • Temperature: ${currentTemperature}`;
}

// Get icon for content type
function getTypeIcon(type) {
    const icons = {
        story: '📖',
        blog: '✍️',
        tweet: '🐦'
    };
    return icons[type] || '📝';
}

// Copy content to clipboard
async function copyToClipboard() {
    try {
        const content = elements.outputContent.textContent;
        await navigator.clipboard.writeText(content);
        
        const originalText = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        elements.copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            elements.copyBtn.innerHTML = originalText;
            elements.copyBtn.style.background = '';
        }, 2000);
        
        showNotification('Content copied to clipboard!', 'success');
    } catch (error) {
        console.error('Copy error:', error);
        showNotification('Failed to copy content', 'error');
    }
}

// Add to generation history
function addToHistory(prompt, content, type, model, temperature) {
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        prompt: prompt,
        content: content,
        type: type,
        model: model,
        temperature: temperature
    };
    
    generationHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (generationHistory.length > 10) {
        generationHistory = generationHistory.slice(0, 10);
    }
    
    saveHistory();
    renderHistory();
}

// Save history to localStorage
function saveHistory() {
    try {
        localStorage.setItem('aiWriterHistory', JSON.stringify(generationHistory));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// Load history from localStorage
function loadHistory() {
    try {
        const saved = localStorage.getItem('aiWriterHistory');
        if (saved) {
            generationHistory = JSON.parse(saved);
            renderHistory();
        }
    } catch (error) {
        console.error('Error loading history:', error);
        generationHistory = [];
    }
}

// Render history items
function renderHistory() {
    const container = elements.historyContainer;
    
    if (generationHistory.length === 0) {
        container.innerHTML = '<p class="no-history">No generations yet. Start by entering a prompt above!</p>';
        return;
    }
    
    container.innerHTML = generationHistory.map(item => `
        <div class="history-item" onclick="loadHistoryItem('${item.id}')">
            <div class="history-prompt">${getTypeIcon(item.type)} ${truncateText(item.prompt, 80)}</div>
            <div class="history-content">${truncateText(item.content, 150)}</div>
            <div class="history-meta">
                <span>${formatModelName(item.model)} • Temp: ${item.temperature}</span>
                <span>${formatTimestamp(item.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

// Load history item into current prompt
function loadHistoryItem(id) {
    const item = generationHistory.find(h => h.id == id);
    if (item) {
        elements.promptInput.value = item.prompt;
        elements.contentType.value = item.type;
        elements.modelSelect.value = item.model;
        elements.temperature.value = item.temperature;
        
        currentType = item.type;
        currentModel = item.model;
        currentTemperature = item.temperature;
        
        elements.temperatureValue.textContent = item.temperature;
        updatePlaceholder();
        
        showNotification('History item loaded!', 'success');
    }
}

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.background = colors[type] || colors.info;
    
    // Add icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Check connection periodically
setInterval(checkOllamaConnection, 30000); // Check every 30 seconds 