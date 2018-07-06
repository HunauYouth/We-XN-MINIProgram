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
    url: 'https://api.xnqn.com',
    /*url: 'http://staging-api.iewad.me',*/
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
          var url_str = this.globalData.url + '/api/wx-login';
          var params = {
            code: code
          }
          util.requestQuery(url_str, params, 'GET', function (res) {
            if (res.data.status === 200) {
              wx.showToast({
                icon: 'none',
                title: '登录成功',
              });
              that.globalData.stuUserInfo = res.data.data
              wx.setStorage({
                key: 'stuUserInfo',
                data: res.data.data,
              });
            } else if (res.data.status === 400) {
              wx.showToast({
                icon: 'none',
                title: '登录失败了'
              });
            }
          }, function () {
            wx.showToast({
              icon: 'none',
              title: '登录失败了'
            });
          }, function () {
          });
        }
      }
    })
  }
})
