import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();


Page({
	data: {
		mainData: [],
		isTouchMove: '',
		translateStyle: '',
		isFirstLoadAllStandard: ['getMainData'],
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		wx.setNavigationBarTitle({
			title: '搜索页'
		});
		self.data.title = options.title;
		self.getMainData();
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
			type: 2,
			title: ['LIKE', ['%' + self.data.title + '%']]
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



	del(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		api.showToast('已取消', 'none');
		api.delStorageArray('collectData', self.data.mainData[index], 'id');
		self.getMainData()
	},


})
