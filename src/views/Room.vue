<template>
  <section :class="['main', {'no-permission': !streamPermission}]">
    <template v-if="streamPermission">
    <div class="callui">
      <NetworkIndicator />
      <div class="callui__video">
        <video
          id="remoteVidPreview"
          muted
          autoplay></video>
      </div>
      <div class="chat-open-btn" @click="onChatToggle">
        <fa :icon="chatIsOpen ? 'times' : 'comment-alt'" />
      </div>
      <div :class="['callui__chat', {'open': chatIsOpen}]">
        <div class="callui__chat--header">
          <h3>Messages</h3>
        </div>
      </div>
      <div :class="['callui__myvideo', {userVideoXL}]" @click="onUserVideoPreviewToggle">
        <!-- Ajouter l'attrbut 'controls' si on veut rajouter les controles du navigateur -->
        <video
          id="userVidPreview"
          muted
          autoplay></video>
      </div>
    </div>

    <footer>
      <div
        :class="['btn', { 'option-disabled-by-user': !isMicOn }]"
        @click="onMicToggle">
        <fa :icon="isMicOn ? 'microphone' : 'microphone-slash'" />
      </div>
      <fa icon="phone-alt" class="ring-off"/>
      <div
        :class="['btn', { 'option-disabled-by-user': !isCameraOn }]"
        @click="onCameraToggle">
        <fa :icon="isCameraOn ? 'video' : 'video-slash'" />
      </div>
    </footer>
    </template>
    <template v-else>
      <h1 class="title__title">Blü</h1>
      <h2 class="title__no-permission">Permission needed</h2>
      <p class="subtitle__no-permission">
        Please allow your camera and microphone and relaunch the app.
      </p>
      <button class="no-permission--btn" @click="$router.go()">
        Relaunch
      </button>
    </template>
  </section>
</template>

<script>
import { NetworkIndicator } from '@/components';
import config from '@/config';

