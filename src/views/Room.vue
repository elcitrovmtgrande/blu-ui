<template>
  <section :class="['main', {'no-permission': !streamPermission}]">
    <template v-if="streamPermission">
    <div class="callui">
      <NetworkIndicator />
      <div class="callui__video"></div>
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
      userStream: null,
      userVideo: null,
      userVideoXL: false,
      streamPermission: true,
    };
  },
  computed: {},
  mounted() {
    this.userVideo = document.getElementById('userVidPreview');
    this.startUserVideo();
  },
  methods: {
    startUserVideo() {
      const video = this.userVideo;
      window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.userStream = stream;
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
      this.userStream.getTracks().find((track) => track.kind === 'video').stop();
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
      this.userStream.getAudioTracks()[0].enabled = true;
    },
    stopUserMic() {
      this.userStream.getAudioTracks()[0].enabled = false;
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
    height: 100%;
    background: black;
  }

  &__chat {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    width: 0px;
    height: calc(100% - 100px);
    background: $deep-blue;
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
    background: $ocean-blue;
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
        opacity: .7;
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: $green-emerald;
      border-radius: 5px;
      margin-right: 50px;
      margin-left: 50px;
      transition: all 0.25s ease;

      &:hover {
        cursor: pointer;
        opacity: 0.5;
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
  background: $deep-blue;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s ease;

  &:hover {
    cursor: pointer;
    opacity: .7;
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
    opacity: .7;
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
