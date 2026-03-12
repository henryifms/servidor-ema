import "dotenv/config";

import Queue from "./lib/Queue.js";
import "./database/index.js";

Queue.processQueue();

console.log("Worker iniciado");

