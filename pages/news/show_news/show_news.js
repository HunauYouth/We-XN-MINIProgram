const app = getApp();
const util = require('../../../utils/util.js');

Page({

  data: {
    news: {}
  },

  getNews: function (news_id) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/news/' + news_id,
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        var news = {};
        news = res.data.data;
        news.addtime = util.formatDate(new Date(news.addtime* 1000), '-');
        var contentStr = news.content;
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = contentStr.match(imgReg);
        contentStr = contentStr.replace(/.UploadImage/g, "http://zsxy.hunau.edu.cn/UploadImage");
        news.content = contentStr;
        that.setData({ news: news });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews(options.news_id);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
