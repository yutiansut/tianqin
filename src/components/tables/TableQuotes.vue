<template>
    <Table border
           class="tq-table-container"
           :columns="columns"
           :data="tableData"
           :height="height"
           :size="size">
        <template v-slot:last_price="{ row }">
            <strong :class="row['change'] > 0 ? 'R' : (row['change'] < 0 ? 'G' : '')">{{ row['last_price'] | toFixed(row['price_decs'])}}</strong>
        </template>
        <template v-slot:change="{ row }">
            <strong :class="row['change'] > 0 ? 'R' : (row['change'] < 0 ? 'G' : '')">{{ row['change'] | toFixed(row['price_decs'])}}</strong>
        </template>
        <template v-slot:change_percent="{ row }">
            <strong :class="row['change'] > 0 ? 'R' : (row['change'] < 0 ? 'G' : '')">{{ row['change_percent'] | toFixed(row['price_decs'])}}</strong>
        </template>
        <template v-slot:volume="{ row }">
            <strong :class="row['change'] > 0 ? 'R' : (row['change'] < 0 ? 'G' : '')">{{ row['volume']}}</strong>
        </template>
        <template v-slot:upper_limit="{ row }">
            {{ row['upper_limit'] | toFixed(row['price_decs'])}}
        </template>
        <template v-slot:lower_limit="{ row }">
            {{ row['lower_limit'] | toFixed(row['price_decs'])}}
        </template>
    </Table>
</template>
<script>
  export default {
    components: {},
    props: {
      height: {
        type: Number,
        default: 400
      },
      quotesList: {
        type: Array
      }
    },
    computed: {},
    data: function () {
      return {
        size: 'small',
        tableData: [],
        columns: [
          {
            title: '合约名称',
            key: 'ins_name',
            width: 100,
            align: 'center'
          },
          {
            title: '最新价',
            key: 'last_price',
            width: 80,
            align: 'right',
            slot: 'last_price'
          },
          {
            title: '买价',
            key: 'bid_price1',
            width: 80,
            className: 'col-buy',
            align: 'right'
          },
          {
            title: '买量',
            key: 'bid_volume1',
            width: 80,
            className: 'col-buy',
            align: 'right'
          }, {
            title: '卖价',
            key: 'ask_price1',
            width: 80,
            className: 'col-sell',
            align: 'right'
          }, {
            title: '卖量',
            key: 'ask_volume1',
            width: 80,
            className: 'col-sell',
            align: 'right'
          },
          {
            title: '涨跌',
            key: 'change',
            width: 80,
            slot: 'change',
            align: 'right'
          },
          {
            title: '涨跌幅',
            key: 'change_percent',
            width: 120,
            align: 'right',
            slot: 'change_percent'
          }, {
            title: '成交量',
            key: 'volume',
            width: 120,
            align: 'right',
            slot: 'change_percent'
          }, {
            title: '持仓量',
            key: 'open_interest',
            width: 120,
            align: 'right'
          }
        //          {
        //            title: '涨停价',
        //            key: 'upper_limit',
        //            width: 120,
        //            align: 'right',
        //            slot: 'upper_limit'
        //          },
        //          {
        //            title: '跌停价',
        //            key: 'lower_limit',
        //            width: 120,
        //            align: 'right',
        //            slot: 'lower_limit'
        //          }, {
        //            title: '今开盘',
        //            key: 'open',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return FormatPrice(item['open'], item['price_decs'])
        /// /            }
        //          }, {
        //            title: '最低价',
        //            key: 'lowest',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return FormatPrice(item['lowest'], item['price_decs'])
        /// /            }
        //          },
        //          {
        //            title: '最高价',
        //            key: 'highest',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return FormatPrice(item['highest'], item['price_decs'])
        /// /            }
        //          }, {
        //            title: '昨收盘',
        //            key: 'pre_close',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return FormatPrice(item['pre_close'], item['price_decs'])
        /// /            }
        //          }, {
        //            title: '昨结算',
        //            key: 'pre_settlement',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return FormatPrice(item['pre_settlement'], item['price_decs'])
        /// /            }
        //          }, {
        //            title: '行情更新时间',
        //            key: 'datetime',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return item['datetime'] ? item['datetime'].slice(11, 19) : ''
        /// /            }
        //          }, {
        //            title: '合约乘数',
        //            key: 'volume_multiple',
        //            width: 120
        //          }, {
        //            title: '最后交易日',
        //            key: 'expire_datetime',
        //            width: 120
        /// /            formatter: function (item) {
        /// /              return item['expire_datetime'] ? FormatDatetime(item['expire_datetime'] * 1000).slice(0, 10) : ''
        /// /            }
        //          }
        ],
        helperColumns: ['price_decs']
      }
    },
    watch: {
      quotesList () {
        this.tableData = []
        this.$tqsdk.subscribe_quote(this.quotesList)
        this.updateData()
      }
    },
    methods: {
      updateData () {
        let data = []
        for (let i in this.quotesList) {
          let quote = this.$tqsdk.get({ name: 'quote', symbol: this.quotesList[i] })
          if (!this.tableData[i] || this.tableData[i]['instrument_id'] !== this.quotesList[i]) {
            this.$set(this.tableData, i, {})
            for (let col of this.helperColumns) {
              this.$set(this.tableData[i], col, quote[col])
            }
          }
          for (let colIndex in this.columns) {
            let key = this.columns[colIndex]['key']
            if (this.tableData[i][key] !== quote[key]) {
              this.tableData[i][key] = quote[key]
            }
          }
        }
      }
    },
    mounted () {
      this.$on('tqsdk:rtn_data', function () {
        this.updateData()
      })
    }
  }
