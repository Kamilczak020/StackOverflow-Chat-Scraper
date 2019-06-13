import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import { IDatabase, IMain } from 'pg-promise';

class DatabaseContext {
    public database: IDatabase<any>;
    public pgpromise: IMain;

    constructor() {
        // Init & connection options
        const connectionJSON = require('../../../config/dbconfig.json');
        const connectionOptions = connectionJSON;
        const initOptions = {
            promiseLib: promise,
        };

        // Instantiate pg-promise with bluebird
        const pgp = pgPromise(initOptions);

        this.pgpromise = pgp;
        this.database = pgp(connectionOptions);
    }
}

const databaseContext = new DatabaseContext();
export const database = databaseContext.database;
export const pgpromise = databaseContext.pgpromise;
