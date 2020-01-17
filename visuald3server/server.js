const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compress = require("compression");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));

app.use(cors());
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
    const userInfo = await getUserInfo(user, next);

    // 2. Generate User Dataset
    const dataset = await generateUserContributionDataset(userInfo, next);
    res.status(200).json({ userInfo, dataset: dataset || {} });
  } catch (error) {
    next(error);
  }
});

// Handling unwanted routes
app.use((req, res, next) => {
  const error = new Error("Invalid Route man!");
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
