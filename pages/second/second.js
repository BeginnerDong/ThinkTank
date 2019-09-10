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
		isBind:false,
		mainData: [],
		getBefore: {},
		isFirstLoadAllStandard: ['getMainData'],
	},

	onLoad(options) {
		const self = this;
		var now =  Date.parse(new Date())/1000;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_now:now
		})
	},
	
	
	getCode() {
		var self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var currentTime = self.data.currentTime //把手机号跟倒计时值变例成js值
		if (self.data.submitData.phone == '') {
			api.buttonCanClick(self, true);
			api.showToast('手机号码不能为空', 'none');
			return
		} else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
			api.buttonCanClick(self, true);
			api.showToast('手机号格式不正确', 'none');
			return
		} else {
			//当手机号正确的时候提示用户短信验证码已经发送
			const postData = {
				params: {					
					PhoneNumbers: self.data.submitData.phone,
					TemplateCode:"SMS_170111072",
					SignName:"智眼识盘"
				}
			};
			const callback = (res) => {
				if (res.solely_code == 100000) {
					api.buttonCanClick(self, true);
					api.showToast('验证码已发送', 'none');
					//设置一分钟的倒计时
					var interval = setInterval(function() {
						currentTime--; //每执行一次让倒计时秒数减一
						self.setData({
							text: currentTime + 's', //按钮文字变成倒计时对应秒数
						})
						//如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
						if (currentTime <= 0) {
							clearInterval(interval)
							self.setData({
								text: '重新发送',
								currentTime: 61,
							})
						}
	
					}, 1000);
				} else {
					api.buttonCanClick(self, true);
					api.showToast(res.msg, 'none')
				}
			};
			api.codeGet(postData, callback)
		};
	},
	
	userInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = {
			phone:self.data.submitData.phone
		};
		postData.smsAuth={
		   code:self.data.submitData.code,
		   phone:self.data.submitData.phone
		};
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				api.showToast('绑定成功', 'none');
				self.close()
			} else {
				api.showToast('网络故障', 'none')
			};
	
		};
		api.userInfoUpdate(postData, callback);
	},
	
	
	
	close(){
		const self = this;
	
		self.data.isBind = false;
		self.getUserData();
		self.setData({
			isBind:self.data.isBind
		})
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式不正确', 'none')
	
			} else {
				wx.showLoading();
				const callback = (user, res) => {
					self.userInfoUpdate();
				};
				api.getAuthSetting(callback);
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
	
		};
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
		var type = api.getDataSet(e,'type')
		var index = api.getDataSet(e, 'index')
		if (self.data.userData.info.phone == '') {
			api.buttonCanClick(self, true);
			self.data.isBind = true;
			self.setData({
				isBind:self.data.isBind
			});
		} else {
			self.addOrder(index,type)
		}
		
	},

	addOrder(index,type) {
		const self = this;
		const postData = {
			tokenFuncName: 'getProjectToken',
			data: {
				passage1:type
			}
		};
		postData.orderList = [{
			product: [{
				id: self.data.mainData[index].id,
				count: 1
			}, ],
			type: 1
		}, ]
		const callback = (res) => {
			if (res && res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.pathTo('/pages/orderform/orderform?order_id='+res.info.id, 'nav')
			} else {
				api.buttonCanClick(self, true);
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
