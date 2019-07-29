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
		self.getMainData();
	},
	
	onShow() {
		const self = this;
		self.getUserData()
	},

	getUserData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.userData = res.info.data[0]
			} else {
				api.showToast('网络故障', 'none')
			}
		
			self.setData({
				web_userData: self.data.userData,
			});
		};
		api.userGet(postData, callback)
	},

	nextPage(e) {
		const self = this;
		api.buttonCanClick(self);
		var index = api.getDataSet(e, 'index')
		if (self.data.userData.info.phone == '') {
			api.buttonCanClick(self, true);
			api.pathTo('/pages/message/message', 'nav')
		} else {
			self.addOrder(index)
		}
	},

	addOrder(index) {
		const self = this;
		const postData = {
			tokenFuncName: 'getProjectToken',
			data: {

			}
		};
		postData.orderList = [{
			product: [{
				id: self.data.mainData[index].id,
				count: 1
			}, ],
			type: 2
		}, ]
		const callback = (res) => {
			if (res && res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.pathTo('/pages/orderform/orderform?order_id='+res.info.id, 'nav')
			} else {
				api.commonInit(self, true);
				api.showToast(res.msg, 'none');
			};
		};
		api.addOrder(postData, callback);

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
			type: 1
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
