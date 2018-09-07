//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    stuUserInfo: {},
    hasStuUserInfo: false
  },

  unbind: function () {
    console.log(this.data.stuUserInfo.id);
    var url = app.globalData.url + '/api/unbind';
    var params = {
      id: this.data.stuUserInfo.id
    }
    util.requestQuery(url, params,'GET', function(res) {
      console.log(res);
      var result = res.data;
      if (result.status == 200) {
        console.log(result.message);
        wx.showModal({
          title: '提示',
          content: result.message,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: "/pages/index/index"
              });
            }
          }
        });
        wx.clearStorage();
      }
    }, function() {
      console.warn("error");
    })
  },

  bindUserTap: function () {
    wx.navigateTo({
      url: '../bind_user/bind_user'
    })
  },

  onLoad: function () {
    this.getStuUserInfo();
  },

  getStuUserInfo: function (e) {
    wx.getStorage({
      key: 'stuUserInfo',
      success: res => {
        this.setStuUserInfo(res.data);
      },
      fail: function () {
        console.log('Get stu_userinfo failed')
      }
    });
  },

  setStuUserInfo: function (stuUserInfo) {
    this.setData({
      stuUserInfo: stuUserInfo,
      hasStuUserInfo: true
    });
  },
  /**
   * 跳转到用户信息页面
   */
  onInfosTap() {
    wx.navigateTo({
      url: 'infos/infos',
    })
  }
})
