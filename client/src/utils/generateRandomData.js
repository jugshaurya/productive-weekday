const fs = require("fs");

const firstName = [
  "Angora",
  "Satin",
  "Baft",
  "Baldachin",
  "Batiste",
  "Corduroy",
  "Crinoline",
  "Cotton",
  "Linen",
  "Thread",
  "Damask",
  "Fabric",
  "Pattern",
  "Denim",
  "blue",
  "Dungarees",
  "Flannel",
  "Wool",
  "Milled",
  "Gabardine"
];

const secondName = [
  "jacquard",
  "loom",
  "glossy",
  "rubber",
  "mohair",
  "yarn",
  "moleskin",
  "surface",
  "weave",
  "stiff",
  "organza",
  "sateen",
  "tweed",
  "fleck",
  "velvet",
  "short",
  "venise",
  "lace",
  "chiffon",
  "nylon"
];

const getName = i => {
  return firstName[i] + " " + secondName[i];
};

const getProductsWithNameAndRank = () => {
  const result = [];
  for (let i = 0; i < firstName.length; i++) {
    result.push({
      product: getName(i),
      rank: Math.round(Math.random() * 1000)
    });
  }

  return result;
};

const generateDataset = () => {
  const dataset = {};
  // Year ranges b/w 1990- 2020
  for (let i = 1990; i <= 2020; i++) {
    dataset[i] = getProductsWithNameAndRank();
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
