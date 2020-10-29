<template>
  <div :class="['message', {self}]">
    <div v-if="!noHeader" class="message__header">
      <span class="message__header--username">{{ self ? 'You' : username }}</span>
      <span class="message__header--date">{{ displayDate}}</span>
    </div>
    <div class="message__content">
      <p>
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Message',
  props: {
    username: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    self: {
      type: Boolean,
      required: false,
      defaultValue: false,
    },
    noHeader: {
      type: Boolean,
      required: false,
      defaultValue: false,
    },
  },
  mounted() {
    if (this.username === 'totorlezer0') {
      console.log(this.noHeader);
    }
  },
  computed: {
    displayDate() {
      return moment(this.date).format('h:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme';

.message {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &--username {
      font-size: 14px;
      font-weight: bold;
      color: $blue;
    }

    &--date {
      margin-left: 10px;
      font-size: 12px;
      color: $deep-blue;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    text-align: justify;
    font-size: 14px;
    background: $lightgrey;
    max-width: 50%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;

    p {
      width: 100%;
      overflow-wrap: break-word;
      margin: unset;
      text-align: left;
    }
  }
}
.message.self, .message.self .message__header, .message.self .message__content {
  justify-content: flex-start;
}
.message.self {
  align-items: flex-start;
}
.message.self .message__content {
  background: $blue-alt;
}
</style>
