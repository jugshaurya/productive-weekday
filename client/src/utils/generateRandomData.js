const fs = require("fs");

const getRandomCount = () => {
  return Math.round(Math.random() * 10);
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

const START_DATE = new Date();
const getDate = i => {
  const date = new Date(new Date().setDate(START_DATE.getDate() + i - 70));

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const getDatewithObj = i => {
  const result = {};
  result["date"] = getDate(i);
  result["day"] = getDay(i);
  result["contribCount"] = getRandomCount();
  return result;
};

const getWeekArray = i => {
  const result = [];
  for (let j = 0; j < 7; j++) {
    result.push(getDatewithObj(i * 7 + j));
  }
  return result;
};

const generateDataset = () => {
  const dataset = {};

  for (let i = 0; i < 10; i++) {
    dataset[`week-${i + 1}`] = getWeekArray(i);
  }

  return dataset;
};

const generateRandomUser = () => {
  return {
    avatar_url: null,
    name: null,
    github_username: null,
    joinedYear: "2019",
    joinedDate: "2019-06-01"
  };
};

const DATASET = {
  dataset: generateDataset(),
  userInfo: generateRandomUser()
};

console.log(DATASET);

const util = require("util");
// https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
fs.writeFile(
  "src/assets/dataset.js",
  "const DATASET = " +
    util.inspect(DATASET, false, null) +
    "\nexport default DATASET",
  "utf-8",
  err => {
    console.log(err);
  }
);
