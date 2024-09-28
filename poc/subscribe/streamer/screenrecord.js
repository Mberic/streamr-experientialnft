
let RECORDING_ONGOING = false;
let recordingToggle = document.getElementById("recording-toggle"); // The button

recordingToggle.addEventListener("click", async () => {
    RECORDING_ONGOING = !RECORDING_ONGOING; // Start / Stop recording
    if(RECORDING_ONGOING){
        recordingToggle.innerHTML = "Stop Recording";
        startRecording(); // Start the recording
    } else {
        recordingToggle.innerHTML = "Start Recording";
        stopRecording(); // Stop screen recording
    }
});

let blob, mediaRecorder = null;
let chunks = [];

async function startRecording(){
    let stream = await navigator.mediaDevices.getDisplayMedia({video: {mediaSource: "screen"}, audio: true});

    mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm"});
    mediaRecorder.ondataavailable = (e) => {
        if(e.data.size > 0){
            chunks.push(e.data);
        }
    };
    mediaRecorder.onstop = () => {
        let filename = "nft"; // Ask the file name

        blob = new Blob(chunks, {type: "video/webm"});
        chunks = []; // Resetting the data chunks
        let dataDownloadUrl = URL.createObjectURL(blob);

        // Download it onto the user's device
        let a = document.createElement('a');
        a.href = dataDownloadUrl;
        a.download = `${filename}.webm`;
        a.click();

        URL.revokeObjectURL(dataDownloadUrl);
    };
    mediaRecorder.start(250);
}

function stopRecording(){
    mediaRecorder.stop(); // Stopping the recording
}
