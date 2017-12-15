-- foreign keys
ALTER TABLE messages
    DROP CONSTRAINT messages_rooms;

ALTER TABLE messages
    DROP CONSTRAINT messages_users;

ALTER TABLE scrape_orders
    DROP CONSTRAINT rooms_scrape_orders;

-- tables
DROP TABLE messages;

DROP TABLE rooms;

DROP TABLE scrape_orders;

DROP TABLE users;

-- End of file.

