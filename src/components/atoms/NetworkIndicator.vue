<template>
  <div
    :class="['network', { bad: quality === 0, good: quality === 1, excellent: quality === 2 }]"
    v-tooltip.bottom-end="networkPhrase">
    <div class="network--small"></div>
    <div class="network--medium"></div>
    <div class="network--big"></div>
  </div>
</template>

<script>
export default {
  name: 'NetworkIndicator',
  data() {
    return {
      quality: 0,
      networkPhrase: 'Network is excellent.',
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      const downlink = Math.floor(navigator.connection.downlink);
      let quality = 0;
      if (downlink > 5) {
        quality = 2;
      } else if (downlink > 2) {
        quality = 1;
      } else {
        quality = 0;
      }
      this.quality = quality;
    }, 500);
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme";

.network {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  &--small {
    width: 4px;
    height: 6px;
    background: $lightgrey;
    margin-right: 3px;
    border-radius: 2px;
    margin-bottom: 10px;
    opacity: 0.6;
  }

  &--medium {
    width: 4px;
    height: 9px;
    background: $lightgrey;
    margin-right: 3px;
    border-radius: 2px;
    margin-bottom: 10px;
    opacity: 0.6;
  }

  &--big {
    width: 4px;
    height: 12px;
    background: $lightgrey;
    border-radius: 2px;
    margin-bottom: 10px;
    opacity: 0.6;
  }

  &.bad {
    .network--small {
      background: $red-rubis;
      opacity: 1;
    }
  }

  &.good {
    .network--small {
      background: $orange-lemon;
      opacity: 1;
    }
    .network--medium {
      background: $orange-lemon;
      opacity: 1;
    }
  }

  &.excellent {
    .network--small {
      background: $green-emerald;
      opacity: 1;
    }
    .network--medium {
      background: $green-emerald;
      opacity: 1;
    }
    .network--big {
      background: $green-emerald;
      opacity: 1;
    }
  }
}
</style>
