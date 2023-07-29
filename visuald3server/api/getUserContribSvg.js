const fetch = require("node-fetch");
const cheerio = require("cheerio");

const getUserContribSvg = async ({ username }) => {
  const response = await fetch(
    `https://github.com/users/${username}/contributions?`
  );

  const html = await response.text();
  const $ = await cheerio.load(html);
  
  const content = $(`<?xml version="1.0" standalone="yes"?>
  <svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject x="10" y="10" width="100" height="150">
      <body xmlns="http://www.w3.org/1999/xhtml">
        ${$.html($("table.js-calendar-graph-table"))}
      </body>
    </foreignObject>
  </svg>`);

  const result =$.html(content.toArray());
  // const result = $.html($("svg.js-calendar-graph-svg").toArray());
  return result;
};

module.exports = getUserContribSvg;
