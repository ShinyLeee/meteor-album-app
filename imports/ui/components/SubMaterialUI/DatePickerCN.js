import React from 'react';
import DatePicker from 'material-ui/DatePicker'; // eslint-disable-line import/no-unresolved
import warning from 'warning';

const dayAbbreviation = ['日', '一', '二', '三', '四', '五', '六'];
const dayList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const monthList = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const monthLongList = monthList;

function dateTimeFormat(locale, options) {
  warning(locale === 'zh-CN', `Material-UI: The ${locale} locale is not supported by the built-in DateTimeFormat.
  Use the \`DateTimeFormat\` prop to supply an alternative implementation.`);

  this.format = (date) => {
    if (options.month === 'short' && options.weekday === 'short' && options.day === '2-digit') {
      return `${monthList[date.getMonth()]}${date.getDate()}日 ${dayList[date.getDay()]}`;
    } else if (options.year === 'numeric' && options.month === 'numeric' && options.day === 'numeric') {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    } else if (options.year === 'numeric' && options.month === 'long') {
      return `${date.getFullYear()}年 ${monthLongList[date.getMonth()]}`;
    } else if (options.weekday === 'narrow') {
      return dayAbbreviation[date.getDay()];
    } else if (options.year === 'numeric') {
      return date.getFullYear().toString();
    } else if (options.day === 'numeric') {
      return date.getDate();
    }
    warning(false, 'Material-UI: Wrong usage of DateTimeFormat');
    return false;
  };
}

const DatePickerCN = (props) => (
  <DatePicker
    {...props}
    okLabel="确定"
    cancelLabel="取消"
    DateTimeFormat={dateTimeFormat}
    locale="zh-CN"
  />
);

export default DatePickerCN;
