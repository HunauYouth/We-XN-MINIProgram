const app = getApp();
const util = require('../../../utils/util.js');

Page({

  data: {
    tabs: ["失物招领", "寻物启事"],
    activeIndex: 0,
    lostData: [],
    lostPage: {},
    lostNextFlag: 1,
    foundData: [],
    foundPage: {},
    foundNextFlag: 1
  },

  onPullDownRefresh: function() {
    this.getLostAndFound('lost');
    this.getLostAndFound('found');
    wx.stopPullDownRefresh();
  },

  nextPage: function(e) {
    var category = e.currentTarget.dataset.category;
    if (category === 'lost') {
      var pages = this.data.lostPage;
      if (pages.current_page >= pages.total_pages) {
        this.setData({
          lostNextFlag: 0
        });
        return false;
      }

    } else if (category === 'found') {
      var pages = this.data.foundPage;
      if (pages.current_page >= pages.total_pages) {
        this.setData({
          foundNextFlag: 0
        });
        return false;
      }
    }

    var nextPage = pages.current_page + 1;
    this.getLostAndFound(category, nextPage);
  },

  getLostAndFound: function(category, page = 0) {
    var that = this;
    var url = 'http://localhost:3030/api/lost_and_found';
    var params = {
      category: category,
      page: page
    };
    util.requestQuery(url, params, 'GET', function(res) {
      var result = res.data;
      if (result.status === 200) {
        if (category == 'lost') {
          if (result.data.page.current_page < result.data.page.total_pages) {
            that.setData({
              lostNextPage: 1
            });
          }
          that.setData({
            lostData: that.data.lostData.concat(result.data.lost_founds),
            lostPage: result.data.page,
          });
        } else if (category == 'found') {
          if (result.data.page.current_page < result.data.page.total_pages) {
            that.setData({
              foundNextPage: 1
            });
          }
          that.setData({
            foundData: that.data.foundData.concat(result.data.lost_founds),
            foundPage: result.data.page
          });
        }
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '网络超时了=。='
      });
    });
  },

  onLoad: function() {
    var that = this;
    this.getLostAndFound('lost');
    this.getLostAndFound('found');
  },

  tabClick: function(e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})