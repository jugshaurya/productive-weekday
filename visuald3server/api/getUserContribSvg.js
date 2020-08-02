const fetch = require("node-fetch");
const cheerio = require("cheerio");

const getUserContribSvg = async ({ username }) => {
  const response = await fetch(
    `https://github.com/users/${username}/contributions?`
  );

  const html = await response.text();
  const $ = await cheerio.load(html);
  const result = $.html($("svg.js-calendar-graph-svg").toArray());
  return result;
};

module.exports = getUserContribSvg;
