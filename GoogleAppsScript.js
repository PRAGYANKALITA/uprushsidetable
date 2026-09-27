/**
 * ===================================================================
 * ESPORTS TOURNAMENT LEADERBOARD - GOOGLE APPS SCRIPT
 * ===================================================================
 * Features:
 *  1. One-click setup: Auto-generates columns, headers, formulas & 12 teams.
 *  2. Auto-Sort on Edit: Sorts rows descending by Total Points (#1 to #12).
 *  3. Web API (doGet): Serves real-time JSON data for your overlay website.
 *
 * Scoring Rule:
 *  - 1 Kill = 1 Point
 *  - 1 Booyah (Win) = 10 Points (Configurable below)
 * ===================================================================
 */

const CONFIG = {
  SHEET_NAME: "Leaderboard",
  KILL_POINTS: 1,
  BOOYAH_POINTS: 10,
  TOTAL_TEAMS: 12
};

/**
 * 1. RUN THIS ONCE: Initializes the sheet with columns, formulas, styling & 12 teams.
 * In Apps Script editor, select 'setupSheet' in the dropdown and click 'Run'.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  sheet.clear();

  // Define Headers
  const headers = ["Rank", "Team Name", "Kills", "Booyah", "Total Points"];
  sheet.getRange(1, 1, 1, 5).setValues([headers]);

  // Style Header
  const headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setBackground("#0a192f");
  headerRange.setFontColor("#00e5ff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");

  // Default 12 Teams
  const sampleTeams = [
    ["#1", "TEAM SOUL", 14, 2, ""],
    ["#2", "GODLIKE ESPORTS", 11, 1, ""],
    ["#3", "BLIND ESPORTS", 9, 1, ""],
    ["#4", "ORANGUTAN", 12, 0, ""],
    ["#5", "TEAM XSPARK", 10, 0, ""],
    ["#6", "REVENANT ESPORTS", 8, 0, ""],
    ["#7", "MEDAL ESPORTS", 7, 0, ""],
    ["#8", "GLOBAL ESPORTS", 6, 0, ""],
    ["#9", "GLADIATORS", 5, 0, ""],
    ["#10", "HYDRA OFFICIAL", 4, 0, ""],
    ["#11", "TEAM 8BIT", 3, 0, ""],
    ["#12", "INSANE ESPORTS", 2, 0, ""]
  ];

  // Insert rows
  sheet.getRange(2, 1, sampleTeams.length, 5).setValues(sampleTeams);

  // Set Formulas for Points: Total = (Kills * 1) + (Booyah * 10)
  for (let r = 2; r <= CONFIG.TOTAL_TEAMS + 1; r++) {
    sheet.getRange(r, 5).setFormula(`=(C${r} * ${CONFIG.KILL_POINTS}) + (D${r} * ${CONFIG.BOOYAH_POINTS})`);
  }

  // Formatting
  sheet.getRange(2, 1, CONFIG.TOTAL_TEAMS, 1).setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange(2, 2, CONFIG.TOTAL_TEAMS, 1).setHorizontalAlignment("left").setFontWeight("bold");
  sheet.getRange(2, 3, CONFIG.TOTAL_TEAMS, 3).setHorizontalAlignment("center");
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 110);

  // Auto-sort initial data
  autoSortAndRank(sheet);
}

/**
 * 2. Auto-Sorts and re-ranks whenever you edit team stats in Google Sheet
 */
function onEdit(e) {
  const sheet = e ? e.source.getActiveSheet() : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getName() !== CONFIG.SHEET_NAME) return;

  // Auto sort rows 2 to 13
  autoSortAndRank(sheet);
}

/**
 * Sorts rows 2 to 13 by Total Points DESC, then Kills DESC, then reassigns #1..#12
 */
function autoSortAndRank(sheet) {
  const range = sheet.getRange(2, 1, CONFIG.TOTAL_TEAMS, 5);
  
  // Sort by Column 5 (Total Points) descending, Column 3 (Kills) descending
  range.sort([
    { column: 5, ascending: false },
    { column: 3, ascending: false }
  ]);

  // Re-write Ranks #1 to #12 in Column A
  const rankValues = [];
  for (let i = 1; i <= CONFIG.TOTAL_TEAMS; i++) {
    rankValues.push([`#${i}`]);
  }
  sheet.getRange(2, 1, CONFIG.TOTAL_TEAMS, 1).setValues(rankValues);
}

/**
 * 3. WEB APP API ENDPOINT: Serves live JSON data to the website overlay
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) sheet = ss.getSheets()[0];

    const data = sheet.getRange(2, 1, CONFIG.TOTAL_TEAMS, 5).getValues();
    const result = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rank = row[0] || `#${i + 1}`;
      const name = row[1] || `Team ${i + 1}`;
      const kills = Number(row[2]) || 0;
      const booyah = Number(row[3]) || 0;
      const points = Number(row[4]) || ((kills * CONFIG.KILL_POINTS) + (booyah * CONFIG.BOOYAH_POINTS));

      result.push({
        rank: rank,
        name: name,
        kills: kills,
        booyah: booyah,
        points: points
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      timestamp: new Date().toISOString(),
      teams: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
