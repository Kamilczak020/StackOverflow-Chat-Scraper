import * as later from 'later';
import { validateConfigs } from './validation/configValidator';
import { startLocal } from './local';
import { startRemote } from './remote';

// Speaking about useful comments, it runs the thing.
start();

async function start(): Promise<void> {
    // Check the configs for validity. On invalid config(s), stop script.
    const areConfigsValid = await validateConfigs();

    if (areConfigsValid === false) {
        process.abort();
    }

    // Check the process arguments and config, to determine if the application should start in remote or local mode.
    const baseConfig = require('../config/baseconfig.json');
    let mode = baseConfig.mode;

    // If someone passes both local and remote as arguments, log error and quit.
    if (process.argv.indexOf('-local') !== -1 && process.argv.indexOf('-remote') !== -1) {
        console.log('Dude, decide. The program cannot work both locally and remotely.');
        process.abort();
    }

    // Process agruments take precendence over configs.
    if (process.argv.indexOf('-local') !== -1) {
        mode = 'local';
    }

    if (process.argv.indexOf('-remote') !== -1) {
        mode = 'remote';
    }

    // We already made sure that either local or remote is always present.
    if (mode === 'local') {
        startLocal();
    } else {
        startRemote();
    }
}
