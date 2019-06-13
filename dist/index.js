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
const moment = require("moment");
const configValidator_1 = require("./validation/configValidator");
const local_1 = require("./local");
const remote_1 = require("./remote");
// Speaking about useful comments, it runs the thing.
start();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the configs for validity. On invalid config(s), stop script.
        const areConfigsValid = yield configValidator_1.validateConfigs();
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
            const startDate = moment('2010-10-15', 'YYYY-MM-DD');
            local_1.startLocal(startDate);
        }
        else {
            remote_1.startRemote();
        }
    });
}
