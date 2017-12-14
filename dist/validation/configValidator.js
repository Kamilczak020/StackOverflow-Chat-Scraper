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
const jsonschema = require("jsonschema");
const glob = require("glob");
const path = require("path");
/**
 * By default, configs are located in root/config and schemas are located in root/validation/schemas.
 * If you were to change these, update below paths accordingly.
 * Below paths are local to the script location.
 */
const pathToConfigs = '../../config';
const pathToSchemas = './schemas';
/**
 * Checks if configs are valid, by finding schemas for them and comparing the two.
 * If a schema for a config is not provided, assumes valid.
 */
function validateConfigs() {
    return __awaiter(this, void 0, void 0, function* () {
        const configs = yield getFilenames(pathToConfigs);
        const schemas = yield getFilenames(pathToSchemas);
        return yield configs.map((configName) => {
            const expectedSchemaName = getExpectedSchemaName(configName);
            const schemaIndex = schemas.indexOf(expectedSchemaName);
            // Compare schema name to config name
            if (schemaIndex !== undefined) {
                const config = require(pathToConfigs + '/' + configName);
                const schema = require(pathToSchemas + '/' + schemas[schemaIndex]);
                const result = validate(config, schema);
                if (result === false) {
                    console.log(configName + ' does not match its\' schema.');
                }
                return result;
            }
            console.log('Schema for ' + configName + ' was not found; Assuming valid.');
            return true;
        })
            .reduce((stack, current) => stack && current);
    });
}
exports.validateConfigs = validateConfigs;
/**
 * Gets the .json files' filenames given the directory.
 * @param dir directory where to get the filenames from
 */
function getFilenames(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            glob('*.json', { cwd: path.join(__dirname, dir) }, (err, filenames) => {
                if (err) {
                    return reject(err);
                }
                return resolve(filenames);
            });
        });
    });
}
/**
 * Gets the expected schema file name based on the file name of the config file
 * @param filename config file name
 */
function getExpectedSchemaName(filename) {
    return filename.substr(0, filename.length - 5) + 'schema' + filename.substr(filename.length - 5);
}
/**
 * Given a config JSON and a schema JSON, returns true if they match, false if not.
 * @param config config file in JSON format
 * @param schema schema file in JSON format
 */
function validate(config, schema) {
    const res = jsonschema.validate(config, schema);
    return res.errors.length === 0;
}
