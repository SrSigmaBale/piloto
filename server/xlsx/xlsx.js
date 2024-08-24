const path = require('path');
const xlsx = require('xlsx');

// Usando caminho absoluto para garantir que o arquivo será encontrado
const filePath = path.join(__dirname, '../Tabela_NCM_Desc_Concatenada_Vigente_20240524.xlsx');

const excel = xlsx.readFile(filePath);
const sheets = excel.SheetNames;

const headers = ['Codigo', 'Descricao', 'Descricao_Concatenada', 'Data_inicio', 'Data_fim', 'Ato_legal_inicio', 'Numero', 'Ano'];

let data = [];
for (let i = 0; i < sheets.length; i++) {
    let sheetData = xlsx.utils.sheet_to_json(excel.Sheets[excel.SheetNames[i]], {
        header: headers,
        defval: null
    });
    sheetData = sheetData.slice(1200); // Removendo as quatro primeiras linhas
    data = data.concat(sheetData);
}

module.exports = data;