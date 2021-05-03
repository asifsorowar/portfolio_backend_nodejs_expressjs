const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "./log/logfile.log",
      level: "error",
    }),
    new winston.transports.MongoDB({
      db: process.env.DB,
      level: "info",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./log/uncaughtExceptions.log" }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex;
});

module.exports = logger;
