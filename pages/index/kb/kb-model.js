/**
 * 课表模型：
 * 1. 所有课表相关数据都通过这个模型获取获取，与后端的模型层作用类似，区别在于：后端模型从数据库取数据，前端模型从api取数据
 * 2. 还可以包含一些处理课表数据相关方法
 * 如：index课表，kb课表都通过这个模型获取课表数据，提高了复用性，更有层次感
 * */
const app = getApp();

const util = require('../../../utils/util.js');

class Kb {
  /**
   * 对20160229 变成 20160329
   * 低概率事件如12月份结束等暂时不处理
   */
  getTimeAddMonth(date) {
    var nDate;
    var arr = date.split('');
    arr[5] = parseInt(date.substring(5, 6)) + 1;
    var nDate = arr.join('');
    return this.getTime(nDate);
  }
  /**
   * 获取能获取的学期
   */
  getTerms(callback) {
    var obj = wx.getStorageSync('terms');
    var terms = obj.terms;
    var currentTerm = this.getCurrentTerm(terms);
    var d = new Date();
    var currentTime = d.getTime();
    // 缓存不存在或过期
    if (currentTerm == -1 || currentTime >= obj.expire_time) {
      var url_str = app.globalData.url + '/api/get_term';
      util.requestQuery(url_str, '', 'GET', (res) => {
        var terms = res.data.data;
        // 暂定到期时间为本学期结束后一个月
        var currentTerm = this.getCurrentTerm(terms);
        wx.setStorageSync('terms', {
          terms: terms,
          expire_time: this.getTimeAddMonth(currentTerm.enddate)
        });
        callback && callback(terms);
      });
    } else {
      callback && callback(terms);
    }
  }
  /**
   * 获取本学期 的 index
   */
  getCurrentTermIndex(terms) {
    // 根据经验，本学期通常为api数据的最后一个元素
    return terms.length - 1;
  }
  /**
   * 获取本学期 具体值
   */
  getCurrentTerm(terms) {
    if (!(terms instanceof Array)) {
      return -1;
    }
    // 这里要判断res吧，不存在抛异常
    var index = this.getCurrentTermIndex(terms);
    var currentTerm = terms[index];
    return currentTerm;
  }
  /**
   * 对日期20180305处理，返回毫秒时间戳格式
   */
  getTime(date) {
    var nDate = date.substring(0, 4) + ','
      + date.substring(4, 6) + ',' + date.substring(6, 8);
    var arrDate = nDate.split(',');
    var d = new Date();
    d.setFullYear(arrDate[0], arrDate[1] - 1, arrDate[2]);
    d.setHours(0, 0, 0, 0);
    var time = d.getTime();
    return time;
  }
  /**
   * 返回两日期相差的周数
   * 这个方法不应该由外部直接调用
   */
  getDifWeekCount(beginTime, endTime) {
    var difTime = endTime - beginTime;
    // 末时间与始时间 相差毫秒 转换为 相差周
    var difWeek = parseInt(difTime / 604800000) + 1;    // (1000 * 60 * 60 * 24 * 7)
    return difWeek;
  }
  /**
   *  获取周相关数：
   *  1. 指定学期总周数
   *  2. 本周是第几周（如果本周合理）
   */
  getWeekCounts(term) {
    var beginTime = this.getTime(term.begindate);
    var endTime = this.getTime(term.enddate);
    var weekCount = this.getDifWeekCount(beginTime, endTime);   // 指定学期总周数
    var currentWeek = this.getCurrentWeek(beginTime, weekCount);
    return {
      weekCount: weekCount,
      currentWeek: currentWeek
    };
  }
  /**
   * @params
   * @return 返回当前第几周，
   *         当前周不在本学期范围内的，返回-1,表示不属于
   */
  getCurrentWeek(beginTime, weekCount) {
    var d = new Date();
    var currentTime = d.getTime();
    var currentWeek = this.getDifWeekCount(beginTime, currentTime);
    if (currentWeek < 1 || currentWeek > weekCount) {
      currentWeek = -1;
    }
    return currentWeek;
  }
  /**
   * 获取指定周课表
   */
  getTimeTable(params) {
    var url_str = app.globalData.url + '/api/get_timetable';
    var allParams = {
      Id: wx.getStorageSync('stuUserInfo').cardcode,
      Term: params.term.class_year + params.term.class_term,
      weeks: params.week
    };
    util.requestQuery(url_str, allParams, 'GET', (res) => {
      var timeTable = res.data.data;
      params.callback && params.callback(timeTable);
    });
  }
  /**
   * 根据 今天 获取下周一00:00:00时间戳
   */
  getNextMondayTime() {
    var oneDayTime = 24 * 60 * 60 * 1000;
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var currentTime = d.getTime();
    var day = d.getDay() || 7;    // 解决星期天返回0带来的问题
    var nextMondayTime = currentTime + (7 - day + 1) * oneDayTime;    // 当前走过的时间 + 今天到星期天相差天数 * 一天时长
    return nextMondayTime;
  }
  /**
   * 获取当前周课表
   */
  getCurrentWeekTable(params) {
    var obj = wx.getStorageSync('currentWeekTable');
    var currentWeekTable = obj.timeTable;
    var d = new Date();
    // 缓存不存在或过期，才重新获取数据
    if (!currentWeekTable || d.getTime() >= obj.expire_time) {
      var that = this;
      var oParams = {
        term: params.term,
        week: params.week,
        callback: function (timeTable) {
          wx.setStorageSync('currentWeekTable', {
            timeTable: timeTable,
            expire_time: that.getNextMondayTime()   // 到期时间为下周一0:0:0
          });
          params.callback && params.callback(timeTable);
        }
      };
      this.getTimeTable(oParams);
    } else {
      params.callback && params.callback(currentWeekTable);
    }
  }
  /**
   * 获取今天课表
   */
  getCurrentDayTable(timeTable) {
    var d = new Date();
    var day = d.getDay();
    return this.getOneDayTable(timeTable, day);
  }
  /**
   * 获取指定天 已排序 的课表,
   * 好像有点多余.......
   */
  getOneDayTable(timeTable, dayIndex) {
    var table = [];
    var arrDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var strDay = arrDays[dayIndex];
    for (var i in timeTable) {
      if (timeTable[i].section == strDay) {
        table.push(timeTable[i]);
      }
    }
    return this.sortOneDayTable(table);
  }
  /**
   * 一天课表排序
   */
  sortOneDayTable(tables) {
    var sortedTable = [];
    var nSortedTable = [];
    for (var i in tables) {
      var order = tables[i]['JieC'].substring(0, 1);
      sortedTable[order - 1] = tables[i];
    }
    // 去除数组中空元素
    var length = sortedTable.length;
    for (var i = 0; i < length; i++) {
      if (sortedTable[i] != undefined) {
        nSortedTable.push(sortedTable[i]);
      }
    }
    return nSortedTable;
  }
  /**
   * 一周课表分类
   */
  classfyTables(tables) {
    // 数组处理！有更巧妙的方法吗？php就有..
    var weeksName = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var classifiedTables = [];
    var sortedTables = [];
    // 初始化数组
    for (var i = 0; i <= 6; i++) {
      classifiedTables[i] = [];
    }
    for (var i in tables) {
      for (var j in weeksName) {
        if (weeksName[j] == tables[i].section) {
          classifiedTables[j].push(tables[i]);
          break;
        }
      }
    }
    // 排序
    for (var i in classifiedTables) {
      sortedTables[i] = this.sortOneDayTable(classifiedTables[i]);
    }
    return sortedTables;
  }
}

export { Kb };
