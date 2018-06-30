const app = getApp();
const util = require('../../../../../utils/util.js');

Page({
  data: {
    bookData: {},
    libCollectionData: [],
    libSiteData: []
  },

  libCollection() {
    var that = this;
    var url = app.globalData.url + '/api/book-site';
    var params = {
      ctrl_no: this.data.bookData.CtrlNo,
      ctrl_rd: this.data.bookData.CtrlRd
    }
    util.requestQuery(url, params, 'GET', function (res) {
      var result = res.data;
      if(result.code === 200) {
        that.setData({
          libCollectionData: result.data.collection,
          libSiteData: result.data.site
        });
      }
    }, function () {
      console.warn('Error');
    }, function () {
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookId = options.bookid;
    var prev = util.getPrevPage();
    var prevBookData = prev.data.bookLists;
    var book = prevBookData[bookId];
    this.setData({
      bookData: book
    });
    this.libCollection();
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