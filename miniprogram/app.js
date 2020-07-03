//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.log("请使用2.2.3或以上的基础库以使用云能力")
    } else {
      console.log("wx_cloud", wx.cloud)
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'miaomiao-self',
        traceUser: true,
      })
      console.log(wx.cloud)
    }
  },

  globalData: {
    userInfo: null
  }
})