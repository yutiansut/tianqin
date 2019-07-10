<template>
  <div class="login-container">
    <future-login
      v-if="!$store.state.logined"
      v-on:login-result="loginEnd"
      bid="快期模拟"
      user_id="022632"
      password="123123"></future-login>
  </div>
</template>

<script>
  import FutureLogin from '@/components/forms/FutureLogin.vue'

  export default {
    name: 'login',
    components: {
      FutureLogin
    },
    methods: {
      loginEnd: function (result) {
        this.$store.state.bid = result.bid
        this.$store.state.user_id = result.user_id
        this.$store.commit('SET_LOGIN', !result.isFailed)
        if (!result.isFailed) {
          this.$router.push({ path: '/dashboard/主连' })
        }
      }
    },
    beforeMount () {
      if (this.$store.state.logined) {
        this.$router.push({ path: '/dashboard/主连' })
      }
    }
  }
</script>

<style>
  .login-container {
    margin: auto;
    width: 300px;
    position: relative;
    top: 30%;
  }
</style>
