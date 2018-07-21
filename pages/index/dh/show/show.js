const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName: '',
    departmentData: []
  },

  makePhoneCall: function (e) {
    var phoneNumber = e.currentTarget.dataset.phonenumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  setDepartment: function (id, name) {
    wx.setNavigationBarTitle({
      title: name + '通讯录',
    });
    var that = this;
    var url = app.globalData.url + '/api/officephone/' + id;
    util.requestQuery(url, '', 'GET', function (res) {
      var result = res.data;
      if(result.status === 200) {
        that.setData({
          companyName: name,
          departmentData: result.data
        })
      }
    }, function () {

    }, function () {

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setDepartment(options.id, options.name);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})