const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getDay = i => {
  const day = i % 7;
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
};

const getScrapUrls = (joinedYear, user) => {
  const startYear = Number(joinedYear);
  const SCRAP_BASE_URL = `https://github.com/users/${user.github_username}/contributions?`;

  // +1 for including the current Year as well: so Congrats!
  const totalYearOnGithub = new Date().getFullYear() - startYear + 1;
  const numberOfScraps = new Array(totalYearOnGithub).fill("");

  const scrapURLS = numberOfScraps.map(
    (item, index) =>
      `${SCRAP_BASE_URL}from=${startYear + index}-12-01&to=${startYear +
        index}-12-31`
  );

  return scrapURLS;
};

const getInfoRects = html => {
  const $ = cheerio.load(html);

  let filteredData = [];
  $("rect").each((i, elem) => {
    const count = Number(elem.attribs["data-count"]);
    const date = elem.attribs["data-date"];
    // Github is returing the data starting from sunday only so just required to take the mod
    const day = getDay(i);
    filteredData.push({ count, date, day });
  });

  return filteredData;
};

const getSvgHtml = async username => {
  const response = await fetch(
    `https://github.com/users/${username}/contributions?`
  );

  const html = await response.text();
  const $ = await cheerio.load(html);
  const result = $.html($("svg").toArray());
  return JSON.stringify(result);
};

const generateUserContributionDataset = async user => {
  const joinedYear = user.joinedYear;
  const joinedDate = user.joinedDate;

  const svghtml = await getSvgHtml(user.github_username);
  const urls = getScrapUrls(joinedYear, user);
  const responses = await Promise.all(urls.map(url => fetch(url)));
  const htmls = await Promise.all(responses.map(response => response.text()));

  const datesWithCountAndDayObj = htmls.reduce((acc, html) => {
    const arrayOfCountAndDateObjects = getInfoRects(html);
    arrayOfCountAndDateObjects.map(
      // that way duplicates will not be there in data: Data Cleaning :)
      item => (acc[item["date"]] = { count: item["count"], day: item["day"] })
    );

    return acc;
  }, {});

  // only start counting the contribution when u got the first contribution not before that
  // otherwise user have to wait for a long time for seeing the visuals movement
  // Generally users wait 2 years after creating accounts before starting the contribution journey
  let firstNonZeroDate = joinedDate;
  const keysArray = Object.keys(datesWithCountAndDayObj);
  const length = keysArray.length;
  for (let alpha = 0; alpha < length; alpha++) {
    if (datesWithCountAndDayObj[keysArray[alpha]].count > 0) {
      firstNonZeroDate = keysArray[alpha];
      break;
    }
  }

  // returing the results from joined date till today
  const filteredKeys = Object.keys(datesWithCountAndDayObj).filter(
    obj =>
      new Date(obj) >= new Date(firstNonZeroDate) && new Date(obj) <= new Date()
  );

  const dayWiseDataset = filteredKeys.reduce((acc, key) => {
    const { count, day } = datesWithCountAndDayObj[key];
    acc.push({ date: key, day, contribCount: count });
    return acc;
  }, []);

  let week_number = 0;
  let weekWiseDataset = dayWiseDataset.reduce((acc, data, i) => {
    if (i % 7 === 0) {
      week_number++;
      acc[`week-${week_number}`] = [];
    }
    acc[`week-${week_number}`].push(data);
    return acc;
  }, {});

  //  Don't return the last week or say the current week user is accesing the server
  delete weekWiseDataset[`week-${week_number}`];
  return [weekWiseDataset, svghtml];
};

module.exports = generateUserContributionDataset;
