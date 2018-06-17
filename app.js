//app.js
const Towxml = require('/towxml/main');
const util = require('utils/util.js')

App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function (res) {
        wx.checkSession({
          success: function () {
            console.log('Session Ok')
          },
          fail: function () {
            console.log('Session Fail')
          },
          complete: function () {

          }
        });
      },
      fail: function () {
        that.appLogin();
      }
    });
  },

  globalData: {
    userInfo: null,
    url: 'https://api.xnqn.com',
    /*url: 'http://localhost:3030',*/
    stuUserInfo: ''
  },

  towxml: new Towxml(),

  appLogin: function () {
    wx.login({
      success: res => {
        var code = res.code;
        var that = this;
        if (code) {
          console.log('获取凭证=>' + code);
          var url_str = this.globalData.url + '/api/wx-login';
          console.log(url_str);
          var params = {
            code: code
          }
          util.requestQuery(url_str, params, 'GET', function (res) {
            console.log(res.data)
            if (res.data.status === 'success') {
              that.globalData.stuUserInfo = res.data.data
              wx.setStorage({
                key: 'stuUserInfo',
                data: res.data.data,
              });
            } else if (res.data.status === 'failed') {
              console.warn('Login Failed');
            }
          }, function (res) {
            console.log('Failed');
          }, function (res) {
            console.log('Complete')
          });
        }
      }
    })
  }
})