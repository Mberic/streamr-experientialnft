# Signature \- Experiential NFTs

This project uses video to create NFTs for users. It uses [Pose estimation](https://www.tensorflow.org/lite/examples/pose_estimation/overview) to detect human poses in the stored or live video. These poses can then be used to animate an SVG avatar. 

The aim of this **signature** approach to NFT generation is to create NFTs from “lived experiences”. We choose to call these experiential NFTs. 

## Benefits 

Let's explore the benefits of this **signature** approach:

* Our NFT objects have a legitimate claim from where they derive their value (unlike most of the stuff on the market now).  This the key **value proposition** for this project.
    
  If you know that an animation is using poses based on a famous recorded real world event (e.g concert, live stream), then you'll definitely be interested.  

## How it Works 

1. A user logs into the platform - we use **account abstraction**. The user makes a request for a historical video or subscribes to a supported live event. The user then selects particular seconds from the video which will be used to generate the poses.
    
2. The DApp backend is notified of the requested video segment. This is processed to detect human poses. If human poses are detected with \>0.65 accuracy, then we can store the pose objects (IPFS). We also extract some other info:

- the frames per second (fps). This will be used to animate the SVG avatar
- the seconds in the video. This can be used to generate fractional NFTs. (See **Future developments** section)
     
3. After successful execution (detection of human poses), the user can now mint their experiential NFT. We'll need an IPFS link that points to the IPFS links for:

- the `poses` 
- and `svg` for the animation
     
4. At the frontend, a user queries the detected `poses`. They then choose an `svg` avatar and use this to generate an animation ( **gif** or **video** ) . They can then list (or show off\!)  this animation on an NFT marketplace

## Demo

It may be difficult to visualize what we are trying to do here. So [here's a web2 ML experiment](https://www.scroobly.com/) that does something similar. The difference is that it uses live video feed.

## Tools

Frontend 

* React  
* Web3Auth SDK. To provide account abstraction 
* Paper.js. To animate SVG avatars using poses

Backend (Node JS)

- Node Js
- `posenet` and `facemesh` libraries to detect poses from video frames
- `ffmpeg` library to detect video frames 

## Tokenomics (Monetization)

The DApp will collect fees for video processing and for minting Experiential NFTs

## Use cases

* Famous individuals can create NFT poses and list them. Users can then buy them and choose an SVG avatar for these poses. This allows for personalization on the side of buyers  
* Prize giving ceremony. Each hackathon winner can have a NFT animation from a congratulatory video of the prize giving ceremony  
* Ordinary individuals can also generate NFTs from captivating moments of their life e.g weddings

## Future developments 

To be done after initial product launch:

* Pose estimation for non-human motion e.g. for dogs and cats  
* Fractionalization. Given that our videos generate an array of pose objects, we can have each “pose moment” (video frame or second) as an NFT   

## References 

1. [Pose estimation](https://www.tensorflow.org/lite/examples/pose_estimation/overview)  
2. [Pose Animator by Shan Huang](https://github.com/yemount/pose-animator)  
3. [Dog Pose estimation](https://github.com/ryanloney/dog-pose-estimation)
