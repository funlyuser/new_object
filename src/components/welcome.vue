<template>
  <div class="welcome">
    欢迎来到welcome
    <button @click="componentname = 'cate'">cate</button>
    <button @click="componentname = 'user'">user</button>
    <!-- <component :is="componentname"></component> -->
  </div>
</template>
<script>
import cate from '../components/cate.vue'
import user from '../components/user.vue'
export default {
  data() {
    return {
      componentname: 'cate'
    }
  },
  components: {
    cate,
    user
  }
}
</script>