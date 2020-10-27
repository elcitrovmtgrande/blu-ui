<template>
  <section class="main">
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
      isMicOn: false,
      isCameraOn: true,
      chatIsOpen: false,
    };
  },
  computed: {},
  methods: {
    onMicToggle() {
      this.isMicOn = !this.isMicOn;
    },
    onCameraToggle() {
      this.isCameraOn = !this.isCameraOn;
    },
    onChatToggle() {
      this.chatIsOpen = !this.chatIsOpen;
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
  // background: red;

  &__video {
    width: 100%;
    height: 100%;
    // background: url('../assets/inline_image_preview.jpg');
    // background-size: cover;
    // background-repeat: no-repeat;
    background: black;
  }

  &__chat {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
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