</script>

<style lang="scss">
    .tq-table-container {
        table th,
        table td {
            .ivu-table-cell {
                padding-left: 4px;
                padding-right: 4px;
            }
            // 某一列的背景色
            &.col-buy {
                background-color: #fff6f6
            }
            &.col-sell {
                background-color: #f6fff6
            }
            // 某一格文字颜色
            .R {
                color: #fa3423
            }
            .G {
                color: #26943b
            }
        }
    }

</style>

<!--type	列类型，可选值为 index、selection、expand、html	String	- -->
<!--title	列头显示文字	String	#-->
<!--key	对应列内容的字段名	String	- -->
<!--width	列宽	Number	- -->
<!--minWidth	最小列宽	Number	- -->
<!--maxWidth	最大列宽	Number	- -->
<!--align	对齐方式，可选值为 left 左对齐、right 右对齐和 center 居中对齐	String	left-->
<!--className	列的样式名称	String	- -->
<!--fixed	列是否固定在左侧或者右侧，可选值为 left 左侧和 right 右侧	String	- -->
<!--ellipsis	开启后，文本将不换行，超出部分显示为省略号	Boolean	false-->
<!--tooltip	开启后，文本将不换行，超出部分显示为省略号，并用 Tooltip 组件显示完整内容	Boolean	false-->
<!--render	自定义渲染列，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引，详见示例。 学习 Render 函数的内容	Function	- -->
<!--renderHeader	自定义列头显示内容，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 column 和 index，分别为当前列数据和当前列索引。	Function	- -->
<!--indexMethod	type 为 index 时可用，自定义序号	Function，参数 row 为当前行内容	- -->
<!--sortable	对应列是否可以排序，如果设置为 custom，则代表用户希望远程排序，需要监听 Table 的 on-sort-change 事件	Boolean | 'custom'	false-->
<!--sortMethod	自定义排序使用的方法，接收三个参数 a 、 b 和 type，当设置 sortable: true 时有效。type 值为 asc 和 desc	Function	- -->
<!--sortType	设置初始化排序。值为 asc 和 desc	String	- -->
<!--filters	过滤数据的选项，格式为数组，数组中每项包含 label 和 value 属性，使用过滤，必须同时配置 filterMethod	Array	- -->
<!--filterMethod	数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示	Function	- -->
<!--filterMultiple	数据过滤的选项是否多选	Boolean	true-->
<!--filteredValue	在初始化时使用过滤，数组，值为需要过滤的 value 集合	Array	- -->
<!--filterRemote	使用远程过滤	Function	- -->
<!--children	表头分组	Array	- -->
