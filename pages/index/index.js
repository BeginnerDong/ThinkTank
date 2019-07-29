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
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 1000,
		previousMargin: 0,
		nextMargin: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData', 'getSliderData'],
		sForm:{
			title:''
		},
		text: '获取验证码', //按钮文字
		currentTime: 61, //倒计时 
		submitData:{
			phone:'',
			code:''
		},
		isBind:true,
		isGroup:false
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getSliderData()
	},
	
	close(){
		const self = this;
		self.data.isGroup = false
		self.data.isBind = false;
		self.setData({
			isGroup:self.data.isGroup,
			isBind:self.data.isBind
		})
	},
	
	join(){
		const self = this;
		self.data.isGroup = true
		self.setData({
			isGroup:self.data.isGroup,
		})
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
	
	changeBindTwo(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		console.log(self.data.submitData);
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	
	goSearch(){
		const self = this;
		if(self.data.sForm.title!=''){
			api.pathTo('/pages/search/search?title='+self.data.sForm.title,'nav')
		}else{
			api.showToast('请输入名称搜索','none')
		}
	},
	
	

	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			title: '首页轮播图'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.sliderData = res.info.data[0]
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
			self.setData({
				web_sliderData: self.data.sliderData,
			});
		};
		api.labelGet(postData, callback);
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
		postData.getBefore = {
			label: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['资讯文章']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},
	
		userInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.sForm);
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
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.sForm.phone;
		const pass = api.checkComplete(self.data.sForm);
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
