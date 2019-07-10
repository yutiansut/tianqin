<template>
  <Split mode="vertical" style="height: 100%">
    <div slot="top" class="split-pane">
      <Row style="height: 100%">
        <Col span="10" class="split-pane-cell border-right">
        <RadioGroup ref="btns" size="small" type="button" v-model="selectedTag" v-on:on-change="handlerChangeTag">
          <Radio v-for="item in tags" :key="item" :label="item">
            {{item}}
          </Radio>
        </RadioGroup>
        <div :style="{height: height+'px'}">
          <table-quotes :contentList="quotesList" :tableCol="quotesTableRow"/>
        </div>

        <!--<table-quotes :quotesList="quotesList" :height="height"/>-->
        </Col>
        <Col span="10" class="split-pane-cell border-right">
        <Chart :instrumentId="instrumentId" :height="height"/>
        </Col>
        <Col span="4" class="split-pane-cell">
        <!-- 确认结算单 -->
        <confirm/>
        <!-- 未登录用户显示 -->
        <future-login v-if="!$store.state.logined"></future-login>
        <!-- 已登录用户显示 -->
        <future-trade v-else></future-trade>
        </Col>
      </Row>
    </div>
    <div slot="trigger" class="split-vertical-line"></div>
    <div slot="bottom" class="split-pane">
      <Row style="height: 100%">
        <Col span="4" class="split-pane-cell border-right">
        策略列表
        </Col>
        <Col span="10" class="split-pane-cell border-right">
        <Tabs type="card" :animated="false">
          <TabPane label="策略日志">策略日志</TabPane>
          <TabPane label="策略报告">策略报告</TabPane>
        </Tabs>
        </Col>
        <Col span="10" class="split-pane-cell">
        <Tabs type="card" :animated="false">
          <TabPane label="账户" name="accounts">
            <table-accounts/>
          </TabPane>
          <TabPane label="持仓" name="positions">
            <table-positions :height="paneHeight"/>
          </TabPane>
          <TabPane label="委托单" name="orders">
            <table-orders :height="paneHeight"/>
          </TabPane>
          <TabPane label="成交记录" name="trades">
            <table-trades :height="paneHeight"/>
          </TabPane>
        </Tabs>
        </Col>
      </Row>
    </div>
  </Split>
</template>

<script>
  import { mapGetters } from 'vuex'
  //  import TableQuotes from '@/components/tables/TableQuotes.vue'

  import TableQuotes from '@/components/tableQuotes/Table.vue'
  import { QuotesTableRow } from '@/config'
  import Chart from '@/components/Chart/index.vue'
  import Tags, { InitTagsQuotesMap } from '@/store/tags'

  import FutureLogin from '@/components/forms/FutureLogin.vue'
  import FutureTrade from '@/components/forms/FutureTrade.vue'
  import Confirm from '@/components/UserConfirmSettlement.vue'

  import TableAccounts from '@/components/tables/TableAccounts.vue'
  import TablePositions from '@/components/tables/TablePositions.vue'
  import TableOrders from '@/components/tables/TableOrders.vue'
  import TableTrades from '@/components/tables/TableTrades.vue'

  export default {
    components: {
      TableQuotes,
      Chart,
      FutureTrade,
      FutureLogin,
      Confirm,
      TableAccounts,
      TablePositions,
      TableOrders,
      TableTrades
    },
    computed: {
      quotesList: function () {
        return this.$store.state.tagsQuotesMap[this.$route.params.tag]
      }
    },
    data: function () {
      let defaultTag = this.$route.params.tag // 只初始化一次就不再改变
      return {
        selectedTag: defaultTag,
        tags: Tags.map(x => x.id),
        instrumentId: 'SHFE.au1912',
        height: 400,
        paneHeight: 400,
        quotesTableRow: QuotesTableRow
      }
    },
    mounted () {
      this.height = window.innerHeight / 2 - this.$refs.btns.$el.clientHeight - 2
      this.paneHeight = window.innerHeight / 2 - 48

      this.$store.subscribe((mutation, state) => {
        // 订阅事件，任何地方选中某行，都会更新这个组件
        if (mutation.type === 'SET_SELECTED_SYMBOL') {
          this.instrumentId = mutation.payload
        }
      })

      //    this.$on('tqsdk:notify', function (notify) {
      //      if (notify.level === 'INFO') {
      //        if (notify.type === 'SETTLEMENT') {
      //          this.$store.commit('SET_SETTLEMENT', notify)
      //        } else if (notify.type === 'MESSAGE') {
      //          this.$Message.info(notify.content)
      //        }
      //      } else if (notify.level === 'WARNING' || notify.level === 'ERROR') {
      //        this.$Message.error(notify.bid + ' ' + notify.user_id + '\n' + notify.content)
      //      }
      //    })
    },
    methods: {
      handlerChangeTag (tag) {
        this.$router.replace({ name: 'dashboard', params: { tag } })
      }
    }
  }
</script>

<style>
  .split-vertical-line {
    background-color: #f3f3f3;
    height: 2px;
  }

  .split-pane {
    height: 100%;
  }

  .split-pane-cell {
    height: 100%;
    padding-top: 2px;
  }

  .border-right {
    padding-right: -2px;
    border-right: solid #f3f3f3 2px;
  }
</style>
