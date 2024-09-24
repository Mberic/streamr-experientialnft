import { StreamrClient } from '@streamr/sdk';

const privateKey = process.env.PRIVATE_KEY;

const streamr = new StreamrClient({
  auth: {
    privateKey: privateKey, // Make sure this is securely handled in production
  },
  environment: 'polygonAmoy'
});

async function startVideoStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.getElementById('videoElement');
    videoElement.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(2000);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        convertToBase64(event.data);
      }
    };

  } catch (error) {
    console.error('Error accessing webcam: ', error);
  }
}

function convertToBase64(blob) {
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result.split(',')[1];

    streamr.publish(
      "/signature-amoy",
      { base64String }
    );

    displayBase64Data(base64String);
  };
  reader.readAsDataURL(blob);
}

function displayBase64Data(base64Data) {
  const chunksContainer = document.getElementById('chunksContainer');
  const base64Text = document.createElement('p');
  base64Text.textContent = base64Data;
  chunksContainer.appendChild(base64Text);
}

window.onload = startVideoStream;
