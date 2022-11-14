<template>
  <div class="welcome">
    欢迎来到welcome
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