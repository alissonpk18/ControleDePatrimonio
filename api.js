/**
 * Controle de Patrimônio - API
 * Funções de comunicação com o backend Google Apps Script
 */

// =====================================================
// REQUISIÇÃO GET
// =====================================================

async function fazerRequisicaoGET(params) {
    try {
        const url = new URL(API_URL);
        Object.keys(params).forEach(key => {
            if (typeof params[key] === 'object') {
                url.searchParams.append(key, JSON.stringify(params[key]));
            } else {
                url.searchParams.append(key, params[key]);
            }
        });
        
        // Adiciona timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            console.error('Resposta não é JSON:', text);
            return null;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Requisição expirou (timeout)');
        } else {
            console.error('Erro na requisição GET:', error);
        }
        return null;
    }
}

// =====================================================
// TESTAR CONEXÃO
// =====================================================

async function testarConexaoAPI() {
    try {
        const response = await fazerRequisicaoGET({ action: 'ping' });
        return response !== null;
    } catch {
        return false;
    }
}

// =====================================================
// BUSCAR DADOS
// =====================================================

async function getDados(filtro = '') {
    if (DEV_MODE) {
        return getMockDados(filtro);
    }
    
    try {
        const response = await fazerRequisicaoGET({
            action: 'get_data',
            filtro: filtro
        });
        
        if (response && response.status === 'success') {
            return response.data || [];
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return [];
    }
}

// =====================================================
// BUSCAR LOGS
// =====================================================

async function getLogs(filtro = '') {
    if (DEV_MODE) {
        return getMockLogs(filtro);
    }
    
    try {
        const response = await fazerRequisicaoGET({
            action: 'get_logs',
            filtro: filtro
        });
        
        if (response && response.status === 'success') {
            return response.data || [];
        }
        return [];
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        return [];
    }
}

// =====================================================
// ATUALIZAR EQUIPAMENTO
// =====================================================

async function atualizarEquipamento(dadosAntigos, dadosNovos, usuarioLogado) {
    if (DEV_MODE) {
        console.log('DEV_MODE: Simulando atualização', dadosNovos);
        return { status: 'success', message: 'Atualizado (simulação)' };
    }
    
    try {
        const response = await fazerRequisicaoGET({
            action: 'update',
            dados_antigos: dadosAntigos,
            dados_novos: dadosNovos,
            usuario_logado: usuarioLogado
        });
        
        return response;
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return { status: 'error', message: error.message };
    }
}

// =====================================================
// DADOS MOCKADOS (DEV_MODE)
// =====================================================

function getMockDados(filtro = '') {
    const dados = [
        {
            'Máquina': 'PC-001',
            'Usuário': 'João Silva',
            'Setor': 'TI',
            'Local': 'Matriz',
            'Andar': '2º Andar',
            'Descrição': 'Desktop Principal',
            'Modelo CPU': 'Dell OptiPlex 7090',
            'Memória': '16GB',
            'S.O.': 'Windows 11',
            'HD (Gb)': '500',
            'SSD': 'Sim',
            'Pat. CPU': 'PAT-2024-001',
            'Pat. Monitor': 'PAT-2024-002',
            'Pat. NoBreak': 'PAT-2024-003',
            'Data de Aquisição': '2024-01-15',
            'Idade do Equipamento (em anos)': 0,
            'Processador': 'Intel Core i7-11700',
            'Tipo de Item': 'Desktop',
            'Caminho': 'TI/Desktops',
            'Data Atual': new Date().toISOString().split('T')[0],
            '_rowIndex': 2
        },
        {
            'Máquina': 'NB-002',
            'Usuário': 'Maria Santos',
            'Setor': 'RH',
            'Local': 'Matriz',
            'Andar': '1º Andar',
            'Descrição': 'Notebook Executivo',
            'Modelo CPU': 'Lenovo ThinkPad X1',
            'Memória': '32GB',
            'S.O.': 'Windows 11',
            'HD (Gb)': '1000',
            'SSD': 'Sim',
            'Pat. CPU': 'PAT-2024-010',
            'Pat. Monitor': '',
            'Pat. NoBreak': '',
            'Data de Aquisição': '2024-03-20',
            'Idade do Equipamento (em anos)': 0,
            'Processador': 'Intel Core i9-12900H',
            'Tipo de Item': 'Notebook',
            'Caminho': 'RH/Notebooks',
            'Data Atual': new Date().toISOString().split('T')[0],
            '_rowIndex': 3
        },
        {
            'Máquina': 'PC-003',
            'Usuário': 'Carlos Oliveira',
            'Setor': 'Financeiro',
            'Local': 'Filial 1',
            'Andar': 'Térreo',
            'Descrição': 'Desktop Contabilidade',
            'Modelo CPU': 'HP ProDesk 400',
            'Memória': '8GB',
            'S.O.': 'Windows 10',
            'HD (Gb)': '250',
            'SSD': 'Não',
            'Pat. CPU': 'PAT-2023-050',
            'Pat. Monitor': 'PAT-2023-051',
            'Pat. NoBreak': 'PAT-2023-052',
            'Data de Aquisição': '2023-06-10',
            'Idade do Equipamento (em anos)': 1,
            'Processador': 'Intel Core i5-10400',
            'Tipo de Item': 'Desktop',
            'Caminho': 'Financeiro/Desktops',
            'Data Atual': new Date().toISOString().split('T')[0],
            '_rowIndex': 4
        }
    ];
    
    if (!filtro) return dados;
    
    const filtroLower = filtro.toLowerCase();
    return dados.filter(d => 
        d['Máquina'].toLowerCase().includes(filtroLower) ||
        d['Usuário'].toLowerCase().includes(filtroLower) ||
        d['Setor'].toLowerCase().includes(filtroLower) ||
        d['Local'].toLowerCase().includes(filtroLower)
    );
}

function getMockLogs(filtro = '') {
    const logs = [
        {
            'Data': new Date().toISOString(),
            'Usuário': 'admin',
            'Máquina': 'PC-001',
            'Campo': 'Usuário',
            'Valor Antigo': 'João',
            'Valor Novo': 'João Silva'
        },
        {
            'Data': new Date(Date.now() - 86400000).toISOString(),
            'Usuário': 'admin',
            'Máquina': 'NB-002',
            'Campo': 'Setor',
            'Valor Antigo': 'Diretoria',
            'Valor Novo': 'RH'
        }
    ];
    
    if (!filtro) return logs;
    
    const filtroLower = filtro.toLowerCase();
    return logs.filter(l => 
        l['Máquina'].toLowerCase().includes(filtroLower) ||
        l['Usuário'].toLowerCase().includes(filtroLower)
    );
}
