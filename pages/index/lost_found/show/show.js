const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  data: {
    pageData: ''
  },

  previwImg: function() {
    wx.previewImage({
      current: this.data.pageData.images.url,
      urls: [this.data.pageData.images.url]
    });
  },

  makePhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.pageData.tel
    });
  },

  showLostOrFoundData: function (id) {
    var that = this;
    var url = app.globalData.url + '/api/lost_and_found/' + id;

    util.requestQuery(url, '', 'GET', function(res) {
      var result = res.data;
      if(result.status === 200) {
        result.data.created_at = util.formatDate(new Date(result.data.created_at), '-')
        result.data.updated_at = util.formatDate(new Date(result.data.updated_at), '-')
        that.setData({ pageData: result.data });
      } else if (result.status >= 400) {
        wx.showToast({
          icon: 'failed',
          title: '记录不存在或已删除',
          success: () => {
            wx.redirectTo({
              url: '../../lost_found/lost_found'
            });
          }
        });
      }
    }, function () {
      wx.showToast({
        icon: 'none',
        title: '网络出错了~'
      });
    }, function () {
      wx.showToast({
        icon: 'none',
        title: '加载完成',
      });
    });
  },

  onLoad: function (options) {
    this.showLostOrFoundData(options.id);
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
