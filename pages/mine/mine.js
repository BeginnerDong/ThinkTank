import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {

		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData','getBackgroundImg'],
	},


	onLoad() {
		const self = this;
		api.commonInit(self);
		self.data.now =  Date.parse(new Date())/1000;
		console.log(self.data.now);
		self.setData({
			web_now:self.data.now
		})
		self.getBackgroundImg()
	},
	
	onShow(){
		const self = this;
		self.getMainData();
		
	},
	
	getMainData(){
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res)=>{
		  if(res.solely_code==100000){
		    self.data.mainData = res.info.data[0]
		  }else{
		    api.showToast('网络故障','none')
		  }
		  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
		  self.setData({
		    web_mainData:self.data.mainData,
		  });  
		};
		api.userGet(postData,callback)
	},

	getBackgroundImg(){
		const self = this;
		const postData = {};
		postData.searchItem = {
			title:'背景图'
		};
		const callback = (res)=>{
		  if(res.solely_code==100000){
		    self.data.imgData = res.info.data[0]
		  }else{
		    api.showToast('网络故障','none')
		  }
		  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getBackgroundImg',self);
		  self.setData({
		    web_imgData:self.data.imgData,
		  });  
		};
		api.labelGet(postData,callback)
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
