const cors = require("cors");
const responseMiddleware = require("../middlewares/response");
const helmet = require("helmet");

module.exports = function (app, express) {
  app.use(helmet());
  app.use(responseMiddleware);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(cors());
};
