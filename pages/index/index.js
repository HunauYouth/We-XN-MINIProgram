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
        funcStatus: true
      },
      {
        name: '电费查询',
        imagePath: '../../images/df.png',
        funcName: 'df',
        funcStatus: true
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png',
        funcName: 'kb',
        funcStatus: true
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png',
        funcName: 'jy',
        funcStatus: true
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png',
        funcName: 'ykt',
        funcStatus: true
      },
      {
        name: '图书查询',
        imagePath: '../../images/menu-book.png',
        funcName: 'ts',
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
    notice: '为了对您的反馈做出回应，我们重做了反馈，快去看看吧！'
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
      console.log('Complete');
    });
  },

  tapFuncDisable: function () {
    console.log('未绑定用户信息')
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
        that.setData({
          loginFlag: true,
          funcEnabled: true
        });
        // 获取今天课表
        that._loadData();
        that.todayBrows(res.data.cardcode, res.data.schno);
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
  _loadData() {
    this.getTerm();
    this.getBorrowsBooks();
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