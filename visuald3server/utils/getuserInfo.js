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

  return {
    avatar_url: result.avatar_url,
    name: result.name,
    github_username: result.login,
    // return only the year ex: 2018-06-01T08:50:23Z
    joinedYear: result.created_at.split("-")[0],
    joinedDate: result.created_at.split("T")[0]
  };
};

module.exports = getUserInfo;
