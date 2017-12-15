-- tables
-- Table: messages
CREATE TABLE messages (
    message_id bigint  NOT NULL,
    response_id bigint  NULL,
    room_id bigint  NOT NULL,
    user_id bigint  NOT NULL,
    body text  NOT NULL,
    date date  NOT NULL,
    stars int  NOT NULL,
    CONSTRAINT messages_pk PRIMARY KEY (message_id)
);

-- Table: rooms
CREATE TABLE rooms (
    room_id bigint  NOT NULL,
    room_name varchar(300)  NOT NULL,
    CONSTRAINT rooms_pk PRIMARY KEY (room_id)
);

-- Table: scrape_orders
CREATE TABLE scrape_orders (
    order_id int  NOT NULL,
    room_id bigint  NOT NULL,
    api_username varchar(50)  NOT NULL,
    order_type varchar(30)  NOT NULL,
    start_date date  NULL,
    end_date date  NULL,
    CONSTRAINT scrape_orders_pk PRIMARY KEY (order_id)
);

-- Table: users
CREATE TABLE users (
    user_id bigint  NOT NULL,
    username varchar(50)  NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (user_id)
);

-- foreign keys
-- Reference: messages_rooms (table: messages)
ALTER TABLE messages ADD CONSTRAINT messages_rooms
    FOREIGN KEY (room_id)
    REFERENCES rooms (room_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: messages_users (table: messages)
ALTER TABLE messages ADD CONSTRAINT messages_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: rooms_scrape_orders (table: scrape_orders)
ALTER TABLE scrape_orders ADD CONSTRAINT rooms_scrape_orders
    FOREIGN KEY (room_id)
    REFERENCES rooms (room_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

