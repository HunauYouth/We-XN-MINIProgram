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
        name: '通讯录',
        imagePath: '../../images/menu-tel.png',
        funcType: 'nav',
        funcName: 'dh',
        funcStatus: true
      },
      {
        name: '失物招领',
        imagePath: '../../images/menu-lost_found.png',
        funcType: 'nav',
        funcName: 'lost_found',
        funcStatus: true
      },
      {
        name: '损坏报修',
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
    // 借阅情况
    borrowBooksInfo: {
      state: 0,
      infos: []
    },
    todayBrows: [],
    notice: '',
    previewImg: {
      admire: ['http://we-xn-1252391147.coscd.myqcloud.com/admire.jpeg'],
      focuse: ['http://we-xn-1252391147.coscd.myqcloud.com/xnqnqr-code.png']
    },
    copyContent: {
      qqgroup: {
        text: '815191583',
        toast: 'QQ群号码复制成功，打开QQ搜索加入我们吧！'
      },
      alipay: {
        text: '510647070',
        toast: '搜索码已复制，赶快去支付宝粘贴搜索领取红包并支持开发！'
      },
      open: {
        text: 'wxbc23727752384330',
        toast: 'AppID复制成功，申请绑定之后将在24小时内处理'
      }
    }
  },

  copyFunc: function (e) {
    var flag = e.currentTarget.dataset.flag;
    var copyContent = {};
    switch(flag) {
      case 'qqgroup':
        copyContent = this.data.copyContent.qqgroup;
        break;
      case 'alipay':
        copyContent = this.data.copyContent.alipay;
        break;
      case 'open':
        copyContent = this.data.copyContent.open;
        break;
      default:
        console.log('Null');
    }
    wx.setClipboardData({
      data: copyContent.text,
      success: function (res) {
        wx.showModal({
          content: copyContent.toast,
          showCancel: false
        });
      }
    })
  },

  previewImg: function (e) {
    var flag = e.currentTarget.dataset.flag;
    var imgUrl = '';
    switch(flag) {
      case 'admire':
        imgUrl = this.data.previewImg.admire;
        break;
      case 'focuse':
        imgUrl = this.data.previewImg.focuse;
        break;
      default:
        console.warn('Null');
    }
    wx.previewImage({
      urls: imgUrl
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

  redirect2Bind: function () {
    wx.navigateTo({
      url: '/pages/bind_user/bind_user',
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
      var result = res.data;
      if(result.data.status === '0') {
        console.warn(result.data.msg);
      } else if(result.data.status === '1') {
        that.setData({ todayBrows: result.data.RList.webTrjnDTO });
      }
    }, function () {
      console.warn('Today Brows Internet Error')
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
    app.getUser().then(res => {
      var result = res.data;
      app.globalData.stuUserInfo = result;
      wx.setStorage({
        key: 'stuUserInfo',
        data: result,
        success: function(result) {
          wx.showLoading({
            title: '拼命加载中 -。=',
          })
          that._loadData(res);
          that.setData({
            loginFlag: true,
            funcEnabled: true
          });
        }
      })
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/bind_user/bind_user'
      });
    })
  },

  _loadData(res) {
    this.todayBrows(res.cardcode, res.schno);
    this.getTerm();
    this.getBorrowsBooks();
    this.getNotice();
    wx.hideLoading();
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
              todayTable: timeTable
            });
          }
        };
        kb.getCurrentWeekTable(params);
      } else {
        this.setData({
          todayTable: []
        });
      }
    });
  },
})
