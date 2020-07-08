// components/search/search.js

const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: "apply-shared"
  },

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList: [],
    searchValue: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      wx.getStorage({
        key: "searchHistory",
        success: res => {
          this.setData({
            historyList: res.data
          })
        }
      })
      this.setData({
        isFocus: true
      })
    },

    handleCancel() {
      this.setData({
        isFocus: false,
        searchValue: ""
      })
    },

    handleConfirm(event) {
      console.log("confirm event")
      const value = event.detail.value
      const cloneHistoryList = [...this.data.historyList]
      cloneHistoryList.unshift(value)
      wx.setStorage({
        data: [...new Set(cloneHistoryList)],
        key: 'searchHistory'
      })
      this.changeSearchList(value)
    },

    handleHistoryDelete() {
      console.log("handleHistoryDelete")
      wx.removeStorage({
        key: 'searchHistory',
        success: res => {
          this.setData({
            historyList: []
          })
        }
      })
    },

    handelHistoryItemDel(event) {
      const value = event.target.dataset.text
      this.changeSearchList(value)
    },

    changeSearchList(value) {
      db
        .collection('users')
        .where({
          nickName: db.RegExp({
            regexp: value,
            options: "i"
          })
        })
        .field({
          userPhoto: true,
          nickName: true
        })
        .get()
        .then(res => {
          this.setData({
            searchList: res.data
          })
        })
    }
  }
})
