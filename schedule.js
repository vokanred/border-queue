import { scheduleJob } from "node-schedule";


export const schedule = (callback) => {
  scheduleJob(EVERY_MINUTE, callback);
};
