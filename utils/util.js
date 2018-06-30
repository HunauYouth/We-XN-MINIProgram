const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = (date, formatChar) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  if (formatChar != null) {
    return [year, month, day].map(formatNumber).join(formatChar);
  } else {
    return [year, month, day].map(formatNumber).join('');
  }
}

const requestQuery = (url, data, method, success, fail, complete) => {
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      "accept": "application/vnd.api+json;version=1",
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      success && success(res);
    },
    fail: function (res) {
      fail && fail(res);
    },
    complete: function (res) {
      complete && complete(res);
    }
  })
  console.log("-----------End ------ Request ---------")
}

const getPrevPage = () => {
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];//上一个页面
  return prevPage;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  requestQuery: requestQuery,
  getPrevPage: getPrevPage
}
