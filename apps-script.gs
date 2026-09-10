const SPREADSHEET_ID = "1IUXLTD1FUg7BXzpfahkuDMptUImpa9mQGJVfzPMDcVU";
const SHEET_NAME = "Confirmacoes";
const HEADER_ROW = 5;

function doPost(e) {
  try {
    const data = parseBody_(e);
    if (String(data.website || "").trim()) return json_({ ok: true });
    validate_(data);

    const sheet = getSheet_();
    ensureHeader_(sheet);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      sheet.appendRow([
        new Date(),
        safeCell_(data.name),
        safeCell_(data.attendance),
        safeCell_(data.source || "")
      ]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
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
  const headers = ["Data/Hora", "Nome", "Presença", "Origem"];
  const range = sheet.getRange(HEADER_ROW, 1, 1, headers.length);
  const current = range.getDisplayValues()[0];

  if (current.every(value => !String(value).trim())) {
    range.setValues([headers]);
    range.setFontWeight("bold");
    sheet.setFrozenRows(HEADER_ROW);
  }
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
  const source = String(data.source || "").trim();

  if (name.length < 2 || name.length > 80) throw new Error("Nome inválido.");
  if (!["Sim", "Não"].includes(attendance)) throw new Error("Resposta de presença inválida.");
  if (source.length > 500) throw new Error("Origem inválida.");
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
