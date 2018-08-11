//app.js
const Towxml = require('/towxml/main');
const util = require('utils/util.js');

App({
  onLaunch: function() {},

  globalData: {
    url: 'https://api.xnqn.com',
    /*url: 'http://staging-api.iewad.me',*/
    /*url: 'http://localhost:3030',*/
    stuUserInfo: ''
  },

  towxml: new Towxml(),

  getUser: function() {
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '正在登录♬',
    });
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          var code = res.code;
          if (code) {
            var url_str = that.globalData.url + '/api/wx-login';
            var params = {
              code: code
            };
            util.requestQuery(url_str, params, 'GET', function(res) {
              var result = res.data;
              if (result.status === 200) {
                wx.hideLoading();
                resolve(result);
              } else if (result.status === 400) {
                reject(result);
              }
            }, function() {
              wx.showToast({
                title: '网络错误,请使用重启大法=。=',
              });
            }, function() {
              wx.hideNavigationBarLoading();
            });
          }
        },
        fail: function() {
          console.warn('WXLogin Error');
        }
      });
    });
  }
})