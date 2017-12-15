import * as Queue from 'bull';

export function startRemote(): void {
    // Queues will handle polling the api for new scrape orders and scraping and uploading to db.
    const pollQueue = new Queue('api polling');
    const scrapeQueue = new Queue('transcript scraping');
    
    
}
