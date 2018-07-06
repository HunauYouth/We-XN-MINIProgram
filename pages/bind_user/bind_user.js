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
      console.log("Input Data is OK");
      wx.showToast({
        title: '正在提交！',
        icon: 'loading'
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
        title: '学号不能为空',
        icon: "none"
      });
      return false;
    }
    if (formValue["stu_password"] == "") {
      wx.showToast({
        title: '密码不能为空',
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
        console.log(res)
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
                wx.hideToast();
                wx.setStorage({
                  key: 'stuUserInfo',
                  data: res.data.data,
                  success: function() {
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'success',
                      success: function () {
                        wx.reLaunch({
                          url: '../index/index'
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
            title: '发生了很奇怪的错误'
          });
          wx.reLaunch({
            url: '../index/index',
          });
        }
      }
    })
  },
  onLoad: function () {
  }
})