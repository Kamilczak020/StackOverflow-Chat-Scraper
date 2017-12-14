import * as jsonschema from 'jsonschema';
import * as glob from 'glob';
import * as path from 'path';

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
export async function validateConfigs(): Promise<boolean> {
    const configs = await getFilenames(pathToConfigs);
    const schemas = await getFilenames(pathToSchemas);

    return await configs.map((configName) => {
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
}

/**
 * Gets the .json files' filenames given the directory.
 * @param dir directory where to get the filenames from
 */
async function getFilenames(dir: string) {
    return new Promise<string[]>((resolve, reject) => {
        glob('*.json', {cwd: path.join(__dirname, dir)}, (err, filenames) => {
            if (err) {
                return reject(err);
            }

            return resolve(filenames);
        });
    });
}

/**
 * Gets the expected schema file name based on the file name of the config file
 * @param filename config file name
 */
function getExpectedSchemaName(filename: string): string {
    return filename.substr(0, filename.length - 5) + 'schema' + filename.substr(filename.length - 5);
}

/**
 * Given a config JSON and a schema JSON, returns true if they match, false if not.
 * @param config config file in JSON format
 * @param schema schema file in JSON format
 */
function validate(config: JSON, schema: JSON): boolean {
    const res = jsonschema.validate(config, schema);
    return res.errors.length === 0;
}

