const cheerio = require("cheerio");
const getDay = require("./getDay");
const getMapRectsInfoFromHTML = (html) => {
  const $ = cheerio.load(html);
  const data = [];

  $("td.ContributionCalendar-day").each((i, elem) => {
      const hoverText = $(elem).find('span').text();
      const initialTwo = hoverText.slice(0, 2);

      const count = initialTwo==="No" ? 0 : initialTwo[1]===" " ? +initialTwo[0]: +initialTwo;
      const date = elem.attribs["data-date"];
      
      data.push({ count, date, day: getDay(date) });
  });

  return data;
};

module.exports = getMapRectsInfoFromHTML;
