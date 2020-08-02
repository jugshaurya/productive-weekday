const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compress = require("compression");
const morgan = require("morgan");
const app = express();

// Utils function
const getUserInfo = require("./api/getUserInfo");
const getUserContribDataset = require("./api/getUserContribDataset");
const getUserContribSvg = require("./api/getUserContribSvg");

// Uncomment it out if in development mode
// app.use(morgan("tiny"));
var whitelist = [
  "https://productive-weekday.netlify.com",
  "https://productive-weekday.netlify.app",
  "https://shaurya.old.now.sh", // for old react based portfolio app!
  "https://shaurya.now.sh", // for new gatsby-portfolio app!
  "http://localhost:3000", // for react apps
  "http://localhost:8000", // for gatsby app
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// app.use(cors(corsOptions));
app.use(helmet());
app.use(compress());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/user/:user", async (req, res, next) => {
  const { user } = req.params;
  const { requireSvg } = req.query;

  // fetch the user created year, name, avatar_url, dates
  const userInfo = await getUserInfo(user);

  if (requireSvg === "true") {
    // case: return only the contrib-svg
    try {
      res.setHeader("Content-Type", "image/svg+xml");
      const svgData = await getUserContribSvg(userInfo);
      return res.status(200).send(`${svgData}`);
    } catch (error) {
      next(error);
    }
  } else {
    // case: return only the dataset
    try {
      const dataset = await getUserContribDataset(userInfo);
      return res.status(200).json({ userInfo, dataset: dataset || {} });
    } catch (error) {
      next(error);
    }
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
      message: error.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
