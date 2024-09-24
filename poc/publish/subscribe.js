import { StreamrClient } from '@streamr/sdk';

const streamr = new StreamrClient({
    environment: 'polygonAmoy'
})

// Subscribe to a stream of messages
streamr.subscribe('0x5dbef432d012c8d20993214f2c3765e9cf83d180/signature-amoy', (msg) => {
    // Handle incoming messages
    console.log(msg);
})