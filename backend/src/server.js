import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initDb, sequelize } from "./config/db.js";
import "./models/User.js";
import "./models/Role.js";
import "./models/UserRole.js";
import "./models/OtpToken.js";
import "./models/Resume.js";
import "./models/ResumeAnalysis.js";

async function start() {
  try {
    await initDb();
    await sequelize.sync();

    const app = createApp();
    app.listen(env.port, () => {
      process.stdout.write(`Backend listening on port ${env.port}\n`);
    });
  } catch (err) {
    process.stderr.write(`Failed to start backend: ${err.message}\n`);
    process.exit(1);
  }
}

start();
