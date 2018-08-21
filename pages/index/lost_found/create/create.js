const app = getApp();
Page({
  data: {
    showTopTips: false,

    radioItems: [
      {name: '失物招领', value: 0},
      {name: '寻物启事', value: 1, checked: true}
    ],

    countryCodes: ["+86"],
    countryCodeIndex: 0,

    files: [],
    LFDes: '',
    errorInfo: '',
    showLoading: false
  },

  checkForm: function(formData) {
    if(!formData || !formData.title || !formData.describe || !formData.tel) {
      this.setData({ errorInfo: '请完善信息' });
      this.showTopTips();
      return false;
    }

    if(!this.data.files.length){
      this.setData({ errorInfo: '上传一张图片，找回几率增加50%' });
      this.showTopTips();
      return false;
    }

    return true;
  },

  submitLostAndFoundForm: function(e) {
    this.setData({ showLoading: true });
    var formData = e.detail.value;
    if(!this.checkForm(formData)) {
      this.setData({ showLoading: false });
      return false;
    }
    var radioItems = this.data.radioItems;
    var stu_user_id = app.globalData.stuUserInfo.id;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if(radioItems[i].checked === true) {
        var category = parseInt(radioItems[i].value);
        break;
      }
    }

    var that = this;
    wx.uploadFile({
      url: app.globalData.url + '/api/lost_and_found',
      //url: 'http://localhost:3030/api/lost_and_found',
      header: {
        'Content-Type': 'application/json'
      },
      filePath: that.data.files[0],
      name: 'l_f_p[images]',
      formData: {
        'l_f_p[stu_user_id]': stu_user_id,
        'l_f_p[title]': formData.title,
        'l_f_p[describe]': formData.describe,
        'l_f_p[category]': parseInt(category),
        'l_f_p[tel]': formData.tel
      },
      success: function(res) {
        var result = JSON.parse(res.data);
        if (result.status === 200) {
          wx.showModal({
            showCancel: false,
            content: '发布成功，请耐心等待！',
            success: function(res) {
              that.setData({ showLoading: false });
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/lost_found/lost_found'
                });
              }
            }
          });
        } else if (result.status === 400) {
          that.setData({ errorInfo: '出错了～', showLoading: 0 });
          that.showTopTips();
        }
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '网络出错了=。='
        });
        that.setData({ showLoading: 0 });
      }
    });
  },

  showTopTips: function(){
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function(){
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          /* files: that.data.files.concat(res.tempFilePaths) */
          files: res.tempFilePaths
        });
      }
    })
  },
  previewImage: function(e){
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },

  bindCountryCodeChange: function(e){
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
});
