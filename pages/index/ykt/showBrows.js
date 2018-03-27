// pages/index/ykt/showBrows.js
Page({
  data: {
    browsOverView: {},
    browspageDTO: {},
    browsData: {},
    browsSession: '',
    userinfo: {},
    selectedTranItem: {},
    loadmorehidden: true,
    currentPage: '',
    popupbrow: {}
  },

  showPopup(e) {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.show();
    var browIndex = e.currentTarget.dataset.index
    this.setData({
      popupbrow: this.data.browsData[browIndex]
    })
  },
  hidePopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.hide();
  },

  setBrows: function (browsRes) {
    console.log(browsRes);
    var brows = browsRes.data.data;
    this.setData({
      browsData: this.data.browsData.concat(brows.RList.webTrjnDTO),
      browspageDTO: brows.RList.pageDTO,
    })
  },

  requestBrows: function (queryParams) {
    wx.request({
      url: 'https://api.hunau.club/api/get_brows',
      header: {
        "accept": "application/vnd.api+json;version=1",
        'content-type': 'application/json' // 默认值
      },
      data: {
        queryParams: queryParams
      },
      success: res => {
        this.setBrows(res)
        return true;
      }
    })
  },

  lowerLoad: function () {
    var params = {};
    var pages = this.data.browspageDTO;
    
    if (pages.nextPage) {
      if (this.data.currentPage == pages.pageNum) {
        console.log('This is a repeat Request')
        return false;
      }
      params.session = this.data.browsSession;
      params.pageNum = pages.pageNum;
      params.pageSize = pages.pageSize;
      params.pageindex = pages.pageNum;
      params.cardid = this.data.userinfo.schno;
      params.id = this.data.userinfo.cardcode;
      //params.cardid = '201541842107';
      //params.id = '20150902233720207';
      params.code = this.data.selectedTranItem.trancode;
      params.bData = this.data.browsOverView.enputStartDate; //掌上校园开发者应该是写错了
      params.eData = this.data.browsOverView.inputEndDate;
      this.setData({
         loadmorehidden: false,
         currentPage: params.pageNum
      });
      this.requestBrows(params);
    } else {
      this.setData({ loadmorehidden: true });
    }
  },

  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var overviewBrows = {
      SAmt: prevPage.data.brows.RList.SAmt,
      amt: prevPage.data.brows.RList.amt,
      count: prevPage.data.brows.RList.count,
      inputEndDate: prevPage.data.brows.RList.inputEndDate,
      enputStartDate: prevPage.data.brows.RList.inputStartDate,
      intPageNum: prevPage.data.brows.RList.intPageNum,
      intPageSize: prevPage.data.brows.RList.intPageSize
    }
    this.setData({
      browsOverView: overviewBrows,
      browspageDTO: prevPage.data.brows.RList.pageDTO,
      browsData: prevPage.data.brows.RList.webTrjnDTO,
      browsSession: prevPage.data.brows.SessionId,
      userinfo: prevPage.data.userinfo,
      selectedTranItem: prevPage.data.selectedTranItem
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})