import Bee from "bee-queue";
import redisConfig from "../config/redis.js";
import "dotenv/config";

import WelcomeEmailJob from "../app/jobs/WelcomeEmailJob.js";
import ResetPasswordJob from "../app/jobs/ResetPasswordJob.js";
import SaveLeituraJob from "../app/jobs/SaveLeituraJob.js";
import NotificarProprietarioJob from "../app/jobs/NotificarProprietarioJob.js";
import WelcomeToBackJob from "../app/jobs/WelcomeToBackJob.js";
import ConfirmarEmailJob from "../app/jobs/ConfirmarEmailJob.js";
import NovoUsuarioAdminJob from "../app/jobs/NovoUsuarioAdminJob.js";

const jobs = [
  WelcomeEmailJob,
  WelcomeToBackJob,
  SaveLeituraJob,
  ResetPasswordJob,
  NotificarProprietarioJob,
  ConfirmarEmailJob,
  NovoUsuarioAdminJob,
];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on("failed", this.handleFailure).process(handle);
    });
  }

  handleFailure(job: any, err: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Queue ${job.queue.name}: FAILED`, err);
    }
  }
}

export default new Queue();
