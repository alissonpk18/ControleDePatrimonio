/**
 * Controle de Patrimônio - OCR
 * Reconhecimento óptico de caracteres para busca por imagem
 */

// =====================================================
// PROCESSAR IMAGEM
// =====================================================

async function processarImagemOCR(file, onProgress = null) {
    try {
        const result = await Tesseract.recognize(file, 'por', {
            logger: m => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(Math.round(m.progress * 100));
                }
            }
        });
        
        // Extrai texto e limpa
        let texto = result.data.text.trim();
        
        // Remove quebras de linha e caracteres especiais
        texto = texto.replace(/[\r\n]+/g, ' ')
                     .replace(/[^\w\sÀ-ÿ-]/g, '')
                     .replace(/\s+/g, ' ')
                     .trim();
        
        return {
            success: true,
            textoCompleto: texto,
            termoBusca: extrairTermoBusca(texto)
        };
    } catch (error) {
        console.error('Erro no OCR:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// =====================================================
// EXTRAIR TERMO DE BUSCA
// =====================================================

function extrairTermoBusca(texto) {
    if (!texto) return '';
    
    // Procura por padrões de patrimônio (PAT-XXXX, PAT XXXX, etc)
    const padraoPatrimonio = texto.match(/PAT[- ]?\d{4}[- ]?\d*/i);
    if (padraoPatrimonio) {
        return padraoPatrimonio[0].replace(/\s+/g, '-').toUpperCase();
    }
    
    // Procura por padrões de máquina (PC-XXX, NB-XXX, etc)
    const padraoMaquina = texto.match(/(PC|NB|SRV|MON)[- ]?\d{3}/i);
    if (padraoMaquina) {
        return padraoMaquina[0].replace(/\s+/g, '-').toUpperCase();
    }
    
    // Se não encontrou padrão, pega a primeira palavra significativa
    const palavras = texto.split(' ').filter(p => p.length > 2);
    return palavras.length > 0 ? palavras[0] : texto;
}

// =====================================================
// SETUP OCR INPUT
// =====================================================

function setupOCRInput(inputId, buscaInputId, statusId, onSearchCallback) {
    const inputImagem = document.getElementById(inputId);
    const filtroBusca = document.getElementById(buscaInputId);
    const ocrStatus = document.getElementById(statusId);
    
    if (!inputImagem || !filtroBusca) {
        console.warn('Elementos OCR não encontrados');
        return;
    }
    
    inputImagem.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Mostra status de processamento
        if (ocrStatus) {
            ocrStatus.classList.remove('d-none');
            ocrStatus.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processando imagem...';
        }
        filtroBusca.disabled = true;
        
        try {
            const resultado = await processarImagemOCR(file, (progresso) => {
                if (ocrStatus) {
                    ocrStatus.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processando: ${progresso}%`;
                }
            });
            
            if (resultado.success && resultado.termoBusca) {
                filtroBusca.value = resultado.termoBusca;
                showToast(`Texto extraído: "${resultado.termoBusca}"`, 'success');
                
                if (onSearchCallback) {
                    onSearchCallback();
                }
            } else if (!resultado.success) {
                showToast('Erro ao processar imagem', 'error');
            } else {
                showToast('Nenhum texto encontrado na imagem', 'warning');
            }
        } catch (error) {
            console.error('Erro no OCR:', error);
            showToast('Erro ao processar imagem', 'error');
        } finally {
            if (ocrStatus) {
                ocrStatus.classList.add('d-none');
            }
            filtroBusca.disabled = false;
            e.target.value = ''; // Limpa input para permitir mesma imagem
        }
    });
}
