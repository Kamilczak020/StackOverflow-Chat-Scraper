import * as later from 'later';
import { validateConfigs } from './validation/configValidator';

// Speaking about useful comments, it runs the thing.
start();

async function start(): Promise<void> {
    // Check the configs for validity. On invalid config(s), stop script.
    const areConfigsValid = await validateConfigs();

    if (areConfigsValid === false) {
        process.abort();
    }

    // Check the process arguments, to determine if the application should start in remote or local mode.
    if (process.argv.indexOf('local') === -1) {
        scheduleTask(scrapeRemote);
    } else {
        scheduleTask(scrapeLocal);
    }
}

/**
 * Schedules a task using a schedule defined in the config.
 * If that schedule is invalid, uses a fallback schedule of:
 * "Every day at 00:30:00".
 * 
 * @param task A task to be executed on schedule
 */
function scheduleTask(task: () => void): void {
    const scheduleConfig = require('../config/scheduleconfig.json');
    const schedule = later.parse.text(scheduleConfig.schedule);
    
    // Config validator ensures that only two values are possible: either local or utc.
    if (scheduleConfig.timezone === 'local') {
        later.date.localTime();
    } else {
        later.date.UTC();
    }

    // If config value is invalid or empty, fallback to default.
    if (schedule.error === -1) {
        later.setInterval(task, schedule);
    } else {
        console.log(`Schedule given in the config is invalid - error at character index: ${schedule.error};
            Falling back to default (every day at 00:30).`);

        const fallbackSchedule = later.parse.recur().on('00:30:00').time();
        later.setInterval(task, fallbackSchedule);
    }

}

async function scrapeLocal() {
    console.log('We are using a local database');
}

async function scrapeRemote() {
    console.log('We are using a remote API');
}
