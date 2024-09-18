# Signature \- experiential NFTs

This project uses video to create NFTs for users. It uses [Pose estimation](https://www.tensorflow.org/lite/examples/pose_estimation/overview) to detect human poses in the stored or live video. These poses can then be used to animate an SVG avatar. 

This **signature** approach to NFT generation aims to create NFTs from “lived experiences”. We choose to call these experiential NFTs. 

## Benefits 

Let's explore the benefits of this **signature** approach:

* **Value derivation.** Our NFT objects have a legitimate claim from where they derive value (unlike most of the stuff on the market now).  This is the key **value proposition** for this project.
  
  If you know that an animation is using poses based on a famous recorded real world event (e.g concert, live stream), then you'll definitely be interested. 

* **Public traceability.** We can store significant events on the blockchain and remember them as playful memories (using animations) — for example, ceremonies like weddings, graduation, etc. 
 
## How it Works 

1. A user logs into the platform using a social login - we use a **wallet abstraction** service (Web3Auth). 

  The user makes a request for a historical video or subscribes to a supported live event. The user then selects particular seconds from the video which will be used to generate the poses.
    
2. The DApp backend is receives the requested video segment and processes it to detect human poses. We also extract some other info:

- the frames per second (fps). This will be used to animate the SVG avatar
- the seconds in the video. This can be used to generate fractional NFTs. (See **Future developments** section)
     
3. If human poses are detected with \>0.65 accuracy, the backend will then store the following NFT metadata on IPFS:

- `poses`   
- `svg` content identifier (CID)  
- `video`   
- Some extra info e.g. name of NFT 

Next, we'll mint the experiential NFT and then send our data to [NFT.Storage](https://app.nft.storage/v1/docs/intro) for enduring preservation. **NFT.Storage** is a Filecoin service specifically designed for the long-term preservation of NFT data with a one-time payment ($2.99 per GB).

\[ This service requires us to upload a CSV that contains a list of token IDs and CIDs for our NFTs. We'll batch send this data. \]

4. At the frontend, a user queries the detected `poses` plus `svg` avatar and uses these to generate an animation (**gif** or **video**). They can then list (or show off\!)  this animation on an NFT marketplace.
## Demo

It may be difficult to visualize what we are trying to do here. So [here's a web2 ML experiment](https://www.scroobly.com/) that does something similar. 

## Tools

Frontend 

* React  
* Web3Auth SDK. To provide wallet abstraction 
* Paper.js. To animate SVG avatars using poses

Backend (Node JS)

- Node Js
- `posenet` and `facemesh` libraries to detect poses from video frames
- `ffmpeg` library to detect video frames 

## Tokenomics

The DApp will collect fees for video processing and minting experiential NFTs

## Use cases

* Famous individuals can create NFT poses and list them. Users can then buy them and choose an SVG avatar for these poses. This allows for personalization on the side of buyers  
* Prize-giving ceremony. Each hackathon winner can have an NFT animation from a congratulatory video captured by the prize-giver  
* Ordinary individuals can also generate NFTs from captivating moments of their life e.g weddings

## Future developments 

To be done after initial product launch:

* Pose estimation for non-human motion e.g. for dogs and cats  
* Fractionalization. Given that our videos generate an array of pose objects, we can have each “pose moment” (video frame or second) as an NFT   
* Multi-chain presence

## References 

1. [Pose estimation](https://www.tensorflow.org/lite/examples/pose_estimation/overview)  
2. [Pose Animator by Shan Huang](https://github.com/yemount/pose-animator)  
3. [Dog Pose estimation](https://github.com/ryanloney/dog-pose-estimation)
