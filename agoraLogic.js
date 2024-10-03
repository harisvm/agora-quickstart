
import AgoraRTC from "agora-rtc-sdk-ng";
const RtcTokenBuilder = require("./RtcTokenBuilder2").RtcTokenBuilder;
const RtcRole = require("./RtcTokenBuilder2").Role;

let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
};

const userToken = generateAgoraToken();
let options = {
    // Pass your app ID here.
    appId: "4a41a134ded64d03992400a1bb9534ff",
    // Set the channel name.
    channel: "test",
    // Use a temp token
    token: '007eJxTYJicEr16SeGBXS+PLrZ5YHhJzr1rywmxTlV14VIJ9vPyPjYKDCaJJoaJhsYmKakpZiYpBsaWlkYmBgaJhklJlqbGJmlpjE//pTUEMjLc+FPFyMgAgSA+C0NJanEJAwMAHz8fNQ==',
    // Set the user ID.
    uid: Math.floor(Math.random() * 1000000),
};

let clientRoleOptions = {
    // Set the delay level of the audience to AUDIENCE_LEVEL_ULTRA_LOW_LATENCY
    level: 2
}

async function startBasicLiveStreaming() {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({mode: "live", codec: "vp8", role: "host"});

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        if (mediaType === "video") {``
            // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            const remotePlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the uid of the remote user.
            remotePlayerContainer.id = user.uid.toString();
            remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            remotePlayerContainer.style.width = "640px";
            remotePlayerContainer.style.height = "480px";
            document.body.append(remotePlayerContainer);

            // Play the remote video track.
            // Pass a DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(remotePlayerContainer);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            const remotePlayerContainer = document.getElementById(user.uid);
            // Destroy the container.
            remotePlayerContainer.remove();
        });
    });

    window.onload = function () {
        document.getElementById("host-join").onclick = async function () {
            // Join an RTC channel.
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            // Create a local audio track from the audio sampled by a microphone.
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Create a local video track from the video captured by a camera.
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            // Publish the local audio and video tracks to the RTC channel.
            await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
            // Dynamically create a container in the form of a DIV element for playing the local video track.
            const localPlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the uid of the local user.
            localPlayerContainer.id = options.uid;
            localPlayerContainer.textContent = "Local user " + options.uid;
            localPlayerContainer.style.width = "640px";
            localPlayerContainer.style.height = "480px";
            document.body.append(localPlayerContainer);

            // Play the local video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
            rtc.localVideoTrack.play(localPlayerContainer);
            
            console.log("publish success!");

            document.getElementById("audience-join").disabled = true;
            document.getElementById("host-join").disabled = true;
        };

        document.getElementById("audience-join").onclick = async function () {
            // Join an RTC channel.

            // You cannot publish media streams when you are joining as an audience
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Create a local video track from the video captured by a camera.
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            // Dynamically create a container in the form of a DIV element for playing the local video track.
            const localPlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the uid of the local user.
            localPlayerContainer.id = options.uid;
            localPlayerContainer.textContent = "Local user " + options.uid;
            localPlayerContainer.style.width = "640px";
            localPlayerContainer.style.height = "480px";
            document.body.append(localPlayerContainer);

            // Play the local video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
            rtc.localVideoTrack.play(localPlayerContainer);
            // Add the following code

            // Modify the parameters passed in setClientRole
            rtc.client.setClientRole("audience", clientRoleOptions);
            console.log("publish success!");

            document.getElementById("audience-join").disabled = true;
            document.getElementById("host-join").disabled = true;
        };

        document.getElementById("leave").onclick = async function () {
            // Destroy the local audio and video tracks.
            rtc.localAudioTrack.close();
            rtc.localVideoTrack.close();

            // Remove the container for the local video track.
            const localPlayerContainer = document.getElementById(options.uid);
            if (localPlayerContainer) {
                localPlayerContainer.remove();
            }

            // Traverse all remote users.
            rtc.client.remoteUsers.forEach(user => {
                // Destroy the dynamically created DIV containers.
                const playerContainer = document.getElementById(user.uid);
                playerContainer && playerContainer.remove();
            });

            // Leave the channel.
            await rtc.client.leave();
            document.getElementById("audience-join").disabled = false;
            document.getElementById("host-join").disabled = false;
        };
    };
}
function generateAgoraToken(channelName, uid) {
  // Get the value of the environment variable AGORA_APP_ID
  const appId = '4a41a134ded64d03992400a1bb9534ff';
  // Get the value of the environment variable AGORA_APP_CERTIFICATE
  const appCertificate = '6a8f501368964b8e8d5e1a8dbeb6481c';
  // Set streaming permissions
  const role = RtcRole.PUBLISHER;
  // Token validity time in seconds
  const tokenExpirationInSecond = 3600;
  // The validity time of all permissions in seconds
  const privilegeExpirationInSecond = 3600;

  // Validate if appId and appCertificate are set
  if (!appId || !appCertificate) {
    console.error("Need to set environment variables AGORA_APP_ID and AGORA_APP_CERTIFICATE");
    process.exit(1);
  }

  // Generate Token
  const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, tokenExpirationInSecond, privilegeExpirationInSecond);
  return tokenWithUid;
}

// Example usage:
const channelName = "yourChannelName";
const uid = 2882341273;
const token = generateAgoraToken(channelName, uid);
console.log("Generated Token:", token);

startBasicLiveStreaming();