"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require("bull");
function startLocal() {
    // Queues will handle polling the api for new scrape orders and scraping and uploading to db.
    const pollQueue = new Queue('database polling');
    const scrapeQueue = new Queue('transcript scraping');
    const uploadQueue = new Queue('data uploading');
}
exports.startLocal = startLocal;
