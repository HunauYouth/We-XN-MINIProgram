const app = getApp();
const util = require('../../../utils/util.js');

const searchCompany = function(c_name, companyData) {
  var resultArr = []
  for (var i = 0; companyData.length > i; i++) {
    if(companyData[i].name.includes(c_name)) {
      resultArr.push(companyData[i]);
    }
  }
  return resultArr;
}

Page({

  data: {
    companyData: [],
    stashCData: []
  },

  searchBook(e) {},

  onInput(e) {
    if (e.detail.value === '' && this.data.stashCData.length > 0) {
      this.setData({
        companyData: this.data.stashCData
      });
    }
  },

  onConfirm(e) {
    if (this.data.companyData.length < this.data.stashCData.length) {
      return false;
    }
    var searchData = searchCompany(e.detail.value, this.data.stashCData);
    this.setData({
      stashCData: this.data.companyData,
      companyData: searchData
    });
  },

  onSearch(e) {},

  setCompany: function () {
    var that = this;
    var url = app.globalData.url + '/api/officephone';
    util.requestQuery(url, '', 'GET',function(res) {
      var result = res.data;
      if(result.status === 200) {
        that.setData({
          stashCData: result.data,
          companyData: result.data
        })
      }
    }, function () {

    }, function () {

    });
  },

  onLoad: function (options) {
    this.setCompany();
  },

  onReady: function () {},

  onShow: function () {},

  onHide: function () {},

  onUnload: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})
