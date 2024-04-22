export interface Song {
    id: string;
    name: string;
    artist: string;
    src: string;
    img: string;
    duration: number;
}

export interface QueueItem extends Song {
    queueId: string;
}