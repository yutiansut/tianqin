<template>
  <div class="tq-table-container" @scroll="handleScroll" :style="{height:'100%'}">
    <table id="QuotesTable">
      <thead>
      <tr>
        <td v-for="(item, index) in tableCol" :key="index">
          <div :style="computeStyleObj(item)">{{item['name']}}</div>
        </td>
      </tr>
      </thead>
      <tbody>
      <table-row v-for="(item) in contentList" :key="item" :symbol="item"
                 :tableCol="tableCol"
                 @rowClick="rowClick" @rowDbClick="rowDbClick"
                 :class="{selected: item === selectedSymbol}"></table-row>
      </tbody>
    </table>
  </div>
</template>

<script>
  import TableRow from './TableQuotesRow.vue'
  export default {
    data () {
      return {
        selectedSymbol: ''
      }
    },
    components: {
      TableRow
    },
    props: {
      height: {
        type: String
      },
      tableCol: {
        type: Array
      },
      contentList: {
        type: Array
      }
    },
    beforeMount () {
    },
    beforeUpdate () {
    },
    updated () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    computed: {},
    watch: {
      contentList () {
        this.$tqsdk.subscribe_quote(this.contentList)
      }
    },
    methods: {
      handleScroll: function (e) {
        // console.log(e.target.scrollLeft, e.target.scrollTop)
      },
      computeStyleObj: function (item) {
        let styleObj = {}
        if (item['width']) {
          styleObj['width'] = item['width'] + 'px'
        }
        return styleObj
      },
      rowClick (quote) {
        this.$store.commit('SET_SELECTED_SHOW_SYMBOL', quote.instrument_id)
        if (quote.class === 'FUTURE') {
          this.$store.commit('SET_SELECTED_SYMBOL', quote.instrument_id)
        } else if (quote.class === 'FUTURE_CONT') {
          this.$store.commit('SET_SELECTED_SYMBOL', quote.underlying_symbol)
        }
        this.selectedSymbol = quote.instrument_id
      },
      rowDbClick (symbol) {
        //        this.$router.push({ name: 'charts', params: { instrument_id: symbol.instrument_id } })
      },
      cellStyle ({ row, column, rowIndex, columnIndex }) {
        if (['最新价', '涨跌', '涨跌幅', '今开盘', '最高价', '最低价'].includes(column.label) && row.change % 1 === 0 && row.change !== 0) {
          return {
            color: row.change > 0 ? 'red' : 'green'
          }
        }
        return {
          color: 'black'
        }
      }
    }
  }
</script>

<style lang="scss">
  .tq-table-container {
    width: 100%;
    overflow: scroll;
    padding-left: 4px;
    margin-left: -4px;
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 12px;
    }
    &::-webkit-scrollbar-thumb {
      height: 12px;
      background: #b7b7b7;
    }
    table {
      border-spacing: 0px;
      color: #000000;
    }
    table tr.selected td {
      background: #effefe;
    }
    // 首行
    table thead th,
    table thead td {
      border-top: 1px solid #dddddd;
      background-color: #fafafa;
      position: sticky;
      top: 0;
      z-index: 20;
      &:first-child {
        z-index: 21;
        left: 0;
      }
      // 首行文字样式
      font-weight: 600;
      text-align: center;
    }
    // 首列
    table tbody th:first-child,
    table tbody td:first-child {
      border-left: 1px solid #dddddd;
      position: sticky;
      text-align: left;
      left: 0;
      z-index: 19;
    }
    table th,
    table td {
      padding: 5px 3px;
      white-space: nowrap;
      border-bottom: 1px solid #dddddd;
      border-right: 1px solid #dddddd;
      // 默认单元格样式
      text-align: right;
      background-color: #ffffff;
      font-size: 12px;

      // 某一列的背景色
      &.col-buy {
        background-color: #fff6f6
      }
      &.col-sell {
        background-color: #f6fff6
      }
      // 某一格文字颜色
      &.R {
        color: #f33d4e
      }
      &.G {
        color: #26943b
      }
      // 默认单元格宽度
      div {
        width: 100px;
      }
      div.appendix {
        font-size: 10px;
      }
      div.data-content:after {
        content: attr(data-content);
      }
    }
    table tr.selected {
      // 选中行背景色
      background-color: #f0f0ff
    }
  }

</style>
