/**
 * Controle de Patrimônio - Utilitários
 * Funções auxiliares e helpers
 */

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

function showToast(message, type = 'info') {
    // Remove toast existente
    const existingToast = document.querySelector('.toast-container');
    if (existingToast) {
        existingToast.remove();
    }
    
    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    }[type] || 'bg-info';
    
    const icon = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-x-circle-fill',
        'warning': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill'
    }[type] || 'bi-info-circle-fill';
    
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    container.innerHTML = `
        <div class="toast show ${bgClass} text-white" role="alert">
            <div class="toast-body d-flex align-items-center">
                <i class="bi ${icon} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.closest('.toast-container').remove()"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// =====================================================
// ELEMENTOS DOM
// =====================================================

function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('d-none');
}

function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setElementHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function getElement(id) {
    return document.getElementById(id);
}

// =====================================================
// FORMATAÇÃO
// =====================================================

function formatarData(dataString) {
    if (!dataString) return '-';
    
    try {
        const date = new Date(dataString);
        return date.toLocaleDateString('pt-BR');
    } catch {
        return dataString;
    }
}

function formatarDataHora(dataString) {
    if (!dataString) return '-';
    
    try {
        const date = new Date(dataString);
        return date.toLocaleString('pt-BR');
    } catch {
        return dataString;
    }
}

// =====================================================
// LOADING
// =====================================================

function showLoading(containerId, message = 'Carregando...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3 text-muted">${message}</p>
            </div>
        `;
    }
}

function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// =====================================================
// VALIDAÇÃO
// =====================================================

function isValidString(str) {
    return str && typeof str === 'string' && str.trim().length > 0;
}

function sanitizeString(str) {
    if (!str) return '';
    return String(str).trim();
}

// =====================================================
// URL PARAMS
// =====================================================

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

// =====================================================
// DEBOUNCE
// =====================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
