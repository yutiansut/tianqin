<template>
  <div class="user-login">
    <Alert :type="alterType" v-if="isShowAlert" show-icon closable @on-close="onclose">
      {{ alertMsg }}
    </Alert>
    <Form ref="userForm" label-position="top" :model="userForm" :rules="rules">
      <FormItem label="期货公司" prop="bid">
        <Select v-model="userForm.bid">
          <Option v-for="item in brokers" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号" prop="user_id">
        <Input v-model="userForm.user_id" placeholder="请输入账号"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input type="password" v-model="userForm.password" placeholder="请输入密码"></Input>
      </FormItem>
      <FormItem>
        <Button @click="onSubmit('userForm')" :loading="logining" type="primary">
          登录
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import { DefaultUser } from '@/config'

  let defaultErrMsg = '等待回应超时,可能的原因 (1)服务器正在运维，(2)网络不通，无法连接服务器，请稍后/检查网络后重试。'

  export default {
    name: 'userLogin',
    data () {
      return {
        brokers: [],
        userForm: {
          bid: this.bid,
          user_id: this.user_id,
          password: this.password
        },
        rules: {
          bid: [
            { required: true, message: '请选择期货公司', trigger: 'blur' }
          ],
          user_id: [
            { required: true, message: '请输入账户', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        logining: false,
        loginResult: {
          bid: '',
          user_id: '',
          isFailed: true
        },
        isShowAlert: false,
        alterType: 'error',
        alertMsg: ''
      }
    },
    props: {
      bid: {
        type: String,
        default: '快期模拟'
      },
      user_id: {
        type: String,
        default: ''
      },
      password: {
        type: String,
        default: ''
      }
    },
    mounted: function () {
      this.$on('tqsdk:rtn_brokers', function (brokers) {
        this.brokers = brokers
      })
    },
    methods: {
      onclose () {
        this.isShowAlert = false
      },
      login (bid, user_id, password) {
        this.$tqsdk.add_account(bid, user_id, password)
        this.$tqsdk.login({ bid, user_id, password })
        this.$on('tqsdk:notify', function (notify) {
          if (notify.bid === bid && notify.user_id === user_id) {
            if (notify.content === '用户登录失败!') {
              this.logining = false
              this.isShowAlert = true
              this.alertMsg += notify.content
              this.loginResult.isFailed = true
              this.$emit('login-result', this.loginResult)
            } else if (notify.content === '登录成功') {
              this.logining = false
              this.isShowAlert = false
              this.alertMsg = ''
              this.loginResult.isFailed = false
              this.$emit('login-result', this.loginResult)
            } else if (notify.content.indexOf('CTP') === -1) {
              this.isShowAlert = true
              this.alertMsg += notify.content + '\n'
            }
          }
        })

        let intervalTimes = 60
        let that = this
        let interval = setInterval(function () {
          if (that.$tqsdk.is_logined({ user_id: user_id })) {
            clearInterval(interval)
          } else if (intervalTimes === 0) {
            clearInterval(interval)
            that.isShowAlert = true
            that.alertMsg += '用户登录超时'
            that.loginResult.isFailed = true
            that.$emit('login-result', that.loginResult)
          }
          intervalTimes--
        }, 1000)
      },
      onSubmit (form) {
        this.logining = true
        this.alertMsg = ''
        this.$refs[form].validate((valid) => {
          if (!valid) return
          let bid = this.userForm.bid
          let user_id = this.userForm.user_id
          let password = this.userForm.password
          this.loginResult.bid = bid
          this.loginResult.user_id = user_id
          this.loginResult.isFailed = true
          this.login(bid, user_id, password)
        })
      }
    }
  }
</script>
<style lang="scss">
  .user-login {
    margin: 3px 6px;
    .ivu-alert {
      width: 700px;
      margin: 16px auto;
    }
  }
</style>
