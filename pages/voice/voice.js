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
		getBefore: {},
		isFirstLoadAllStandard: ['getMainData'],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.name = options.name;
		if(self.data.name){
			
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', [self.data.name]],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			};
			self.getMainData();
		}else{
			api.showToast('跳转参数有误','none')
		}

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
		postData.getBefore = api.cloneForm(self.data.getBefore);
		postData.getAfter = {	
			good: {
				token:wx.getStorageSync('token'),
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: 1,
					type: 4
				},
				condition: '='
			},
			goodMe: {
				token:wx.getStorageSync('token'),
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					type: 4,
					user_no: wx.getStorageSync('info').user_no
				},
				condition: '='
			},
		};
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
		api.articleGet(postData, callback);
	},
	
	clickGood(e) {
		const self = this;
		api.buttonCanClick(self);
		var index = api.getDataSet(e, 'index');
		var item = self.data.mainData[index];
		self.addLog(index)
	},
	
	addLog(index) {
		const self = this;
		var item = self.data.mainData[index];
		const postData = {};
		postData.data = {
			type: 4,
	
			relation_id: self.data.mainData[index].id
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				self.data.mainData[index].goodMe.push({
					status: 1,
					id: res.info.id
				});
				self.data.mainData[index].good.push({
					status: 1,
					id: res.info.id
				});
			} else {
				api.showToast(res.msg, 'none', 1000)
			};
	
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.logAdd(postData, callback);
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
