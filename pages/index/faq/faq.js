const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    faqData: []
  },

  openFaq: function (e) {
    var faqId = e.currentTarget.dataset.faqid;
    var faqItem = this.data.faqData[faqId];
    wx.showModal({
      title: faqItem.question,
      content: faqItem.answer,
      showCancel: false,
      confirmText: '已阅'
    });
  },

  setFaq: function () {
    var that = this;
    var url = app.globalData.url + '/api/faqs';
    util.requestQuery(url, '', 'GET', function (res) {
      var result = res.data;
      if(result.status === 200) {
        var faqData = result.data;
        faqData.forEach(function(element){
          var created_at = new Date(element.created_at);
          element.created_at = util.formatDate(new Date(created_at), '-');
        })
        that.setData({ faqData: result.data });
      }
    })
  },

  onLoad: function (options) {
    this.setFaq();
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})