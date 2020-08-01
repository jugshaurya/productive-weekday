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
  "https://productive-weekday.netlify.app",
  "https://shaurya.now.sh", // for portfolio app!
  "http://localhost:3000",
];

if (process.env.NODE_ENV !== "production")
  whitelist.push("http://localhost:3000");
console.log(whitelist, process.env.NODE_ENV);

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

// Utils function
const getUserInfo = require("./api/getUserInfo");
const getUserContribDataset = require("./api/getUserContribDataset");
const getUserContribSvg = require("./api/getUserContribSvg");
const getGithubActivityOverview = require("./api/getGithubActivityOverview");

app.get("/user/:user", async (req, res, next) => {
  try {
    const { user } = req.params;
    const { requireSvg, requireMore } = req.query;
    console.log(req.query);
    // fetch the user created year, name, avatar_url, dates
    const userInfo = await getUserInfo(user);

    if (!(requireSvg === "true") && !(requireMore === "true")) {
      // case 1: return only the dataset
      try {
        const dataset = await getUserContribDataset(userInfo);
        return res.status(200).json({ userInfo, dataset: dataset || {} });
      } catch (error) {
        next(error);
      }
    }
    if (!(requireMore === "true")) {
      // case 2 : return only the contrib-svg
      try {
        res.setHeader("Content-Type", "image/svg+xml");
        const svgData = await getUserContribSvg(userInfo);
        console.log(svgData);
        return res.status(200).send(`${svgData}`);
      } catch (error) {
        next(error);
      }
    }

    console.log("ok");
    // case 3: return more({commits, issue, pr} percentages + contriubtion's organizations + Activity-overview).
    try {
      const data = await getGithubActivityOverview(userInfo);
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
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
      message: error.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
