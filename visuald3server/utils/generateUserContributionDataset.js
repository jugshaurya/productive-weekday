const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getScrapUrls = joinedYear => {
  const startYear = Number(joinedYear);
  const SCRAP_BASE_URL = `https://github.com/users/jugshaurya/contributions?`;

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

const getInfoRects = html => {
  const $ = cheerio.load(html);

  let filteredData = [];
  $("rect").each((i, elem) => {
    const count = elem.attribs["data-count"];
    const date = elem.attribs["data-date"];
    // Github is returing the data starting from sunday only so just required to take the mod
    const day = getDay(i);
    filteredData.push({ count, date, day });
  });

  return filteredData;
};

const generateUserContributionDataset = async user => {
  const joinedYear = user.joinedYear;
  const joinedDate = user.joinedDate;
  const urls = getScrapUrls(joinedYear);
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

  // returing the results from joined date till today
  const filteredKeys = Object.keys(datesWithCountAndDayObj).filter(
    obj => new Date(obj) >= new Date(joinedDate) && new Date(obj) <= new Date()
  );

  const dataset = filteredKeys.reduce((acc, key) => {
    const { count, day } = datesWithCountAndDayObj[key];
    acc.push({ date: key, day, contribCount: count });
    return acc;
  }, []);

  return dataset;
};

module.exports = generateUserContributionDataset;
