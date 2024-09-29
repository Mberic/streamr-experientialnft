import * as posenet_module from '@tensorflow-models/posenet';
import * as facemesh_module from '@tensorflow-models/facemesh';
import * as tf from '@tensorflow/tfjs';
import * as paper from 'paper';
import Stats from 'stats.js';
import "babel-polyfill";

import {drawKeypoints, drawPoint, drawSkeleton, isMobile, toggleLoadingUI, setStatusText} from './utils/demoUtils';
import {SVGUtils} from './utils/svgUtils'
import {PoseIllustration} from './illustrationGen/illustration';
import {Skeleton, facePartName2Index} from './illustrationGen/skeleton';
import {FileUtils} from './utils/fileUtils';

import * as girlSVG from './resources/illustration/girl.svg';
import * as boySVG from './resources/illustration/boy.svg';
import * as abstractSVG from './resources/illustration/abstract.svg';
import * as blathersSVG from './resources/illustration/blathers.svg';
import * as tomNookSVG from './resources/illustration/tom-nook.svg';

// Camera stream video element
let video;
let videoWidth = 300;
let videoHeight = 300;

// Canvas
let faceDetection = null;
let illustration = null;
let peerIllustration = null;
let canvasScope;
let canvasWidth = 750;
let canvasHeight = 550;
let illustrations = [];

// ML models
let facemesh;
let posenet;
let minPartConfidence = 0.1;
let nmsRadius = 30.0;
let peerPose = null;

// Misc
let mobile = false;
const stats = new Stats();
const avatarSvgs = {
  'girl': girlSVG.default,
  'boy': boySVG.default,
  'abstract': abstractSVG.default,
  'blathers': blathersSVG.default,
  'tom-nook': tomNookSVG.default,
};

const apiKey = 'YmJhOTAxNGRmYjJkNDk1YWEzMmQxZTBlZmM4YTM5M2I';
const streamId = encodeURIComponent('0x5dbef432d012c8d20993214f2c3765e9cf83d180/signature-amoy');
const sub = new WebSocket(`wss://adjusted-bass-scarcely.ngrok-free.app/streams/${streamId}/subscribe?apiKey=${apiKey}`);

const videoElement = document.getElementById('video');
const buffer = []; // Buffer to store incoming base64 video segments

    sub.onopen = () => {
        console.log("WebSocket connection established");
    };

    // Handle incoming WebSocket messages with base64 video data
    sub.onmessage = (event) => {
        console.log('Received message:', event.data);

        try {
            const parsedData = JSON.parse(event.data);
            if (parsedData.video) {
                const base64Data = parsedData.video.trim();
                console.log('Base64 string length:', base64Data.length);

                // Add the base64 video segment to the buffer
                buffer.push(base64Data);

            } else {
                console.error('No video data in the WebSocket message');
            }
        } catch (error) {
            console.error('Error processing video segment:', error);
        }
    };

  // Handle WebSocket connection errors
  sub.onerror = (error) => {
      console.error('WebSocket Error:', error);
  };

  // Handle WebSocket connection closure
  sub.onclose = () => {
      console.log('WebSocket connection closed');
  };
  async function setupVideo() {
    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;
  
    // Wait until the buffer has data
    while (buffer.length === 0) {
      console.log('Buffer is empty, waiting for new segments...');
      await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for 500ms before checking again
    }
  
    const base64Data = buffer.shift(); // Remove the oldest segment from the buffer
  
    // Create a Blob from the base64 video text
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'video/mp4' });
  
    // Create a URL for the blob and set it as the video source
    const blobURL = URL.createObjectURL(blob);
    video.src = blobURL;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  

async function loadVideo() {
  const video = await setupVideo();
  video.play();

  return video;
}

const defaultPoseNetArchitecture = 'MobileNetV1';
const defaultQuantBytes = 2;
const defaultMultiplier = 1.0;
const defaultStride = 16;
const defaultInputResolution = 200;

const guiState = {
  avatarSVG: Object.keys(avatarSvgs)[0],
  debug: {
    showDetectionDebug: true,
    showIllustrationDebug: false,
  },
};

