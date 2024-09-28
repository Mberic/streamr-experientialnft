const apiKey = 'YmJhOTAxNGRmYjJkNDk1YWEzMmQxZTBlZmM4YTM5M2I';
const streamId = encodeURIComponent('0x5dbef432d012c8d20993214f2c3765e9cf83d180/signature-amoy');

// Connect to the WebSocket plugin on your Streamr node
const pub = new WebSocket(`wss://adjusted-bass-scarcely.ngrok-free.app/streams/${streamId}/publish?apiKey=${apiKey}`);

let isWebSocketOpen = false;

pub.onopen = function () {
    console.log('Connected to the WebSocket');
    isWebSocketOpen = true;
};

pub.onerror = function (err) {
    console.error('WebSocket error:', err);
};

pub.onclose = function () {
    console.log('WebSocket connection closed');
    isWebSocketOpen = false;
};

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

        if (isWebSocketOpen) {
            pub.send(JSON.stringify({ video: base64String }));
        } else {
            console.error('WebSocket is not open. Cannot send data.');
        }
    };
    reader.readAsDataURL(blob);
}
window.onload = startVideoStream;
