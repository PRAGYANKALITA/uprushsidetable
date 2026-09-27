// Esports 12-Row Leaderboard Engine

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzn6JG7fVFvPBibmw6rTDx-nZMEG0aCpnJb0ZzPqzT7f2O_no0VJebeuaE-v_Dmpwo/exec';
const POLL_INTERVAL_MS = 3000; // 3 seconds

const DEFAULT_TEAMS = [
  { rank: "#1", name: "VMS", kills: 6, booyah: 2, points: 82 },
  { rank: "#2", name: "PE", kills: 10, booyah: 1, points: 72 },
  { rank: "#3", name: "BRU", kills: 6, booyah: 1, points: 63 },
  { rank: "#4", name: "BTR", kills: 8, booyah: 0, points: 62 },
  { rank: "#5", name: "WAG", kills: 7, booyah: 0, points: 56 },
  { rank: "#6", name: "MBR", kills: 2, booyah: 0, points: 52 },
  { rank: "#7", name: "EVOS", kills: 2, booyah: 0, points: 51 },
  { rank: "#8", name: "FLCN", kills: 8, booyah: 0, points: 50 },
  { rank: "#9", name: "EP", kills: 7, booyah: 0, points: 44 },
  { rank: "#10", name: "TWIS", kills: 5, booyah: 0, points: 40 },
  { rank: "#11", name: "ONIC", kills: 0, booyah: 0, points: 32 },
  { rank: "#12", name: "MEC", kills: 3, booyah: 0, points: 26 }
];

const container = document.getElementById('leaderboardContainer');

function render(teams) {
  const displayList = [...teams];
  while (displayList.length < 12) {
    displayList.push({
      rank: `#${displayList.length + 1}`,
      name: `TEAM ${displayList.length + 1}`,
      kills: 0,
      booyah: 0,
      points: 0
    });
  }

  const top12 = displayList.slice(0, 12);

  container.innerHTML = top12.map((team, index) => {
    const rankNum = index + 1;
    const rankClass = rankNum <= 3 ? `rank-${rankNum}` : '';
    const formattedRank = `#${rankNum}`;

    return `
      <div class="leaderboard-row ${rankClass}">
        <!-- Left Section: Rank & Team Name -->
        <div class="row-left-section">
          <div class="row-rank">${formattedRank}</div>
          <div class="row-team-name">${escapeHtml(team.name)}</div>
        </div>

        <!-- Right Section: Kills & Total Points -->
        <div class="row-right-section">
          <div class="row-stat-kills">${team.kills ?? 0}</div>
          <div class="row-stat-points">${team.points ?? 0}</div>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchData() {
  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    let rawTeams = [];
    if (Array.isArray(data)) rawTeams = data;
    else if (data.teams && Array.isArray(data.teams)) rawTeams = data.teams;
    else if (data.data && Array.isArray(data.data)) rawTeams = data.data;

    const processed = rawTeams.map(item => {
      const name = item.name || item.team || item.Team || item.TeamName || "Unknown";
      const kills = parseInt(item.kills || item.Kills || 0, 10) || 0;
      const booyah = parseInt(item.booyah || item.Booyah || 0, 10) || 0;
      let points = item.points !== undefined ? parseInt(item.points, 10) : null;
      if (points === null || isNaN(points)) {
        points = kills + (booyah * 10);
      }
      return { name, kills, booyah, points };
    });

    // Auto sort descending
    processed.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.kills !== a.kills) return b.kills - a.kills;
      return b.booyah - a.booyah;
    });

    processed.forEach((t, i) => { t.rank = `#${i + 1}`; });
    render(processed);
  } catch (e) {
    console.warn("Sync error, displaying cached/fallback data:", e);
  }
}

// Initialize
render(DEFAULT_TEAMS);
fetchData();
setInterval(fetchData, POLL_INTERVAL_MS);
