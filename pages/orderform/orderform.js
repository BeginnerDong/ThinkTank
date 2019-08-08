import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp()


Page({
	data: {
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		userCouponData:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.type = options.type;
		self.data.order_id = options.order_id;
		self.getMainData();
		if(self.data.type=='升级'){
			self.getHignProduct()
		}
	},
	
	

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.order_id
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			} else {
				api.showToast('数据错误', 'none');
			};
			 api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.getUserCouponData()
		};
		api.orderGet(postData, callback);
	},
	
	getHignProduct() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id:2,
			type:1,
			level:2
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.productData = res.info.data[0];
			} 
			self.setData({
				web_productData: self.data.productData,
			});
		};
		api.productData(postData, callback);
	},
	
	getUserCouponData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			use_step:1
		};
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.userCouponData.push.apply(self.data.userCouponData, res.info.data);
			} 
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserCouponData', self);
			self.setData({
				web_userCouponData: self.data.userCouponData,
			});
			self.countPrice()
		};
		api.userCouponGet(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const callback = (res) => {
			self.pay()
		};
		api.getAuthSetting(callback);
	},
	
	countPrice(){
		const self = this;
		self.data.pay = {};
		if(self.data.type=='升级'){
			if(self.data.userCouponData.length>0){
				self.data.pay = {
					wxPay:{
						price:(self.data.mainData.price - (self.data.userCouponData[0].value +self.data.productData.price)).toFixed(2)
					},
					coupon:[{
						id:self.data.userCouponData[0].id,
						price:self.data.userCouponData[0].value
					}]
				};
				
			}else{
				self.data.pay = {
					wxPay:{
						price:(self.data.mainData.price - self.data.productData.price).toFixed(2)
					},
				};
			};
		}else{
			if(self.data.userCouponData.length>0){
				self.data.pay = {
					wxPay:{
						price:(self.data.mainData.price - self.data.userCouponData[0].value).toFixed(2)
					},
					coupon:[{
						id:self.data.userCouponData[0].id,
						price:self.data.userCouponData[0].value
					}]
				};
				
			}else{
				self.data.pay = {
					wxPay:{
						price:self.data.mainData.price
					},
				};
			};
		}
		
		self.setData({
			web_pay:self.data.pay
		})
		
	},
	

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


	pay(order_id) {
		const self = this;
		var order_id = self.data.order_id;
		const postData = self.data.pay;
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: order_id
		};	
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.solely_code == 100000) {
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							setTimeout(function() {
								api.pathTo('/pages/user/user', 'rela');
							}, 800)
						};
					};
					api.realPay(res.info, payCallback);
				} else {
					api.showToast('支付成功', 'none');
					setTimeout(function() {
						api.pathTo('/pages/user/user', 'rela');
					}, 800);
				};
			} else {
				api.showToast('支付失败', 'none')
			}
		};
		api.pay(postData, callback);
	},






})
