// components/removeList/removeList.js

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageID: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleAddFriend() {

    },

    handleDelMessage() {
      wx.showModal({
        title: "提示信息",
        content: "删除消息",
        confirmText: "确定删除",
        success: (res) => {
          if (res.confirm) {
            this.removeMessage()
          } else if (res.cancel) {
            console.log("用户点击了取消按钮")
          }
        }
      })
    },

    removeMessage() {
      db.collection("message").where({
        userID: app.userInfo._id
      }).get().then(res => {
        let list = res.data[0].list
        list = list.filter(item => item != this.data.messageID)
        wx.cloud.callFunction({
          name: "update",
          data: {
            collection: "message",
            where: {
              userID: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then(res => {
          this.triggerEvent("myevent", list)
        })
      })
    }
  },

  lifetimes: {
    attached() {
      db.collection("users").doc(this.data.messageID)
        .field({
          userPhoto: true,
          nickName: true
        })
        .get()
        .then(res => {
          this.setData({
            userMessage: res.data
          })
        })
    }
  }
})
