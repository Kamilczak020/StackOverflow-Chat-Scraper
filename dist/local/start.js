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
const dbContext_1 = require("./queries/dbContext");
const scraper_1 = require("../scraper");
function startLocal(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const endDate = moment('2018-04-08', 'YYYY-MM-DD');
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        if (date === endDate) {
            console.log('success');
            return;
        }
        const scrapeData = yield scraper_1.scrapeTranscript(17, date);
        const roomsQueries = getRoomsQueries(scrapeData);
        const usersQueries = getUsersQueries(scrapeData);
        const roomsUsersQueries = getRoomsUsersQueries(scrapeData);
        const messagesQueries = getMessagesQueries(scrapeData);
        // Execute promises
        yield Promise.all(getPromises(roomsQueries))
            .then(() => Promise.all(getPromises(usersQueries)))
            .then(() => Promise.all(getPromises(roomsUsersQueries)))
            .then(() => Promise.all(getPromises(messagesQueries)))
            .catch(err => {
            console.log(err);
        });
        console.log(`Done for: ${date}`);
        yield delay(10000);
        startLocal(date.add('days', 1));
    });
}
exports.startLocal = startLocal;
// Promises
function getPromises(queries) {
    const promises = queries.map((query) => {
        return dbContext_1.database.none(query);
    });
    return promises;
}
// Queries for promises
function getUsersQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO users(
                user_id, 
                name) 
            VALUES($1, $2) 
            ON CONFLICT(user_id) 
            DO UPDATE SET name = $2`, [msg.user_id, msg.username]);
        queries.push(query);
    });
    return queries;
}
function getRoomsQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO rooms(room_id) 
            VALUES($1) 
            ON CONFLICT(room_id) 
            DO NOTHING`, [msg.room_id]);
        queries.push(query);
    });
    return queries;
}
function getRoomsUsersQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO roomsusers(
                room_id, 
                user_id) 
            VALUES($1, $2) 
            ON CONFLICT(
                room_id, 
                user_id) 
            DO NOTHING`, [msg.room_id,
            msg.user_id]);
        queries.push(query);
    });
    return queries;
}
function getMessagesQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO messages(
                message_id, 
                user_id, 
                room_id, 
                response_id, 
                body, 
                date, 
                stars) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT(message_id) 
            DO NOTHING`, [msg.message_id,
            msg.user_id,
            msg.room_id,
            msg.response_id,
            msg.message_body,
            msg.timestamp,
            msg.stars]);
        queries.push(query);
    });
    return queries;
}
