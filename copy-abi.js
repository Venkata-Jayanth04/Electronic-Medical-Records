const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "build/contracts/HealthSystem.json");
const dest = path.join(__dirname, "client/src/utils/HealthSystem.json");

fs.copyFileSync(src, dest);
console.log("✅ ABI copied to frontend: client/src/utils/HealthSystem.json");
