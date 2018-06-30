// pages/index/ts/result/result.js
const app = getApp();

Page({

  data: {
    pages: {},
    bookLists: [],
    nextFlag: false,
    pageNumber: 1,
    pageSize: 0,
    currentPage: 1,
  },

  nextPage() {
    if (!this.data.nextFlag) {
      return false;
    }
    var page = this.data.pageNumber += 1;
    if (page == this.data.currentPage) {
      console.log('Repeat');
      return false;
    }
    if (page > this.data.pageSize) {
      this.setData({
        nextFlag: false
      });
      return false;
    }
    this.searchBook(this.data.key, page);
  },

  searchBook(key, page) {
    var that = this;
 
    wx.request({
      url: app.globalData.url + '/api/book-search',
      method: 'GET',
      data: {
        'book_name': key,
        'page_no': page
      },
      success: res => {
        var result = res.data.data;
        var nextFlag = false;

        if (result.pages.FindCount - result.pages.PageCount > 0) {
          nextFlag = true;
          var pageNumber = page;
          var pageSize = Math.ceil(result.pages.FindCount / 100)
          that.setData({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
          });
        }

        that.setData({
          "pages": result.pages,
          "bookLists": that.data.bookLists.concat(result.lists),
          "nextFlag": nextFlag,
          "currentPage": page
        });

        wx.setNavigationBarTitle({
          title: '检索结果' + result.pages.FindCount + '个'
        });
      }
    })
  },

  onClick(event) {
    var bookId = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './bookinfo/bookinfo?bookid=' + bookId
    });
  },

  onLoad: function(options) {
    this.setData({
      key: options.key
    });
    this.searchBook(options.key, this.data.pageNumber);
  },

  onReady: function() {

  },


  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})