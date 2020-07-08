// pages/nearby/nearby.js

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: "",
    latitude: "",
    markers: []
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
    this.getLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation()
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

  getLocation() {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          longitude, latitude
        })
        this.getNearbyUsers()
      }
    })
  },

  getNearbyUsers() {
    db.collection("users").where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000
      }),
      showLocation: true
    }).field({
      longitude: true,
      latitude: true,
      userPhoto: true
    }).get()
      .then(res => {
        const data = res.data
        console.log("geo data; ", data)
        const result = []
        data.forEach(item => {
          if (item.userPhoto) {


            result.push({
              iconPath: item.userPhoto,
              id: item._id,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 30,
              height: 30
            })

            // 下面是老师的代码, 但我不知道是测试还是版本的原因, 不做如下处理, 依然可以正确显示地图上的好友头像
            // if (item.userPhoto.includes("cloud://")) {
            //   wx.cloud.getTempFileURL({
            //     fileList: [item.userPhoto],
            //     success: res => {
            //       result.push({
            //         iconPath: res.fileList[0].tempFileURL,
            //         id: item._id,
            //         latitude: item.latitude,
            //         longitude: item.longitude,
            //         width: 30,
            //         height: 30
            //       })
            //       this.setData({
            //         markers: result
            //       })
            //     }
            //   })
            // } else {
            //   result.push({
            //     iconPath: item.userPhoto,
            //     id: item._id,
            //     latitude: item.latitude,
            //     longitude: item.longitude,
            //     width: 30,
            //     height: 30
            //   })
            // }
          }
        })
        this.setData({
          markers: result
        })
      })
  },

  markerTap(event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/detail/detail?userID=' + event.markerId,
    })
  }
})