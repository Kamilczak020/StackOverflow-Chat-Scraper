import * as request from 'request';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { Message } from '../models';

const transcriptBaseUrl = 'https://chat.stackoverflow.com/transcript';

/**
 * Scrapes the transcript, extracting every valid message.
 * 
 * @param roomId Id of the room to scrape
 * @param date Date of the transcript page to scrape. Only takes into account Day, Month and Year
 * @param callback The callback
 * @returns An array of Message objects
 */
export function scrapeTranscript(room_id: number, date: moment.Moment): Promise<Message[]> {
    const timestamp = date.format('YYYY-MM-DD');
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');
    let messages: Message[] = [];

    const url = `${transcriptBaseUrl}/${room_id}/${year}/${month}/${day}/0-24`;
   
    return new Promise<Message[]>((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) {
                return reject(err.Message);
            }

            const $ = cheerio.load(body);
            const monologueElements = $('div.monologue');

            // Each monologue block is a group of messages by one user. It contains user info and message objects.
            monologueElements.each((monologueIndex, monologueElement) => {
                const user_id = getUserId(monologueElement, $);
                const username = getUsername(monologueElement, $);
                const messageElements = $(monologueElement).find('div.message');

                // Each single message contains *only* message-specific information.
                messageElements.each((messageIndex, messageElement) => {
                    const message_id = getMessageId(messageElement, $);
                    const message_body = getMessageText(messageElement, $);
                    const stars = getStars(messageElement, $);

                    // Optional parameter (not all messages are responses)
                    const response_id = getResponseId(messageElement, $);

                    // If message text is not undefined (meaning that it is not a oneboxed message), push it to model
                    if (message_body !== undefined) {
                        const message: Message =  { 
                            message_id,
                            user_id,
                            username,
                            response_id,
                            room_id,
                            message_body,
                            timestamp,
                            stars,
                        };

                        messages.push(message);
                    }
                });
            });
            // Return sucessful with results
            return resolve(messages);
        });
    });
}

// Extracts user id from classname
function getUserId(monologueElement: CheerioElement, $: CheerioStatic): number {
    const userIdClass = $(monologueElement).attr('class');
    const userId = parseInt(userIdClass.split('-')[1], 10);

    if (isNaN(userId)) {
        return 69;
    }
    return userId;
}

function getUsername(monologueElement: CheerioElement, $: CheerioStatic): string {
    const username = $(monologueElement).find('div.username').children('a');

    if (username.attr('title') !== null && username.attr('title') !== '' &&
        username.attr('title') !== undefined) {
        return username.attr('title');
    } else {
        return 'Deleted user';
    }
}

// Extracts message id from classname
function getMessageId(messageElement: CheerioElement, $: CheerioStatic): number {
    const messageIdClass = $(messageElement).attr('id');
    const messageId = messageIdClass.split('-')[1];
    return parseInt(messageId, 10);
}

// Extracts message text from the content div.
function getMessageText(messageElement: CheerioElement, $: CheerioStatic) {
    const content = $(messageElement).children('div.content');
    
    // In case of onebox messages, return undefined.
    if ($(content).children().is('div.onebox') || $(content).children().is('div.room-mini')) {
        return 'this was a onebox message. I dont handle these as I dont care. Cheerio.';
    } else {
        return content.contents().text().trim();
    }
}

// Extracts response id from classname. Messages that arent a response, stay null.
function getResponseId(messageElement: CheerioElement, $: CheerioStatic): number {
    if ( $(messageElement).children().is('a.reply-info')) {
        const responseIdClass = $(messageElement).children('a.reply-info').attr('href');
        const responseId = responseIdClass.split('#')[1];
        const parsed = parseInt(responseId, 10);
        if (isNaN(parsed)) {
            return null;
        } 

        return parsed;
    } else {
        return null;
    }
}

// Extracts stars count from classname. For messages without stars returns 0.
function getStars(messageElement: CheerioElement, $: CheerioStatic): number {
    if ( $(messageElement).children('span.flash').children().is('span.stars')) {
        const starsElement = $(messageElement).find('span.stars').children('span.times');
        const stars = starsElement.first().text();
        return stars === '' ? 1 : parseInt(stars, 10); 
    } else {
        return 0;
    }
}
