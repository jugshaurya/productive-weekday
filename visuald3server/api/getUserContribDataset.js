const fetch = require("node-fetch");
const getDay = require("../utils/getDay");

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// In-memory cache: { [username]: { data, timestamp } }
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const fetchYearContributions = async (username, year) => {
  const url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
  });
  const html = await response.text();

  // Step 1: Extract td elements — map their id to their data-date
  const days = [];
  const tdRegex = /data-date="(\d{4}-\d{2}-\d{2})"\s+id="([^"]+)"/g;
  const idToDate = {};
  let match;
  while ((match = tdRegex.exec(html)) !== null) {
    idToDate[match[2]] = match[1];
  }

  // Step 2: Extract exact counts from <tool-tip for="id">...N contribution(s)...</tool-tip>
  const tooltipRegex = /for="([^"]+)"[^>]*>(\d+)\s+contribution/g;
  const dateCounts = {};
  while ((match = tooltipRegex.exec(html)) !== null) {
    const id = match[1];
    const count = +match[2];
    if (idToDate[id]) {
      dateCounts[idToDate[id]] = count;
    }
  }

  // Build days array — if no tooltip matched, count is 0 ("No contributions")
  for (const [id, date] of Object.entries(idToDate)) {
    days.push({ date, day: getDay(date), contribCount: dateCounts[date] || 0 });
  }

  return days;
};

const getWeeklyData = (dates) => {
  let week_number = 0;
  let weekWiseDataset = dates.reduce((acc, data, i) => {
    if (i % 7 === 0) {
      week_number++;
      acc[`week-${week_number}`] = [];
    }
    acc[`week-${week_number}`].push(data);
    return acc;
  }, {});

  // Don't return the last week as that week is going on...
  delete weekWiseDataset[`week-${week_number}`];
  return weekWiseDataset;
};

const getUserContribDataset = async (user) => {
  const { username } = user;

  // Return cached data if fresh
  if (cache[username] && Date.now() - cache[username].timestamp < CACHE_TTL) {
    return cache[username].data;
  }

  const startYear = Number(user.joinedYear);
  const currentYear = new Date().getFullYear();

  const years = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  const yearResults = await Promise.all(
    years.map((year) => fetchYearContributions(username, year))
  );

  // Flatten all years, deduplicate by date, sort ascending
  const dateMap = {};
  for (const day of yearResults.flat()) {
    dateMap[day.date] = day;
  }
  const allDays = Object.values(dateMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Truncate leading zero-count days
  const firstNonZeroIndex = allDays.findIndex((d) => d.contribCount > 0);
  if (firstNonZeroIndex === -1) return {};

  const trimmed = allDays.slice(firstNonZeroIndex);
  const dataset = getWeeklyData(trimmed);

  // Cache the result
  cache[username] = { data: dataset, timestamp: Date.now() };

  return dataset;
};

module.exports = getUserContribDataset;
