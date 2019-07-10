<template>
  <div v-if="$store.state.logined">
    <Table :height="height" :columns="columns" :data="tradesArr"></Table>
  </div>
</template>

<script>
  import { FormatDatetime, FormatPrice, FormatDirection, FormatOffset, ObjectToArray } from '@/plugins/utils'

  export default {
    data () {
      return {
        tradesArr: [],
        columns: [
          {
            title: '委托单ID',
            key: 'order_id',
            width: 120,
            fixed: 'left'
          },
          {
            title: '交易所单号',
            key: 'exchange_trade_id',
            width: 100,
            align: 'left'
          },
          {
            title: '合约',
            key: 'instrument_id',
            width: 80,
            align: 'left'
          },
          {
            title: '方向',
            key: 'direction',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h('div', FormatDirection(params.row.direction))
            }
          },
          {
            title: '开平',
            key: 'offset',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h('div', FormatOffset(params.row.offset))
            }
          },
          {
            title: '手数',
            key: 'volume',
            width: 60,
            align: 'right'
          },
          {
            title: '价格',
            key: 'price',
            width: 70,
            align: 'right',
            render: (h, params) => {
              return h('div', FormatPrice(params.row.price))
            }
          },
          {
            title: '时间',
            key: 'trade_date_time',
            width: 160,
            align: 'right',
            render: (h, params) => {
              return h('div', FormatDatetime(params.row.trade_date_time))
            }
          },
          {
            title: '手续费',
            key: 'commission',
            width: 80,
            align: 'right'
          }
        ]
      }
    },
    props: {
      height: {
        type: Number
      }
    },
    mounted () {
      this.$on('tqsdk:rtn_data', function () {
        let trades = this.$tqsdk.get({ name: 'trades', user_id: this.$store.state.user_id })
        if (trades && this.$tqsdk.is_changed(trades)) {
          ObjectToArray(trades, this.tradesArr, 'trade_id', () => 1)
        }
      })
    },
    methods: {
      filterInstrumentId (value, row) {
        return row.instrument_id === value
      }
    }
  }
</script>
