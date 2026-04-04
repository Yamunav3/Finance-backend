const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

const startServer = async () => {
  try {
    await connectDb(env.mongoUri);
    app.listen(env.port, () => {
      // Keep startup logs explicit for local debugging.
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
