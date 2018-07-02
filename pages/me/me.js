//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    stuUserInfo: {},
    hasStuUserInfo: false
  },

  addQQGroup: function () {
    wx.setClipboardData({
      data: '815191583',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            });
          }
        })
      }
    })
  },

  bindUserTap: function () {
    wx.navigateTo({
      url: '../bind_user/bind_user'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
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
