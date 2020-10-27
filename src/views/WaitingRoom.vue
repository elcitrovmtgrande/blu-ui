<template>
  <div class="page">
    <h1>Blü.</h1>
    <p>Please type the id of the room you are looking for joining.</p>
    <div class="input">
      <input type="text" placeholder="eg: XYWY-UH-IHDI" v-model="roomId">
      <button>Join</button>
    </div>
    <div class="separator">
      <span>or</span>
    </div>
    <button class="new-btn" @click="$router.push('room')">
      Create a new room
    </button>
  </div>
</template>

<script>
export default {
  name: 'WaitingRoom',
  data() {
    return {
      roomId: '',
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme';

.page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    font-family: "Pacifico";
    font-size: 100px;
    color: white;
    line-height: 0;
  }

  p {
    color: white;
    font-size: 18px;
  }

  .new-btn {
    height: 50px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    border: unset;
    margin-top: 30px;
    font-weight: bold;
    transition: all .25s ease;

    &:hover {
      cursor: pointer;
      opacity: .7;
    }
  }
}

.separator {
  width: 200px;
  height: 1px;
  // background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;

  span {
    background: $deep-blue;
    padding: 10px;
    color: white;
  }
}

.input {
  width: 300px;
  height: 50px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  input {
    width: 240px;
    height: 100%;
    border-bottom: 1px solid white;
    border: unset;
    color: white;
    padding-left: 20px;
    border-bottom: 1px solid white;
    background: inherit;
    text-transform: uppercase;
  }

  button {
    height: 50px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    border: unset;
    font-weight: bold;
    transition: all .25s ease;
    border: 1px solid white;

    &:hover {
      cursor: pointer;
      opacity: .7;
    }
  }
}

// phones
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 736px)
  and (-webkit-min-device-pixel-ratio: 3) {
  p {
    width: 200px;
  }
}

// tablets
@media only screen
  and (min-device-width: 736px)
  and (max-device-width: 1112px)
  and (-webkit-min-device-pixel-ratio: 2) {

}

</style>
