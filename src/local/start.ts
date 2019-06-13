import * as moment from 'moment';
import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import { pgpromise as pgp, database as db } from './queries/dbContext';
import { scrapeTranscript } from '../scraper';
import { Message } from '../models';

export async function startLocal(date?: moment.Moment) {
    const endDate = moment('2018-04-08', 'YYYY-MM-DD');
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    if (date === endDate) {
        console.log('success');
        return;
    }

    const scrapeData = await scrapeTranscript(17, date);
    const roomsQueries = getRoomsQueries(scrapeData);
    const usersQueries = getUsersQueries(scrapeData);
    const roomsUsersQueries = getRoomsUsersQueries(scrapeData);
    const messagesQueries = getMessagesQueries(scrapeData);

     // Execute promises
     await Promise.all(getPromises(roomsQueries))
     .then(() => Promise.all(getPromises(usersQueries)))
     .then(() => Promise.all(getPromises(roomsUsersQueries)))
     .then(() => Promise.all(getPromises(messagesQueries)))
     .catch(err => {
         console.log(err);
     });
    
    console.log(`Done for: ${date}`);
    
    await delay(10000);
    startLocal(date.add('days', 1));
}

// Promises
function getPromises(queries: pgPromise.ParameterizedQuery[]): Promise<null>[] {
    const promises = queries.map((query) => {
        return db.none(query);
    });
    
    return promises;
}

// Queries for promises
function getUsersQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO users(
                user_id, 
                name) 
            VALUES($1, $2) 
            ON CONFLICT(user_id) 
            DO UPDATE SET name = $2`, 
            [msg.user_id, msg.username]);
        
        queries.push(query);
    });
    return queries;
}

function getRoomsQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO rooms(room_id) 
            VALUES($1) 
            ON CONFLICT(room_id) 
            DO NOTHING`,
            [msg.room_id]);

        queries.push(query);
    });
    return queries;
}

function getRoomsUsersQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO roomsusers(
                room_id, 
                user_id) 
            VALUES($1, $2) 
            ON CONFLICT(
                room_id, 
                user_id) 
            DO NOTHING`,
            [msg.room_id,
            msg.user_id]);

        queries.push(query);
    });
    return queries;
}

function getMessagesQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO messages(
                message_id, 
                user_id, 
                room_id, 
                response_id, 
                body, 
                date, 
                stars) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT(message_id) 
            DO NOTHING`,
            [msg.message_id, 
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
