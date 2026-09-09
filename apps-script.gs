const SPREADSHEET_ID = "COLE_AQUI_O_ID_DA_PLANILHA";
const SHEET_NAME = "Confirmacoes";

function doPost(e) {
  try {
    const data = parseBody_(e);
    if (String(data.website || "").trim()) return json_({ ok: true });
    validate_(data);

    const sheet = getSheet_();
    ensureHeader_(sheet);

    const adults = data.attendance === "Sim" ? number_(data.adults) : 0;
    const children = data.attendance === "Sim" ? number_(data.children) : 0;
    const total = adults + children;

    sheet.appendRow([
      new Date(),
      safeCell_(data.name),
      safeCell_(data.attendance),
      adults,
      children,
      total,
      safeCell_(data.message || ""),
      safeCell_(data.source || "")
    ]);

    return json_({ ok: true, total: total });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function doGet() {
  return json_({ ok: true, service: "RSVP convite" });
}

function getSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.includes("COLE_AQUI")) {
    throw new Error("Configure o SPREADSHEET_ID.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    "Data/Hora",
    "Nome",
    "Presença",
    "Adultos",
    "Crianças",
    "Total",
    "Recado",
    "Origem"
  ]);

  sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 8);
}

function parseBody_(e) {
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
  const params = {};

  raw.split("&").forEach(pair => {
    if (!pair) return;
    const index = pair.indexOf("=");
    const key = decodeURIComponent(index >= 0 ? pair.slice(0, index) : pair);
    const value = decodeURIComponent((index >= 0 ? pair.slice(index + 1) : "").replace(/\+/g, " "));
    params[key] = value;
  });

  return params;
}

function validate_(data) {
  const name = String(data.name || "").trim();
  const attendance = String(data.attendance || "");
  const message = String(data.message || "");

  if (name.length < 2 || name.length > 80) throw new Error("Nome inválido.");
  if (!["Sim", "Não"].includes(attendance)) throw new Error("Resposta de presença inválida.");
  if (message.length > 300) throw new Error("Recado muito longo.");

  if (attendance === "Sim") {
    const adults = number_(data.adults);
    const children = number_(data.children);
    if (adults < 0 || adults > 20 || children < 0 || children > 20 || adults + children < 1) {
      throw new Error("Quantidade de pessoas inválida.");
    }
  }
}

function number_(value) {
  const n = Number(value);
  if (!Number.isInteger(n)) throw new Error("Quantidade inválida.");
  return n;
}

function safeCell_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
