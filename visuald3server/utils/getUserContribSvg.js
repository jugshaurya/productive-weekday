const fetch = require("node-fetch");

const getUserContribSvg = (user) => {
  const response = await fetch(`https://github.com/users/${username}/contributions?`);
    
    const html = await response.text();
    const $ = await cheerio.load(html);
    const result = $.html($("svg").toArray());
      return JSON.stringify(result);

};

module.exports = getUserContribSvg;
