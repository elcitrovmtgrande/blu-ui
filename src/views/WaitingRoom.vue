<template>
  <div class="page">
    <h1>Blü</h1>
    <p>Please type the id of the room you are looking for joining.</p>
    <div id="pseudoForm" class="input">
      <label>Pseudo</label>
      <input type="text" placeholder="Pseudo desired for this call (optional)" v-model="roomId">
      <small>Who really cares ?</small>
    </div>
    <div class="input">
      <input type="text" placeholder="Room id" v-model="roomId">
      <button @click="$router.push({ name: 'Room', params: { roomId } })">Join</button>
    </div>
    <div class="separator">
      <span>or</span>
    </div>
    <button
      class="new-btn"
      @click="$router.push({
        name: 'room',
        params: { roomId, username: this.username || 'unknown' }
      })">
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
      // opacity: .7;
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
    background: $blue;
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
    padding-left: 10px;
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
      // opacity: .7;
    }
  }
}

#pseudoForm {
  flex-direction: column;
  // justify-content: flex-s;
  align-items: flex-start;
  height: unset;
  min-height: 50px;
  margin-bottom: 20px;

  label {
    font-weight: bold;
  }

  input {
    height: 50px;
    width: calc(100% - 10px);
    color: white;
    text-transform: none;

    &::placeholder {
      color: white;
    }
  }

  small {
    margin-top: 4px;
    font-weight: bold;
    font-size: 10px;
    color: white;
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
