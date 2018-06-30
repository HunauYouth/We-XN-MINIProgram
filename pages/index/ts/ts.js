// pages/index/ts/ts.js
const app = getApp();

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    hotKeys: []
  },

  searchBook(e) {
    wx.navigateTo({
      url: './result/result?key=' + e.target.dataset.key
    });
  },

  onInput(e) {
    console.log('input: ', e.detail.value)
  },
  onConfirm(e) {
    console.log('confirm: ', e)
    wx.navigateTo({
      url: './result/result?key=' + e.detail.value
    });
  },
  onSearch(e) {
    console.log('onSearch: ', e)
  },

  setHotKeys() {
    var that = this;

    wx.request({
      url: app.globalData.url + '/api/hot-keys',
      data: '',
      method: 'GET',
      success: res => {
        console.log(res);
        var result = res.data;
        if(result.code === 200) {
          that.setData({
            hotKeys: result.data
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setHotKeys();
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