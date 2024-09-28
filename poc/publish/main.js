const apiKey = 'YmJhOTAxNGRmYjJkNDk1YWEzMmQxZTBlZmM4YTM5M2I';
const streamId = encodeURIComponent('0x5dbef432d012c8d20993214f2c3765e9cf83d180/signature-amoy');

// HTTP endpoint for publishing to the Streamr node
const streamrNodeUrl = `http://35.224.225.183:7171/streams/${streamId}/data?apiKey=${apiKey}`;

async function startVideoStream() {
    try {
        // Request access to the user's webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('videoElement');
        videoElement.srcObject = stream;

        // Initialize MediaRecorder to record the stream in 2-second chunks
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(2000);

        mediaRecorder.ondataavailable = (event) => {
            // When a chunk is available, convert it to Base64
            if (event.data.size > 0) {
                convertToBase64(event.data);
            }
        };
    } catch (error) {
        console.error('Error accessing webcam: ', error);
    }
}

// Convert Blob data to Base64 and send it via HTTP POST
function convertToBase64(blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];

        // Send the base64 string via HTTP POST
        sendBase64Data(base64String);
    };
    reader.readAsDataURL(blob);
}

// Function to send the base64 data to the Streamr node using HTTP POST
async function sendBase64Data(base64String) {
    try {
        const response = await fetch(streamrNodeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ video: base64String }) // Send the base64 string as JSON
        });

        if (response.ok) {
            console.log('Data sent successfully');
        } else {
            console.error('Failed to send data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

// Start the video stream and chunking when the page loads
window.onload = startVideoStream;
