const path = require("path");
module.exports = async () =>
  require("dotenv").config({
    path: `${path.parse(__dirname).dir}/config/.env.test`,
  });