/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras) {
  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId;
  }

}


/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video) {

  const canvas = document.getElementById('output'); 
  const keypointCanvas = document.getElementById('keypoints');
  const videoCtx = canvas.getContext('2d');
  const keypointCtx = keypointCanvas.getContext('2d');

  canvas.width = videoWidth;
  canvas.height = videoHeight;
  keypointCanvas.width = videoWidth;
  keypointCanvas.height = videoHeight;

  async function poseDetectionFrame() {
    // Begin monitoring code for frames per second
    stats.begin();

    let poses = [];
   
    videoCtx.clearRect(0, 0, videoWidth, videoHeight);
    // Draw video
    videoCtx.save();
    videoCtx.scale(-1, 1);
    videoCtx.translate(-videoWidth, 0);
    videoCtx.drawImage(video, 0, 0, videoWidth, videoHeight);
    videoCtx.restore();

    // Creates a tensor from an image
    const input = tf.browser.fromPixels(canvas);
    faceDetection = await facemesh.estimateFaces(input, false, false);
    let all_poses = await posenet.estimatePoses(video, {
      flipHorizontal: true,
      decodingMethod: 'multi-person',
      maxDetections: 1,
      scoreThreshold: minPartConfidence,
      nmsRadius: nmsRadius
    });

    poses = poses.concat(all_poses);
    input.dispose();

    keypointCtx.clearRect(0, 0, videoWidth, videoHeight);

    canvasScope.project.clear();
    
    if (poses.length >= 1 && illustrations) {

      Skeleton.flipPose(poses[0]);
      illustrations[1].updateSkeleton(poses[0], null);      
      illustrations[1].draw(canvasScope, videoWidth, videoHeight);

    }

    if (peerPose){
      
      Skeleton.flipPose(peerPose[0]);
      illustrations[0].updateSkeleton(peerPose[0], null);      
      illustrations[0].draw(canvasScope, videoWidth, videoHeight);

    }

    canvasScope.project.activeLayer.scale(
      canvasWidth / videoWidth, 
      canvasHeight / videoHeight, 
      new canvasScope.Point(0, 0));

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

function setupCanvas() {
  mobile = isMobile();
  if (mobile) {
    canvasWidth = Math.min(window.innerWidth, window.innerHeight);
    canvasHeight = canvasWidth;
    videoWidth *= 0.7;
    videoHeight *= 0.7;
  }  

  canvasScope = paper.default;
  let canvas = document.querySelector('.illustration-canvas');;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvasScope.setup(canvas);

  // Setup peer illustration canvas
  peerIllustration = new PoseIllustration(canvasScope, {x: 150, y: 150});
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  setupCanvas();

  toggleLoadingUI(true);
  setStatusText('Loading PoseNet model...');
  posenet = await posenet_module.load({
    architecture: defaultPoseNetArchitecture,
    outputStride: defaultStride,
    inputResolution: defaultInputResolution,
    multiplier: defaultMultiplier,
    quantBytes: defaultQuantBytes
  });
  setStatusText('Loading FaceMesh model...');
  facemesh = await facemesh_module.load();

  setStatusText('Loading Avatar file...');
  let t0 = new Date();
  await parseSVG(Object.values(avatarSvgs).slice(0,3));

  setStatusText('Setting up camera...');
  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this device type is not supported yet, ' +
      'or this browser does not support video capture: ' + e.toString();
    info.style.display = 'block';
    throw e;
  }

  setupGui([], posenet);
  // setupFPS();
  
  toggleLoadingUI(false);
  detectPoseInRealTime(video, posenet);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
FileUtils.setDragDropHandler((result) => {parseSVG(result)});

async function parseSVG(targets) {
  
  for (let target of targets) {
    let svgScope = await SVGUtils.importSVG(target /* SVG string or file path */);
    let skeleton = new Skeleton(svgScope);
    let illustration = new PoseIllustration(canvasScope);
    illustration.bindSkeleton(skeleton, svgScope);
    illustrations.push(illustration);
  }

}

bindPage();
