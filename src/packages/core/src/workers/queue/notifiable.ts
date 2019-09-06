import { QueueRequest } from "./request";


export interface Notifiable<T> {
    send(message: QueueRequest<T>);
}
