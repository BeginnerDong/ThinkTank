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
		artData: [],
		mainData: [],
		getBefore: {},
		num: 1,
		isFirstLoadAllStandard: ['getMainData', 'getArtData','getLabelData'],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['智囊团会员']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.data.getBeforeTwo = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['会员课程']],
				},
				middleKey: 'category_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.getMainData();
		self.getArtData();
		self.getUserData();
		self.getLabelData()
	},
	
	changeType(e){
		const self = this;
		var num = api.getDataSet(e,'id');
		self.data.artData=[];
		if(self.data.num!=num){
			self.data.num = num;
			if(self.data.num==1){
				self.data.getBefore.caseData.searchItem.title = ['=', ['智囊团会员']];
				self.data.getBeforeTwo.caseData.searchItem.title = ['=', ['会员课程']];
				self.getMainData(true);
				self.getArtData();
			}else if(self.data.num==2){
				self.data.getBefore.caseData.searchItem.title = ['=', ['智囊团钻石会员']];
				self.data.getBeforeTwo.caseData.searchItem.title = ['=', ['超级会员课程']];
				self.getMainData(true);
				self.getArtData();
			}
			self.setData({
				num:self.data.num
			})
		}
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
		  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
		  self.setData({
		    web_userData:self.data.userData,
		  });  
		};
		api.userGet(postData,callback)
	},
	
	getLabelData(){
		const self = this;
		const postData = {};
		postData.searchItem = {
			title:'会员主图'
		}
		const callback = (res)=>{
		  if(res.solely_code==100000){
		    self.data.labelData = res.info.data[0]
		  }else{
		    api.showToast('网络故障','none')
		  }
		  api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
		  self.setData({
		    web_labelData:self.data.labelData,
		  });  
		};
		api.labelGet(postData,callback)
	},

	getArtData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
		};
		postData.getBefore = api.cloneForm(self.data.getBefore);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.artData.push.apply(self.data.artData, res.info.data);
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getArtData', self);
			self.setData({
				web_artData: self.data.artData,
			});
		};
		api.articleGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
		};
		postData.getBefore = api.cloneForm(self.data.getBeforeTwo);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.productGet(postData, callback);
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;

			self.getMainData();
		};
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
