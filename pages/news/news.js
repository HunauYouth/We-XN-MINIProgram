const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    generalNews: [],
    generalPage: {},
    supportNews: [],
    supportPage: {},
    xshdNews: [],
    xshdPage: {},
    tabs: ["新闻动态", "后勤通知", "学术活动"],
    activeIndex: 0,
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  tapShowNews: function (e) {
    wx.navigateTo({
      url: 'show_news/show_news?news_id=' + e.currentTarget.id
    })
  },

  nextPage: function (e) {
    var category = e.currentTarget.dataset.flag;
    if(category === 'general') {
      if(this.data.generalPage.current_page < this.data.generalPage.total_pages) {
        this.getNews(category, this.data.generalPage.current_page + 1);
      } else {
        return false;
      }
    } else if (category === 'support') {
      if(this.data.supportPage.current_page < this.data.supportPage.total_pages) {
        this.getNews(category, this.data.supportPage.current_page + 1);
      } else {
        return false;
      }
    } else if (category === 'xshd') {
      if(this.data.xshdPage.current_page < this.data.xshdPage.total_pages) {
        this.getNews(category, this.data.xshdPage.current_page + 1);
      } else {
        return false;
      }
    }
  },

  getNews: function (category, page) {
    var that = this;
    var url = app.globalData.url + '/api/news' + '?category=' + category + '&page=' + page;
    util.requestQuery(url, '', 'GET', function (res) {
      var news = {};
      news.pages = res.data.data.page;
      news.lists = res.data.data.news;
      if(category === 'general') {
        that.setData({
          generalNews: that.data.generalNews.concat(news.lists),
          generalPage: news.pages
        });
      } else if (category === 'support') {
        that.setData({
          supportNews: that.data.supportNews.concat(news.lists),
          supportPage: news.pages
        });
      } else if (category === 'xshd') {
        that.setData({
          xshdNews: that.data.xshdNews.concat(news.lists),
          xshdPage: news.pages
        });
      }

    }, function () {
    });
  },

  onLoad: function () {
    this.getNews('general', 1);
    this.getNews('support', 1);
    this.getNews('xshd', 1);
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onShareAppMessage: function () {

  }
})
