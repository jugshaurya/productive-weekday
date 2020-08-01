const fetch = require("node-fetch");

const getUserInfo = async user => {
  const userName = encodeURI(user.toLowerCase());
  const userGithubUrl = `https://api.github.com/users/${userName}`;
  const response = await fetch(userGithubUrl);

  if (response.status >= 400) {
    const error = new Error("User not found");
    error.status = response.status;
    throw error;
  }

  const result = await response.json();
  const {avatar_url, name, login, created_at} = result;

  return {
    avatar_url,
    name,
    github_username: login,
    // return only the year ex: 2018-06-01T08:50:23Z
    joinedYear: created_at.split("-")[0],
    joinedDate: created_at.split("T")[0]
  };
};

module.exports = getUserInfo;
