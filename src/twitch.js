const tmi = require('tmi.js');
let params = new URLSearchParams(location.search);

export default class TwitchClient {
    constructor() {
        this.options = {
            connection: {
                secure: true,
                reconnect: true
            },
            channels: [params.get('canal')]
        };
        this.client = new tmi.Client(this.options);
    }

    connect() {
        this.client.connect();
    }

    onMessage(callback) {
        this.client.on('message', callback);
    }
}