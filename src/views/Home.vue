<template>
  <div class="page">
    <h1>Blu.</h1>
    <p>Calls made easy.</p>
    <button @click="$router.push('Call')">
      Launch
    </button>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="scss" scoped>
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

  button {
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
}

</style>
