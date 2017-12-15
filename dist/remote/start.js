"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require("bull");
function startRemote() {
    // Queues will handle polling the api for new scrape orders and scraping and uploading to db.
    const pollQueue = new Queue('api polling');
    const scrapeQueue = new Queue('transcript scraping');
}
exports.startRemote = startRemote;
