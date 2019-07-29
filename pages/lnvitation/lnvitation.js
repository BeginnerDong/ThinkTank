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
		sForm: {
			vip_code:''
		},
		isFirstLoadAllStandard: ['userInfoGet'],
	},


	onLoad: function() {
		const self = this;
		api.commonInit(self);
		self.userInfoGet();
	},

	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},

	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.userData =res.info.data[0]

			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'userInfoGet', self);
			self.setData({
				web_userData: self.data.userData,
			});

		};
		api.userGet(postData, callback);
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

	qrCodeGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			vip_code:self.data.sForm.vip_code,
			user_type:2
		};
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				if(data.use_step==2){
					api.showToast('该码已兑换', 'none')
				}else{
					self.qrCodeUpdate()
				}
			} else {
				api.showToast('网络故障', 'none')
			};
		};
		api.qrCodeGet(postData, callback);
	},
	
	qrCodeUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			vip_code:self.data.sForm.vip_code,
			user_type:2
		};
		postData.data = {
			use_step:2,
		};
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				api.showToast('兑换成功','none');
				setTimeout(function() {
					api.pathTo('/pages/mine/mine','rela')
				}, 1000);
			} else {
				api.showToast('网络故障', 'none')
			};
		};
		api.qrCodeUpdate(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.sForm);
		if (pass) {	
			wx.showLoading();
			const callback = (user, res) => {
				self.qrCodeGet();
			};
			api.getAuthSetting(callback);
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请输入邀请码', 'none');

		};
	},


})
