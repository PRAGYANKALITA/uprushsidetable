# 🏆 12-Team Esports Leaderboard Setup Guide

This project provides a **transparent live overlay website** powered by **Google Sheets** for esports tournaments (Free Fire, Battle Royale, PUBG, BGMI, etc.).

---

## 📁 Files in This Folder

- **`index.html`** - The leaderboard webpage (transparent background for OBS / browser overlay).
- **`style.css`** - Esports styling using your custom row image (`row-bg.png`).
- **`app.js`** - Client engine (live auto-refresh, sorting, rank `#1`–`#12` calculation).
- **`row-bg.png`** - Your tournament banner row graphic.
- **`GoogleAppsScript.js`** - Copy-paste Google Apps Script code for your Google Sheet.

---

## 🚀 Step 1: Set Up Google Sheet & Script (Under 2 Minutes)

1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. In the top menu, click **Extensions** &rarr; **Apps Script**.
3. Delete any default code in `Code.gs`.
4. Open the file **`GoogleAppsScript.js`** in this folder, copy all code, and paste it into the Apps Script editor.
5. In the Apps Script toolbar:
   - Select **`setupSheet`** from the function dropdown.
   - Click **Run** (Grant permissions if prompted).
   - *Result*: Your Google Sheet will automatically generate 5 styled columns, 12 teams, point formulas, and auto-sorting!

---

## 🌐 Step 2: Deploy Web App API (Get Your Live URL)

1. In Apps Script, click the blue **Deploy** button (top right) &rarr; **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Set the following options:
   - **Description**: `Esports Leaderboard API`
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: **`Anyone`** *(Important: allows the website overlay to fetch the data without login!)*
4. Click **Deploy** and copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## 🎮 Step 3: Connect Website to Google Sheets

1. Double click **`index.html`** to open it in your browser (or add it as a Browser Source in OBS).
2. Click the **⚙️ Sheet Config** button at the bottom right (or press `H` if hidden).
3. Paste your **Web app URL** into the input field and click **Save & Apply**.
4. That's it! Whenever you change team names, kills, or booyah in Google Sheets, the leaderboard will automatically update live!

---

## 🧮 Point Calculation & Auto-Sorting

- **Kills**: 1 point each (Configurable in Sheet formula & website settings).
- **Booyah (Win)**: 10 points each (Configurable).
- **Automatic Rank Calculation**: 
  - Google Sheet & the web overlay automatically calculate Total Points:  
    $$\text{Total Points} = (\text{Kills} \times 1) + (\text{Booyah} \times 10)$$
  - Ranks `#1` to `#12` are automatically sorted from highest points to lowest points.

---

## 🎥 OBS Studio Overlay Setup

1. In OBS Studio, add a new **Browser Source**.
2. Check **Local file** and browse to `index.html` (or enter `http://localhost:.../index.html` / file path).
3. Set Width: `1920`, Height: `1080`.
4. Check **"Shutdown source when not visible"** if desired.
5. Press **`H`** on your keyboard inside the browser to hide/show the bottom configuration bar.
