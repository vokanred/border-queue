import { scheduleJob } from "node-schedule";
import { getCarStatus, getQueue } from "./queue.js";

const EVERY_MINUTE = "0 * * * * *";

export class Monitoring {
  #callbacks = new Map();
  #statuses = new Map();

  schedule() {
    scheduleJob(EVERY_MINUTE, () => {
      this.once();
    });
  }

  async once() {
    if (!this.#callbacks.size) {
      return;
    }

    const queue = await getQueue();

    Array.from(this.#callbacks.entries()).forEach(
      ([regNumber, callback]) => {
        const status = getCarStatus(queue, regNumber);
        const prevStatus = this.#statuses.get(regNumber);

        if (prevStatus && status !== prevStatus) {
          callback(status);
        }

        this.#statuses.set(regNumber, status);
      }
    );
  }

  watch(regNumber, callback) {
    this.#callbacks.set(regNumber, callback);
  }
}
