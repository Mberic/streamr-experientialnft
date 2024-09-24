import { StreamrClient } from '@streamr/sdk';

// Initialize the SDK with an Ethereum account
// This account will need the publish permission on this stream to publish
const streamr = new StreamrClient({
    auth: {
      privateKey: '6b6b51cf641130a23a3d06bc464871c6fb2d14fa67093282d501806ef0cf8319',
    },
    environment: 'polygonAmoy'
  });


  // Publish messages to this stream
  streamr.publish(
    "/signature-amoy",
    {
      video: 'my video stream',
    }
  );

  console.log(streamr.id);