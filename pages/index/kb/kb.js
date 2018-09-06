const app = getApp();
const util = require('../../../utils/util.js');

import { Kb } from 'kb-model.js';
var kb = new Kb();

export default Component({
  data: {
    tabs: ['日', '一', '二', '三', '四', '五', '六',],
    terms: [],          // [所有]所有学期
    termsIndex: 0,      // [选中]学期索引
    currentTermIndex: 0,  // [本]当前学期索引
    allWeeks: [],       // [所有]选中学期的所有周
    weeksIndex: 0,       // [选中]周索引
    currentWeekIndex: 0,  // [本]周索引
    timeTables: {},     // [所有]选中周的所有课表
    daysIndex: 0,     // [选中]天索引
    currentDayIndex: 0, // [本] 今天索引：今天是星期几
    loadingHidden: 0
  },
  methods: {
    onLoad: function (options) {
      this._loadData();
    },
    /**
     * 自定义私有方法前加_，方便自己和他人识别，实际_是没作用的
     */
    _loadData() {
      // 初始化 今天是星期几
      var today = new Date();
      this.setData({
        currentDayIndex: today.getDay()
      })
      kb.getTerms((terms) => {
        this.setTerms(terms);
        this.setWeeks();
        this.setTimeTable();
      });
    },
    /**
     * 绑定
     *  1. terms：所有学期数据
     *  2. termsIndex：本学期索引
     *  3. currentTermIndex：本学期索引
     */
    setTerms: function (termArr) {
      termArr.forEach(function (element) {
        element.class_term_name = element.class_year + '年' + element.class_term + '学期';
      });
      var index = kb.getCurrentTermIndex(termArr);
      // 完善点应该要判断currentTerm是否存在
      this.setData({
        terms: termArr,
        termsIndex: index,
        currentTermIndex: index
      });
    },
    /**
     * 绑定
     *  1. allWeeks：当前选中学期的所有周数据
     *  2. weeksIndex：当前选中学期的默认周的索引
     */
    setWeeks() {
      var term = this.data.terms[this.data.termsIndex];
      var currentTerm = this.data.terms[this.data.currentTermIndex];
      var weekObj;
      // 获取指定学期总周数和本周
      var weekCounts = kb.getWeekCounts(term);
      var weekCount = weekCounts.weekCount;
      if (term.id == currentTerm.id) {    // 选中学期为本学期
        var currentWeek = weekCounts.currentWeek;
        if (currentWeek != -1) {
          weekObj = this._setCurrentWeek(weekCount, currentWeek);
        } else {
          weekObj = this._noSetCurrentWeek(weekCount);
        }
      } else {
        weekObj = this._noSetCurrentWeek(weekCount);
      }
      this.setData({
        allWeeks: weekObj.weeks,
        weeksIndex: weekObj.weeksIndex,
      });
    },
    /**
     * 加“当前”处理
     */
    _setCurrentWeek(weekCount, currentWeek) {
      var weeks = [];
      var defaultWeek;
      for (var i = 0; i < weekCount; i++) {
        var weekValue = i + 1;
        weeks[i] = '第' + weekValue + '周';
        (weekValue == currentWeek) && (weeks[i] += '（当前）');
      }
      var index = currentWeek - 1;   // 本学期默认选择本周
      this.setData({
        currentWeekIndex: index
      });
      return {
        weeks: weeks,
        weeksIndex: index,
      };
    },
    /**
     * 不加“当前”处理
     */
    _noSetCurrentWeek(weekCount) {
      var weeks = [];
      var defaultWeek;
      for (var i = 0; i < weekCount; i++) {
        weeks[i] = '第' + (i + 1) + '周';
      }
      return {
        weeks: weeks,
        weeksIndex: 0,    // 非本学期的默认选择第一周
      };
    },
    /**
     *  绑定：选中周的课表数据
     */
    setTimeTable() {
      var term = this.data.terms[this.data.termsIndex];
      var currentTerm = this.data.terms[this.data.currentTermIndex];
      var weeksIndex = this.data.weeksIndex;
      var daysIndex;
      var that = this;
      var params = {
        term: term,
        week: parseInt(weeksIndex) + 1,
        callback: function (data) {
          var tables = kb.classfyTables(data);
          that.setData({
            timeTables: tables,
            loadingHidden: 1
          });
        }
      };
      // 判断是否 本学期，本周
      if (term.id == currentTerm.id &&
        weeksIndex == this.data.currentWeekIndex) {
        kb.getCurrentWeekTable(params);
        daysIndex = this.data.currentDayIndex;  // 本周默认选当天
      } else {
        kb.getTimeTable(params);
        daysIndex = 1;    // 非本周默认选星期一
      }
      this.setData({
        daysIndex: daysIndex
      });
    },
    /**
     * 学期选择处理函数 : 重新绑定termsIndex
     */
    bindTermPickerChange(event) {
      this.setData({
        termsIndex: event.detail.value,
        loadingHidden: 0,
      });
      this.setWeeks();
      this.setTimeTable();
    },
    /**
     * 周选择处理函数：重新绑定selectedWeek
     */
    bindWeekPickerChange(event) {
      var index = parseInt(event.detail.value);
      this.setData({
        weeksIndex: index,
        loadingHidden: 0,
      });
      this.setTimeTable();
    },
  }
});
