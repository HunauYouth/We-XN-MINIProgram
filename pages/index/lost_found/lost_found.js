const app = getApp();
const util = require('../../../utils/util.js');

Page({

  data: {
    tabs: ["失物招领", "寻物启事"],
    activeIndex: 0,
    lostData: [],
    lostPage: {},
    lostNextFlag: 0,
    foundData: [],
    foundPage: {},
    foundNextFlag: 0
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
    var url = app.globalData.url + '/api/lost_and_found';
    var params = {
      category: category,
      page: page
    };
    util.requestQuery(url, params, 'GET', function(res) {
      var result = res.data;
      if (result.status === 200) {
        if (category == 'lost') {
          that.setData({
            lostData: that.data.lostData.concat(result.data.lost_founds),
            lostPage: result.data.page,
          });
          if (result.data.page.current_page < result.data.page.total_pages) {
            that.setData({
              lostNextFlag: 1
            });
          } else {
            that.setData({
              lostNextFlag: 0
            });
          }
        } else if (category == 'found') {
          that.setData({
            foundData: that.data.foundData.concat(result.data.lost_founds),
            foundPage: result.data.page
          });
          if (result.data.page.current_page < result.data.page.total_pages) {
            that.setData({
              foundNextFlag: 1
            });
          } else {
            that.setData({
              foundNextFlag: 0
            });
          }
        }
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '网络出错了=。='
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
