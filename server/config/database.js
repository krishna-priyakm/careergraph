const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USERNAME,
    process.env.COGNODB_PASSWORD
  )
);

const connectDatabase = async () => {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Connected to CognoDB successfully");
  } catch (error) {
    console.error("❌ CognoDB connection failed:", error.message);
  }
};

module.exports = {
  driver,
  connectDatabase,
};