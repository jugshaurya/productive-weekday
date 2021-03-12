const fetch = require("node-fetch");
const getContribMapURLs = require("../utils/getContribMapURLs");
const getMapRectsInfoFromHTML = require("../utils/getMapRectsInfoFromHTML");

const getFirstNonZeroDate = (joinedDate, dates) => {
  let firstNonZeroDate = joinedDate;
  const keysArray = Object.keys(dates);
  const length = keysArray.length;

  for (let i = 0; i < length; i++) {
    if (dates[keysArray[i]].count > 0) {
      firstNonZeroDate = keysArray[i];
      break;
    }
  }

  return firstNonZeroDate;
};

const getDatesAfterFirstNonZeroDate = (firstNonZeroDate, dates) => {
  return Object.keys(dates).filter(
    (obj) =>
      new Date(obj) >= new Date(firstNonZeroDate) && new Date(obj) <= new Date()
  );
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

  //  Check: Don't return the last week as that week is going on...
  delete weekWiseDataset[`week-${week_number}`];
  return weekWiseDataset;
};

const getUserContribDataset = async (user) => {
  // retrieve all URLs and their HTML.
  const urls = getContribMapURLs(user);
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const contribMapHTMLs = await Promise.all(
    responses.map((response) => response.text())
  );

  // Get all the rect's data from HTMLs.
  const dates = contribMapHTMLs.reduce((acc, html) => {
    const contribMapDates = getMapRectsInfoFromHTML(html);
    // dates are mapped as {[date]: { count : 0, day : "day" }}
    // also removes Duplicate dates: Data Cleaning :)
    contribMapDates.map(
      (item) =>
        (acc[item["date"]] = {
          count: item["count"],
          day: item["day"],
        })
    );
    return acc;
  }, {});

  // Bonus:
  // only start counting the contribution when u got the first contribution not before that
  // otherwise user have to wait for a long time for seeing the visual movements
  // Averagely users wait 2 years after creating accounts before starting the contribution journey: Not based on anything!

  const firstNonZeroDate = getFirstNonZeroDate(user.joinedDate, dates);
  const filteredDates = getDatesAfterFirstNonZeroDate(firstNonZeroDate, dates);

  const flattenDates = filteredDates.reduce((acc, key) => {
    const { count, day } = dates[key];
    acc.push({ date: key, day, contribCount: count });
    return acc;
  }, []);

  const dataset = getWeeklyData(flattenDates);
  return dataset;
};

module.exports = getUserContribDataset;
