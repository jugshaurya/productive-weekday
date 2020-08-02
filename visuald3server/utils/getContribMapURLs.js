/*
 * @params user -> {joinedYear , username}
 * @return urls
 */

const getContribMapURLs = ({ joinedYear, username }) => {
  const SCRAP_BASE_URL = `https://github.com/users/${username}/contributions?`;
  const startYear = Number(joinedYear);

  // +1 for including the current Year as well: so Congrats!
  const totalYearOnGithub = new Date().getFullYear() - startYear + 1;
  const numberOfMaps = new Array(totalYearOnGithub).fill("");

  const mapURLs = numberOfMaps.map(
    (item, index) =>
      `${SCRAP_BASE_URL}from=${startYear + index}-12-01&to=${
        startYear + index
      }-12-31`
  );

  return mapURLs;
};

module.exports = getContribMapURLs;
