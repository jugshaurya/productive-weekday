const fs = require("fs");

const getRandomCount = () => {
  return Math.round(Math.random() * 100);
};

const getDay = i => {
  const day = i % 7;
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thur";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
  }
};

const START_DATE = new Date("2018-06-01");
const getDate = i => {
  const date = new Date(new Date().setDate(START_DATE.getDate() + i));

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const getDatewithObj = i => {
  const result = {};
  result["date"] = getDate(i);
  result["day"] = getDay(i);
  result["count"] = getRandomCount();
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

const DATASET = generateDataset();
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
