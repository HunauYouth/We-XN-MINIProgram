const app = getApp();
const util = require('../../utils/util.js');

import { Kb } from 'kb/kb-model.js';
import { Book } from '../../utils/book.js';
var kb = new Kb();
var book = new Book();


Page({
  data: {
    menuItems: [
      {
        name: '成绩查询',
        imagePath: '../../images/menu-grade.png',
        funcName: 'cj',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: '电费查询',
        imagePath: '../../images/menu-energy-charge.png',
        funcName: 'df',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png',
        funcName: 'kb',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png',
        funcName: 'jy',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png',
        funcName: 'ykt',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: '图书检索',
        imagePath: '../../images/menu-book.png',
        funcName: 'ts',
        funcType: 'nav',
        funcStatus: true
      },
      {
        name: 'QQ群',
        imagePath: '../../images/menu-qqgroup.png',
        funcType: 'static',
        funcName: 'qq',
        funcStatus: true
      },
      {
        name: '办公电话',
        imagePath: '../../images/menu-tel.png',
        funcType: 'nav',
        funcName: 'dh',
        funcStatus: false
      },
      {
        name: '损坏保修',
        imagePath: '../../images/menu-maintain.png',
        funcName: 'bx',
        funcStatus: false
      },
      {
        name: '空教室',
        imagePath: '../../images/menu-classroom.png',
        funcName: 'js',
        funcStatus: false
      }
    ],
    funcItems: [
      '1'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    loginFlag: false,
    funcEnabled: false,
    // 今天课表
    todayTable: [],
    loadingHidden: 0,
    // 借阅情况
    borrowBooksInfo: {
      state: 0,
      infos: []
    },
    todayBrows: [],
    notice: ''
  },

  staticFunc: function () {
    wx.setClipboardData({
      data: '815191583',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: 'QQ群复制成功',
              icon: 'none'
            });
          }
        })
      }
    });
  },

  getNotice: function () {
    var that = this;
    var url_str = app.globalData.url + '/api/notices';
    util.requestQuery(url_str, '', 'GET', function (res) {
      var result = res.data;
      if(result.status === 200) {
        that.setData({ notice: result.data.notice });
      } else {
        that.setData({ notice: '' });
      }
    }, function () {
      that.setData({ notice: '' });
    });
  },

  setClipboardData: function () {
    wx.setClipboardData({
      data: '支付宝发红包啦！即日起还有机会额外获得余额宝消费红包！长按复制此消息，打开最新版支付宝就能领取！WjWZnC70El',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '现在打开支付宝即可领取红包',
              icon: 'none'
            });
          }
        })
      }
    })
  },
  
  redirect2Bind: function () {
    wx.navigateTo({
      url: '../bind_user/bind_user',
    });
  },
  
  /* Share */
  onShareAppMessage: function () {
  },

  todayBrows: function (id, cardid) {
    var that = this;
    var url = app.globalData.url + '/api/today_brows';
    var params = {
      id: id,
      cardid: cardid
    };
    util.requestQuery(url, params, 'GET', function (res) {
      that.setData({ todayBrows: res.data.data.RList.webTrjnDTO });
    }, function () {
      console.error('Today Brows Internet Error')
    }, function () {
    });
  },

  tapFuncDisable: function () {
    wx.showToast({
      title: '暂时不能提供服务',
      icon: 'none'
    });
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function (res) {
        that._loadData(res);
        that.setData({
          loginFlag: true,
          funcEnabled: true
        });
      },
      fail: function () {
        console.log('Index Get StuInfo Failed')
        that.setData({
          funcEnabled: false,
          loadingHidden: 1
        });
        wx.navigateTo({
          url: '../bind_user/bind_user'
        });
      }
    });
  },
  _loadData(res) {
    this.todayBrows(res.data.cardcode, res.data.schno);
    this.getTerm();
    this.getBorrowsBooks();
    this.getNotice();
  },
  /**
   * 获取 借阅图书信息
   */
  getBorrowsBooks() {
    book.getBorrowData((books) => {
      var str, status, infos = [], borrowBooksInfo = {};
      for (var i in books) {
        status = books[i].warning.status;
        if (status > 0) {
          str = '《' + books[i].ShuName + '》 ' + books[i].warning.value;
          infos.push(str);
        }
      }
      if (infos.length > 0) {
        borrowBooksInfo.state = 1;
        borrowBooksInfo.infos = infos;
        this.setData({
          borrowBooksInfo: borrowBooksInfo
        });
      }
    });
  },
  /**
   * 温馨提示处理函数
   */
  onWarningTap(e) {
    wx.navigateTo({
      url: 'jy/jy',
    })
  },
  onTimeTableTab(e) {
    wx.navigateTo({
      url: 'kb/kb',
    })
  },
  /**
   * 获取当前学期
   */
  getTerm() {
    kb.getTerms((terms) => {
      var term = kb.getCurrentTerm(terms);
      var weekCounts = kb.getWeekCounts(term);
      var currentWeek = weekCounts.currentWeek;
      if (currentWeek != -1) {
        var that = this;
        var params = {
          term: term,
          week: currentWeek,
          callback: function (data) {
            var timeTable = kb.getCurrentDayTable(data);
            that.setData({
              todayTable: timeTable,
              loadingHidden: 1
            });
          }
        };
        kb.getCurrentWeekTable(params);
      } else {
        this.setData({
          todayTable: [],
          loadingHidden: 1
        });
      }
    });
  },
})