// miniprogram/pages/detail/detail.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFriend: false,
    isHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userID = options.userID
    db.collection("users").doc(userID).get()
      .then(res => {
        this.setData({
          detail: res.data
        })
        const friendsList = res.data.friendsList
        if (friendsList.includes(app.userInfo._id)) {
          this.setData({
            isFriend: true
          })
        } else {
          this.setData({
            isFriend: false
          }, () => {
            if (userID == app.userInfo._id) {
              this.setData({
                isFriend: true,
                isHidden: true
              })
            }
          })
        }
      })
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

  },

  handleAddFriend() {
    if (app.userInfo._id) { // 登录状态下才可以添加好友
      db
        .collection("message")
        .where({
          userID: this.data.detail._id
        })
        .get()
        .then(res => {
          if (res.data.length > 0) { // 更新
            if (res.data[0].list.includes(app.userInfo._id)) {
              wx.showToast({
                title: '已申请过!'
              })
            } else {
              wx.cloud.callFunction({
                name: "update",
                data: {
                  collection: "message",
                  where: {
                    userID: this.data.detail._id
                  },
                  data: `{list:_.unshift('${app.userInfo._id}')}`
                }
              }).then(res => {
                wx.showToast({
                  title: '申请成功~',
                })
              })
            }
          } else { // 添加
            db.collection("message").add({
              data: {
                userID: this.data.detail._id,
                list: [app.userInfo._id]
              }
            }).then(res => {
              wx.showToast({
                title: '申请已成功发送',
              })
            })
          }
        })
    } else {
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: "none", // 不显示成功的小对勾
        success() { // 2秒后转到用户登录页面
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000)
        }
      })
    }
  }
})