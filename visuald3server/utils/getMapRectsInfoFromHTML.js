const cheerio = require("cheerio");
const getDay = require("./getDay");
const getMapRectsInfoFromHTML = (html) => {
  const $ = cheerio.load(html);
  const filteredData = [];
  $("rect").each((i, elem) => {
    const count = Number(elem.attribs["data-count"]);
    const date = elem.attribs["data-date"];

    // Github is returing the data starting from sunday only so just required to take the mod
    const day = getDay(i);
    filteredData.push({ count, date, day });
  });

  return filteredData;
};

module.exports = getMapRectsInfoFromHTML;
