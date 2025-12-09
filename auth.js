/**
 * Controle de Patrimônio - Autenticação
 * Gerenciamento de sessão e autenticação do usuário
 */

// =====================================================
// LOGIN
// =====================================================

async function login(usuario, senha) {
    if (DEV_MODE) {
        if (usuario === DEV_CREDENTIALS.usuario && senha === DEV_CREDENTIALS.senha) {
            setSession(usuario);
            return { autenticado: true, usuario: usuario };
        }
        return { autenticado: false, message: 'Credenciais inválidas' };
    }
    
    try {
        const response = await fazerRequisicaoGET({
            action: 'login',
            usuario: usuario,
            senha: senha
        });
        
        if (response && response.autenticado) {
            setSession(usuario);
        }
        
        return response || { autenticado: false, message: 'Erro ao conectar' };
    } catch (error) {
        console.error('Erro no login:', error);
        return { autenticado: false, message: 'Erro de conexão' };
    }
}

// =====================================================
// LOGOUT
// =====================================================

function logout() {
    clearSession();
    window.location.href = 'login.html';
}

// =====================================================
// SESSÃO
// =====================================================

function setSession(usuario) {
    sessionStorage.setItem('autenticado', 'true');
    sessionStorage.setItem('usuario', usuario);
    sessionStorage.setItem('loginTime', Date.now().toString());
}

function clearSession() {
    sessionStorage.removeItem('autenticado');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('equipamentoSelecionado');
}

function isAuthenticated() {
    return sessionStorage.getItem('autenticado') === 'true';
}

function getUsuario() {
    return sessionStorage.getItem('usuario') || '';
}

function getLoginTime() {
    return parseInt(sessionStorage.getItem('loginTime') || '0');
}

// =====================================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// =====================================================

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}

// =====================================================
// EQUIPAMENTO SELECIONADO (PARA EDIÇÃO)
// =====================================================

function setEquipamentoSelecionado(equipamento) {
    sessionStorage.setItem('equipamentoSelecionado', JSON.stringify(equipamento));
}

function getEquipamentoSelecionado() {
    const data = sessionStorage.getItem('equipamentoSelecionado');
    return data ? JSON.parse(data) : null;
}

function clearEquipamentoSelecionado() {
    sessionStorage.removeItem('equipamentoSelecionado');
}
