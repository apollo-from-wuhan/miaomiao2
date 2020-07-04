// pages/index/index.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [
      "../../images/swiper/1.jpg",
      "../../images/swiper/2.jpg",
      "../../images/swiper/3.jpg",
      "../../images/swiper/4.jpg",
      "../../images/swiper/5.jpg"
    ],
    height: "",
    width: "",
    listData: []
  },

  goheight: function (e) {
    var width = wx.getSystemInfoSync().windowWidth
    //获取可使用窗口宽度
    var imgheight = e.detail.height
    //获取图片实际高度
    var imgwidth = e.detail.width
    //获取图片实际宽度
    var height = width * imgheight / imgwidth + "px"
    //计算等比swiper高度
    this.setData({
      height: height,
      width: width + "px"
    })
    console.log(width, imgheight, imgwidth, height)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getListData()
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

  },

  handleLinks(event) {
    let id = event.target.dataset.id

    wx.cloud.callFunction({
      name: "update",
      data: {
        collection: "users",
        doc: id,
        data: "{links:_.inc(1)}"
      }
    }).then(res => {
      const updatedNum = res.result.stats.updated
      if (updatedNum > 0) {
        const cloneListData = [...this.data.listData]
        cloneListData.forEach(item => {
          if (item._id == id) {
            item.links++
          }
        })
        this.setData({
          listData: cloneListData
        })
      }
    })
  },

  getListData() {
    db.collection("users").field({
      userPhoto: true,
      links: true,
      nickName: true
    }).get().then(res => {
      console.log(res)
      this.setData({
        listData: res.data
      })
    })
  }
})