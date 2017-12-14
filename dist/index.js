"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const later = require("later");
const configValidator_1 = require("./validation/configValidator");
// Speaking about useful comments, it runs the thing.
start();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the configs for validity. On invalid config(s), stop script.
        const areConfigsValid = yield configValidator_1.validateConfigs();
        if (areConfigsValid === false) {
            process.abort();
        }
        // Check the process arguments, to determine if the application should start in remote or local mode.
        if (process.argv.indexOf('local') === -1) {
            scheduleTask(scrapeRemote);
        }
        else {
            scheduleTask(scrapeLocal);
        }
    });
}
/**
 * Schedules a task using a schedule defined in the config.
 * If that schedule is invalid, uses a fallback schedule of:
 * "Every day at 00:30:00".
 *
 * @param task A task to be executed on schedule
 */
function scheduleTask(task) {
    const scheduleConfig = require('../config/scheduleconfig.json');
    const schedule = later.parse.text(scheduleConfig.schedule);
    // Config validator ensures that only two values are possible: either local or utc.
    if (scheduleConfig.timezone === 'local') {
        later.date.localTime();
    }
    else {
        later.date.UTC();
    }
    // If config value is invalid or empty, fallback to default.
    if (schedule.error === -1) {
        later.setInterval(task, schedule);
    }
    else {
        console.log(`Schedule given in the config is invalid - error at character index: ${schedule.error};
            Falling back to default (every day at 00:30).`);
        const fallbackSchedule = later.parse.recur().on('00:30:00').time();
        later.setInterval(task, fallbackSchedule);
    }
}
function scrapeLocal() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('We are using a local database');
    });
}
function scrapeRemote() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('We are using a remote API');
    });
}
