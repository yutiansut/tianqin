<template>
  <div v-if="$store.state.logined">
    <Table :height="height" :columns="columns" :data="ordersArr"></Table>
  </div>
</template>

<script>
  import {
    FormatDatetime,
    FormatPrice,
    FormatDirection,
    FormatOffset,
    FormatStatus,
    ObjectToArray
  } from '@/plugins/utils'

  export default {
    data () {
      return {
        ordersArr: [],
        columns: [
          {
            title: '委托单ID',
            key: 'order_id',
            width: 120,
            fixed: 'left'
          },
          {
            title: '合约',
            key: 'instrument_id',
            width: 80,
            align: 'center'
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
            key: 'volume_orign',
            width: 60,
            align: 'right'
          },
          {
            title: '价格',
            key: 'limit_price',
            width: 80,
            align: 'right'
          },
          {
            title: '未成交',
            key: 'volume_left',
            width: 70,
            align: 'right'
          },
          {
            title: '操作',
            key: 'action',
            width: 80,
            align: 'center',
            render: (h, params) => {
              let btn = h('Button', {
                props: {
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleCancelOrder(params.index, params.row)
                  }
                }
              }, '撤单')
              return params.row.status === 'ALIVE' ? h('div', [btn]) : h('div', [])
            }
          },
          {
            title: '状态',
            key: 'status',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return params.row.status === 'FINISHED' ? h('div', '已完成') : h('div', '未完成')
            }
          },
          {
            title: '下单时间',
            key: 'insert_date_time',
            width: 180,
            align: 'right',
            render: (h, params) => {
              return h('div', FormatDatetime(params.row.insert_date_time))
            }
          },
          {
            title: '提示',
            key: 'last_msg',
            width: 180,
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
        let orders = this.$tqsdk.get({ name: 'orders', user_id: this.$store.state.user_id })
        if (orders && this.$tqsdk.is_changed(orders)) {
          ObjectToArray(orders, this.ordersArr, 'order_id', () => 1)
        }
      })
    },
    methods: {
      filterStatus (value, row) {
        return row.status === value
      },
      handleCancelOrder (index, row) {
        this.$tqsdk.cancel_order({
          user_id: this.$store.state.user_id,
          order_id: row.order_id
        })
      },
      rowClick (row, event, column) {
        let symbol = row.exchange_id + '.' + row.instrument_id
        this.$store.commit('SET_SELECTED_SYMBOL', symbol)
      }
    }
  }
</script>
