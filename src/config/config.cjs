const { config } = require("dotenv");

config();
// const { DB_URL } = process.env;

module.exports = {
  "development": {
    use_env_variable: "DB_URL",
    dialect: "postgres",
  },
  "production": {
    use_env_variable: "DB_URL",
    dialect: "postgres",
  },
};
