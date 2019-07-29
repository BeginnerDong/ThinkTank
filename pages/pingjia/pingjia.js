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
		searchItem:{},
		isFirstLoadAllStandard: ['getMainData'],
		sForm:{
			content:''
		}
	},


	onLoad(options) {
		const self = this;
		wx.setNavigationBarTitle({
			title: '课程评价',
		});
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData();
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.searchItem.id = self.data.id;
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.productGet(postData, callback);
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.sForm[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'sForm');
		};
		console.log(self.data.sForm);
		self.setData({
			web_sForm: self.data.sForm,
		});
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.sForm);
		postData.data.type  = 2;
		postData.data.relation_id = self.data.id;
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				api.showToast('评价成功', 'none');

				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			} else {
				api.showToast(data.msg, 'none')
			};
		};
		api.messageAdd(postData, callback);
	},
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
		
			self.getMainData();
		};
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.sForm);
		if (pass) {
			const callback = (user, res) => {
				self.messageAdd();
			};
			api.getAuthSetting(callback);
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请输入内容', 'none');

		};
	},



})
