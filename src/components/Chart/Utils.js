import * as d3 from 'd3'
let formatMillisecond = d3.timeFormat('.%L')
let formatSecond = d3.timeFormat(':%S')
let formatMinute = d3.timeFormat('%H:%M')
let formatHour = d3.timeFormat('%H:%M')
let formatDay = d3.timeFormat('%m%d')
let formatMonth = d3.timeFormat('%m%d')
let formatYear = d3.timeFormat('%y')

function MultiFormat (date) {
  return (d3.timeSecond(date) < date ? formatMillisecond
    : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
          : d3.timeMonth(date) < date ? formatDay
            : d3.timeYear(date) < date ? formatMonth
              : formatYear)(date)
}

const ArrayJoin = (array, delimiter = ' ') => {
  if (!array.length) return ''
  return array.join(delimiter)
}

const UpDown = {
  up: (d) => d.open <= d.close,
  down: (d) => d.open > d.close
}
const UpDownKeys = Object.keys(UpDown)

const UpDownEqual = {
  up: (d) => d.open < d.close,
  down: (d) => d.open > d.close,
  equal: (d) => d.open === d.close
}
const UpDownEqualKeys = Object.keys(UpDownEqual)

export {
  UpDown,
  UpDownKeys,
  UpDownEqual,
  UpDownEqualKeys,
  ArrayJoin,
  MultiFormat
}