export default {
  name: 'Room',
  components: {
    NetworkIndicator,
  },
  data() {
    return {
      isMicOn: true,
      isCameraOn: true,
      chatIsOpen: false,
      userVideoXL: false,
      streamPermission: false,
      isRoomCreator: false,
      rtcPeerConnection: null,
      roomId: null,
      localStream: null,
      userVideo: null,
      remoteStream: null,
      remoteVideo: null,
    };
  },
  computed: {},
  async mounted() {
    const { roomId } = this.$route.params;
    this.roomId = roomId;
    this.userVideo = document.getElementById('userVidPreview');
    this.remoteVideo = document.getElementById('remoteVidPreview');
    await this.initSocket();
    this.joinRoom();
    // this.startUserVideo();
  },
  methods: {
    async initSocket() {
      this.sockets.subscribe('room_created', async () => {
        console.log('Socket event callback: room_created');

        await this.setLocalStream(/* constraints */);
        this.isRoomCreator = true;
      });

      this.sockets.subscribe('room_joined', async () => {
        console.log('Socket event callback: room_joined');

        await this.setLocalStream(/* constraints */);
        this.$socket.emit('start_call', this.roomId);
      });

      this.sockets.subscribe('full_room', () => {
        console.log('Socket event callback: full_room');

        alert('The room is full, please try another one');
      });

      // SOCKET EVENT CALLBACKS =====================================================
      this.sockets.subscribe('start_call', async () => {
        console.log('Socket event callback: start_call');

        if (this.isRoomCreator) {
          this.rtcPeerConnection = new RTCPeerConnection(config.iceServers);
          this.addLocalTracks(this.rtcPeerConnection);
          this.rtcPeerConnection.ontrack = this.setRemoteStream;
          this.rtcPeerConnection.onicecandidate = this.sendIceCandidate;
          await this.createOffer(this.rtcPeerConnection);
        }
      });

      this.sockets.subscribe('webrtc_offer', async (event) => {
        console.log('Socket event callback: webrtc_offer');

        if (!this.isRoomCreator) {
          this.rtcPeerConnection = new RTCPeerConnection(config.iceServers);
          this.addLocalTracks(this.rtcPeerConnection);
          this.rtcPeerConnection.ontrack = this.setRemoteStream;
          this.rtcPeerConnection.onicecandidate = this.sendIceCandidate;
          this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
          await this.createAnswer(this.rtcPeerConnection);
        }
      });

      this.sockets.subscribe('webrtc_answer', (event) => {
        console.log('Socket event callback: webrtc_answer');

        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
      });

      this.sockets.subscribe('webrtc_ice_candidate', (event) => {
        console.log('Socket event callback: webrtc_ice_candidate');

        // ICE candidate configuration.
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });
        this.rtcPeerConnection.addIceCandidate(candidate);
      });
    },
    async setLocalStream(/* constraints */) {
      let stream;
      const mediaConstraints = {
        audio: true,
        video: { width: 1280, height: 720 },
      };
      try {
        stream = await navigator.mediaDevices.getUserMedia(/* constraints */mediaConstraints);
        if (stream && !this.streamPermission) {
          this.streamPermission = true;
        }
      } catch (error) {
        console.error('Could not get user media', error);
      }

      this.localStream = stream;
      this.userVideo.srcObject = stream;
    },
    async addLocalTracks(rtcPeerConnection) {
      this.localStream.getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, this.localStream);
      });
    },
    async createOffer(rtcPeerConnection) {
      const { roomId } = this;
      let sessionDescription;
      try {
        sessionDescription = await rtcPeerConnection.createOffer();
        rtcPeerConnection.setLocalDescription(sessionDescription);
      } catch (error) {
        console.error(error);
      }
      this.$socket.emit('webrtc_offer', {
        type: 'webrtc_offer',
        sdp: sessionDescription,
        roomId,
      });
    },
    async createAnswer(rtcPeerConnection) {
      const { roomId } = this;
      let sessionDescription;
      try {
        sessionDescription = await rtcPeerConnection.createAnswer();
        rtcPeerConnection.setLocalDescription(sessionDescription);
      } catch (error) {
        console.error(error);
      }

      this.$socket.emit('webrtc_answer', {
        type: 'webrtc_answer',
        sdp: sessionDescription,
        roomId,
      });
    },
    async setRemoteStream(event) {
      // eslint-disable-next-line prefer-destructuring
      this.remoteVideo.srcObject = event.streams[0];
      this.remoteStream = event.stream;
    },
    async sendIceCandidate(event) {
      const { roomId } = this;
      if (event.candidate) {
        this.$socket.emit('webrtc_ice_candidate', {
          roomId,
          label: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        });
      }
    },
    joinRoom() {
      this.$socket.emit('join', this.roomId);
    },
    startUserVideo() {
      const video = this.userVideo;
      window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.localStream = stream;
          video.srcObject = stream;
          video.onloadedmetadata = (/* e */) => {
            video.play();
          };
        })
        .catch(() => {
          this.streamPermission = false;
        });
    },
    stopUserVideo() {
      this.userVideo.pause();
      this.userVideo.src = '';
      this.localStream.getTracks().find((track) => track.kind === 'video').stop();
    },
    onMicToggle() {
      this.isMicOn = !this.isMicOn;
      if (!this.isMicOn) {
        this.stopUserMic();
      } else {
        this.startUserMic();
      }
    },
    onCameraToggle() {
      this.isCameraOn = !this.isCameraOn;
      if (!this.isCameraOn) {
        this.stopUserVideo();
      } else {
        this.startUserVideo();
      }
    },
    startUserMic() {
      this.localStream.getAudioTracks()[0].enabled = true;
    },
    stopUserMic() {
      this.localStream.getAudioTracks()[0].enabled = false;
    },
    onChatToggle() {
      this.chatIsOpen = !this.chatIsOpen;
    },
    onUserVideoPreviewToggle() {
      this.userVideoXL = !this.userVideoXL;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme";
.callui {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 100px);

  &__myvideo {
    position: absolute;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 2;
    bottom: 110px;
    right: 10px;
    width: 50px;
    height: 50px;
    background: $deep-blue;
    background: transparent;
    overflow: hidden;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .15s ease;

    &.userVideoXL {
      width: 200px;
      height: 200px;
    }

    &:hover {
      cursor: pointer;
    }

    video {
      height: 100%;
      transform: rotateY(180deg);
      -webkit-transform:rotateY(180deg); /* Safari and Chrome */
      -moz-transform:rotateY(180deg); /* Firefox */
    }
  }

  &__video {
    width: 100%;
    background: black;
    min-height: 100vh;

    video {
      width: 100%;
    }
  }

  &__chat {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    width: 0px;
    height: calc(100% - 100px);
    background: $blue-alt;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: width .15s ease;

    &.open {
      width: 300px;
    }

    &--header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background: white;
      height: 70px;
      padding-left: 30px;
      width: calc(100% - 30px);

      .btn {
        margin-right: 20px;
      }
    }
  }
}

.main {
  width: 100%;
  height: 100%;

  &.no-permission {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: $blue;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .ring-off {
      transform: rotate(135deg);
      font-size: 20px;
      color: $lightgrey;
      transition: all .25s ease;

      &:hover {
        cursor: pointer;
        // opacity: .7;
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: $blue-alt;
      border-radius: 5px;
      margin-right: 50px;
      margin-left: 50px;
      transition: all 0.25s ease;

      &:hover {
        cursor: pointer;
        // opacity: 0.5;
      }

      &.option-disabled-by-user {
        background: $red-rubis;
      }
    }
  }
}

.chat-open-btn {
  position: absolute;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 10;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background: $blue;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s ease;

  &:hover {
    cursor: pointer;
    // opacity: .7;
  }

  svg {
    color: white;
  }
}

.title__title {
  font-family: "Pacifico";
  font-size: 100px;
  color: white;
  line-height: 0;
}
.title__no-permission {
  color: white;
  font-size: 26px;
}
.subtitle__no-permission {
  color: white;
}
.no-permission--btn {
  height: 50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  border: unset;
  margin-top: 100px;
  font-weight: bold;
  transition: all .25s ease;

  &:hover {
    cursor: pointer;
    // opacity: .7;
  }
}

// phones
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 736px)
  and (-webkit-min-device-pixel-ratio: 3) {
  .callui__chat.open {
          width: 100%;
  }
}

// tablets
@media only screen
  and (min-device-width: 736px)
  and (max-device-width: 1112px)
  and (-webkit-min-device-pixel-ratio: 2) {

}
</style>
