import { createClient } from "redis";
import redisConfig from "../config/redis.js";

const redis = createClient({
  socket: {
    host: redisConfig.host,
    port: Number(redisConfig.port),
  },
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

await redis.connect();

export default redis;
