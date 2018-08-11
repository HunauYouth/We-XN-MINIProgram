const app = getApp();
const util = require("../../utils/util.js");

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: true
  },

  showPopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.show();
  },
  hidePopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.hide();
  },
  
  formSubmit: function (e) {

    if(this.checkForm(e)) {
      wx.showLoading({
        title: '正在认证∩＿∩',
      });
      var stu_user = {}
      stu_user.stu_number = e.detail.value.stu_number
      stu_user.stu_password = e.detail.value.stu_password
      this.requestXnService(stu_user);
    } else {
      console.warn('Form Warn')
    }
  },

  checkForm: function (e) {
    var formValue = e.detail.value
    if (formValue["stu_number"] == "") {
      wx.showToast({
        title: '请输入学号ಠ_ಠ',
        icon: "none"
      });
      return false;
    }
    if (formValue["stu_password"] == "") {
      wx.showToast({
        title: '请输入密码ಠ_ಠ',
        icon: "none"
      });
      return false;
    }
    return true;
  },
  requestXnService: function (stu_user) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: app.globalData.url + '/api/bind-stu-user',
            data: {
              'stu_user[stu_number]': stu_user.stu_number,
              'stu_user[stu_password]': stu_user.stu_password,
              'code': res.code
            },
            method: "GET",
            header: {
              "accept": "application/vnd.api+json;version=1",
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.status == 400) {
                wx.showToast({
                  title: res.data.message + ':' + res.data.message_detail,
                  icon: 'none'
                });
              }
              if (res.data.status == 200) {
                wx.hideLoading();
                wx.setStorage({
                  key: 'stuUserInfo',
                  data: res.data.data,
                  success: function() {
                    wx.showToast({
                      title: '认证成功（＾∀＾）',
                      icon: 'success',
                      success: function () {
                        wx.reLaunch({
                          url: '/pages/index/index',
                        });
                      }
                    });
                  }    
                });
              }
            }
          });
        } else {
          console.warn('获取用户登录态失败！' + res.errMsg)
          wx.showToast({
            title: '发生了意料之外的错误，请重启使用（＞﹏＜）'
          });
          wx.switchTab({
            url: '/pages/index/index',
          });
        }
      }
    })
  },
  onLoad: function () {

    wx.showToast({
      icon: 'none',
      title: '欢迎新同学(・∀・)',
    });
  }
})