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
		showBuy:false,
		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData','getBackgroundImg','getQrData'],
	},


	onLoad() {
		const self = this;
		api.commonInit(self);
		self.data.now =  Date.parse(new Date())/1000;
		console.log(self.data.now);
		self.setData({
			web_showBuy:self.data.showBuy,
			web_now:self.data.now
		})
		self.getQrData()
		self.getBackgroundImg();
		
	},
	
	onShow(){
		const self = this;
		self.getMainData();
		
	},
	
	
	getQrData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			title: '首页二维码'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.qrData = res.info.data[0]
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getQrData', self);
			self.setData({
				web_showBuy:true,
				web_qrData: self.data.qrData,
			});
		};
		api.labelGet(postData, callback);
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
