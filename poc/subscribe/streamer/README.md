
-------------------
**NOTE:** This description in this "How it works" section is meant to show that the idea is feasible. However, it doesn't include the W3bstream node. Everything is running locally in the browser. 

The description of how the DApp would work with the W3bstream component is shown in the architecture diagram.

-----------

Let's look at how a user interacts with the DApp. 

**Note:** You need an active internet connection for the DApp to run. PeerJS requires this to randomly assign Peer IDs.

1. Clone the repo. Run the commands below to start the app: 
```sh
yarn 
yarn watch 
```

**Tip**: In case you run into errors after running `yarn`, you may be lacking build tools on your system. Install them as below:

```sh
sudo apt-get update
sudo apt-get install build-essential
```

If everything has worked out as expected, you should have a server running at `http://localhost:1234/` . You should see a page like the one below:  

![landing page](landing-page.png)

2. A random peer ID will be assigned to you. 
3. The ML models will begin loading. Afterward, your browser will ask for permission to use your webcam. Accept
4. A pre-designed SVG illustration will show up on the screen. This illustration will update as you make movements
5. You can “Start recording” to capture on-screen actions
6. Stop recording when satisfied. The browser will auto-download the video (**nft.webm**).
7. This video is your NFT.

The "intended" use-case for this DApp is when there 2 peers. However, you can still interact with it alone (as described in the steps above). To use it with another peer, simply request for their PeerID and & place it in "Connect to ID" input box & press the Connect button. The other peer's illustration should also show up on the screen & its position changes according to the Peer's actions. 

Here's an example frame when there are 2 peers:

![two peers image](two-peers.jpg)
