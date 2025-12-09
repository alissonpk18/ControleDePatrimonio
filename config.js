/**
 * Controle de Patrimônio - Configurações
 * Arquivo de configuração global da aplicação
 */

// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================

const API_URL = "https://script.google.com/macros/s/AKfycbwzuTUv1M6AndJpWOJB-DtdMi1iCXzTZheyLuQl8pUEpdckROKbnwVXvN0aO78oEK-h/exec";

// Modo de operação: true = teste local (dados mockados), false = produção
const DEV_MODE = false;

// Credenciais de teste (apenas para DEV_MODE = true)
const DEV_CREDENTIALS = { 
    usuario: 'admin', 
    senha: '123' 
};

// Timeout para requisições (em milissegundos)
const REQUEST_TIMEOUT = 15000;

// =====================================================
// COLUNAS DE DADOS
// =====================================================

const COLUNAS_DADOS = [
    'Máquina', 'Usuário', 'Setor', 'Local', 'Andar', 'Descrição',
    'Modelo CPU', 'Memória', 'S.O.', 'HD (Gb)', 'SSD', 'Pat. CPU',
    'Pat. Monitor', 'Pat. NoBreak', 'Data de Aquisição', 
    'Idade do Equipamento (em anos)', 'Processador', 'Tipo de Item', 
    'Caminho', 'Data Atual'
];

// Colunas visíveis na tabela principal
const COLUNAS_VISIVEIS = [
    'Máquina', 'Usuário', 'Setor', 'Local', 'Tipo de Item', 'S.O.'
];

// =====================================================
// OPÇÕES DE FORMULÁRIO
// =====================================================

const OPCOES_FORMULARIO = {
    setores: ['TI', 'RH', 'Financeiro', 'Comercial', 'Operações', 'Diretoria', 'Recepção', 'Almoxarifado'],
    locais: ['Matriz', 'Filial 1', 'Filial 2', 'Home Office'],
    andares: ['Térreo', '1º Andar', '2º Andar', '3º Andar', 'Subsolo'],
    tiposItem: ['Desktop', 'Notebook', 'All-in-One', 'Servidor', 'Monitor', 'Impressora'],
    sistemasOperacionais: ['Windows 10', 'Windows 11', 'Linux Ubuntu', 'macOS'],
    memorias: ['4GB', '8GB', '16GB', '32GB', '64GB'],
    ssd: ['Sim', 'Não']
};

// =====================================================
// VERSÃO
// =====================================================

const APP_VERSION = '2.0.0';
const APP_NAME = 'Controle de Patrimônio';
