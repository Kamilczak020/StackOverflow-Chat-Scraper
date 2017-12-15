import * as Queue from 'bull';

export function startLocal(): void {
    // Queues will handle polling the api for new scrape orders and scraping and uploading to db.
    const pollQueue = new Queue('database polling');
    const scrapeQueue = new Queue('transcript scraping');
    const uploadQueue = new Queue('data uploading');

    
    
}
