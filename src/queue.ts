import "dotenv/config";

import Queue from "./lib/Queue.js";

Queue.processQueue();

console.log("Worker iniciado");

