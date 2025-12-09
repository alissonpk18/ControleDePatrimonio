/**
 * Controle de Patrimônio - Google Apps Script API
 * v2.0 - Versão Simplificada para GitHub Pages
 *
 * Deploy como Web App:
 * - Execute as: Me
 * - Who has access: Anyone (NÃO "Anyone with Google Account")
 */

// =====================================================
// HANDLERS PRINCIPAIS
// =====================================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = e.parameter || {};
    var action = params.action;

    switch (action) {
      case "ping":
        return jsonResponse({
          status: "success",
          message: "API online",
          timestamp: new Date().toISOString(),
        });

      case "login":
        return handleLogin(params);

      case "get_data":
        return handleGetData(params);

      case "update":
        return handleUpdate(params);

      default:
        return jsonResponse({
          status: "error",
          message: "Ação não reconhecida: " + action,
        });
    }
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: "Erro: " + error.toString(),
    });
  }
}

// =====================================================
// FUNÇÕES DE RESPOSTA
// =====================================================

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// =====================================================
// LOGIN
// =====================================================

function handleLogin(params) {
  try {
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Usuarios");

    if (!sheet) {
      return jsonResponse({
        autenticado: false,
        message: "Aba Usuarios não encontrada",
      });
    }

    var data = sheet.getDataRange().getValues();
    var usuario = params.usuario || "";
    var senha = params.senha || "";

    for (var i = 1; i < data.length; i++) {
      if (
        String(data[i][0]).trim() === usuario &&
        String(data[i][1]).trim() === senha
      ) {
        return jsonResponse({
          autenticado: true,
          usuario: usuario,
        });
      }
    }

    return jsonResponse({
      autenticado: false,
      message: "Credenciais inválidas",
    });
  } catch (error) {
    return jsonResponse({
      autenticado: false,
      message: "Erro no login: " + error.toString(),
    });
  }
}

// =====================================================
// GET DATA
// =====================================================

function handleGetData(params) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dados");

    if (!sheet) {
      return jsonResponse({
        status: "error",
        message: "Aba Dados não encontrada",
      });
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var result = [];
    var filtro = (params.filtro || "").toLowerCase();

    for (var i = 1; i < data.length; i++) {
      var row = data[i];

      // Pula linhas vazias
      if (!row[0] || String(row[0]).trim() === "") continue;

      // Cria objeto com os dados
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      obj._rowIndex = i + 1;

      // Aplica filtro
      if (
        !filtro ||
        String(row[0]).toLowerCase().includes(filtro) ||
        String(row[1]).toLowerCase().includes(filtro) ||
        String(row[2]).toLowerCase().includes(filtro) ||
        String(row[3]).toLowerCase().includes(filtro)
      ) {
        result.push(obj);
      }
    }

    return jsonResponse({
      status: "success",
      data: result,
      total: result.length,
    });
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: "Erro ao buscar dados: " + error.toString(),
    });
  }
}

// =====================================================
// UPDATE
// =====================================================

function handleUpdate(params) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dados");

    if (!sheet) {
      return jsonResponse({
        status: "error",
        message: "Aba Dados não encontrada",
      });
    }

    // Parse dos dados
    var dadosNovos = params.dados_novos;
    var dadosAntigos = params.dados_antigos;

    if (typeof dadosNovos === "string") {
      dadosNovos = JSON.parse(dadosNovos);
    }
    if (typeof dadosAntigos === "string") {
      dadosAntigos = JSON.parse(dadosAntigos);
    }

    var rowIndex = dadosNovos._rowIndex || dadosAntigos._rowIndex;

    if (!rowIndex) {
      return jsonResponse({
        status: "error",
        message: "Índice da linha não encontrado",
      });
    }

    // Obtém cabeçalhos
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Atualiza cada coluna
    for (var j = 0; j < headers.length; j++) {
      var colName = headers[j];
      if (dadosNovos.hasOwnProperty(colName)) {
        sheet.getRange(rowIndex, j + 1).setValue(dadosNovos[colName]);
      }
    }

    // Log da alteração
    logAlteracao(params.usuario_logado, dadosAntigos, dadosNovos);

    return jsonResponse({
      status: "success",
      message: "Dados atualizados com sucesso",
      data_alteracao: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: "Erro ao atualizar: " + error.toString(),
    });
  }
}

// =====================================================
// LOG
// =====================================================

function logAlteracao(usuario, dadosAntigos, dadosNovos) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");

    if (!sheet) {
      // Cria a aba Logs se não existir
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Logs");
      sheet.appendRow([
        "Data",
        "Usuário",
        "Máquina",
        "Campo",
        "Valor Antigo",
        "Valor Novo",
      ]);
    }

    var maquina = dadosNovos["Máquina"] || dadosAntigos["Máquina"] || "N/A";
    var timestamp = new Date().toISOString();

    // Registra cada alteração
    for (var key in dadosNovos) {
      if (key.startsWith("_")) continue;

      var valorAntigo = dadosAntigos[key] || "";
      var valorNovo = dadosNovos[key] || "";

      if (String(valorAntigo) !== String(valorNovo)) {
        sheet.appendRow([
          timestamp,
          usuario,
          maquina,
          key,
          valorAntigo,
          valorNovo,
        ]);
      }
    }
  } catch (error) {
    // Ignora erros no log para não quebrar a atualização
    console.log("Erro no log: " + error.toString());
  }
}

// =====================================================
// TESTE
// =====================================================

function testarAPI() {
  // Função para testar no editor do Apps Script
  var resultado = handleRequest({
    parameter: { action: "ping" },
  });
  Logger.log(resultado.getContent());
}
