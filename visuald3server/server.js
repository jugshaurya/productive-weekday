const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compress = require("compression");
const morgan = require("morgan");
const app = express();

// Uncomment it out if in development mode
// app.use(morgan("tiny"));
var whitelist = [
  "https://productive-weekday.netlify.com",
  "http://localhost:3000"
];

var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(compress());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Utils function
const getUserInfo = require("./utils/getuserInfo");
const generateUserContributionDataset = require("./utils/generateUserContributionDataset");

app.get("/user/:user", async (req, res, next) => {
  try {
    // 1. fetch the user created year, name, avatar_url
    const { user } = req.params;
    // console.log(user);
    const userInfo = await getUserInfo(user);

    // 2. Generate User Dataset
    const dataset = await generateUserContributionDataset(userInfo);
    res.status(200).json({ userInfo, dataset: dataset || {} });
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Productive-weekday-server" });
});

// Handling unwanted routes
app.use((req, res, next) => {
  const error = new Error("Page not Found, Route Invalid");
  error.status = 404;
  next(error);
});

// error middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  const status = error.status || 500;
  res.status(status);
  res.send({
    error: {
      status: status,
      message: error.message || "Internal Server Error"
    }
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
