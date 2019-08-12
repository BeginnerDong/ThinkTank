import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
   data: {
    mainData:[],
    isTouchMove:'',
    translateStyle:'',
    isFirstLoadAllStandard:['getMainData','getUserData'],
  },


  onLoad(options) {
    const self = this;
	var now =  Date.parse(new Date())/1000;
    api.commonInit(self);
	wx.setNavigationBarTitle({
		title: '我的足迹'
	});
    self.getMainData();
	self.getUserData();
	self.setData({
		web_now:now
	})
  },
  
  
  getUserData(){
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName = 'getProjectToken';
  	const callback = (res)=>{
  	  if(res.solely_code==100000){
  	    self.data.userData = res.info.data[0]
  	  }else{
  	    api.showToast('网络故障','none')
  	  }
  	  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserData',self);
  	  self.setData({
  	    web_userData:self.data.userData,
  	  });  
  	};
  	api.userGet(postData,callback)
  },

  getMainData(){
    const self = this;
    //self.data.mainData = api.jsonToArray(wx.getStorageSync('footData'),'unshift');
    self.data.mainData = api.getStorageArray('footData');
    console.log('getMainData',self.data.mainData);
    self.setData({
      web_mainData:self.data.mainData,
    });
    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },



  del(e) {
    const self = this;
    var index = api.getDataSet(e,'index');
    api.showToast('已取消','none');
    api.delStorageArray('footData',self.data.mainData[index],'id'); 
    self.getMainData()
   },


})

  