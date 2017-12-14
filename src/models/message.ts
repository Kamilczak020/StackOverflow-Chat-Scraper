/**
 * Describes the structure of a chat message object.
 */
export interface Message {
    message_id: number;
    user_id: number;
    username: string;
    response_id: number;
    room_id: number;
    message_body: string;
    timestamp: string;
    stars: number;
}
