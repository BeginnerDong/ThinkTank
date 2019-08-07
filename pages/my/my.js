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
		currentData:0,
		mainData: [],
		searchItem: {
			thirdapp_id:2,
			use_step:1
		},
		isFirstLoadAllStandard: ['getMainData'],
	},


	onLoad() {
		const self = this;
		api.commonInit(self);
	
	},
	
	onShow(){
		const self = this;
		self.getMainData()
	},
	
	checkCurrent(e){
		const self = this;
		api.buttonCanClick(self);
		var current = api.getDataSet(e,'current');
		if(self.data.currentData!=current){
			self.data.currentData = current;
			if(self.data.currentData==0){
				self.getMainData(true)
			}else if(self.data.currentData ==1){
				self.data.searchItem.use_step =1;
				self.getMainDataTwo(true)
			}else if(self.data.currentData==2){
				self.data.searchItem.use_step = -1;
				self.getMainDataTwo(true)
			};
			self.setData({
				currentData:self.data.currentData
			})
		}
	},
	
	getMainDataTwo(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = api.cloneForm(self.data.searchItem)
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].create_time = self.data.mainData[i].create_time.substring(0, 10);
					self.data.mainData[i].invalid_time = api.timestampToTime(self.data.mainData[i].invalid_time);
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.userCouponGet(postData, callback);
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
		postData.getAfter = {
			userCoupon:{
				token:wx.getStorageSync('token'),
				tableName:'UserCoupon',
				middleKey:'coupon_no',
				key:'coupon_no',
				searchItem:{
					status:1
				},
				condition:'='
			}
		};
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					
					self.data.mainData[i].start_time = api.timestampToTime(self.data.mainData[i].start_time);
					self.data.mainData[i].end_time = api.timestampToTime(self.data.mainData[i].end_time);
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.couponGet(postData, callback);
	},
	
	couponAdd(e) {
		const self = this;
		var now =  (new Date()).getTime();
		api.buttonCanClick(self);
		console.log(e);
		var index = api.getDataSet(e, 'index');
		const postData = {
			tokenFuncName: 'getProjectToken',
			coupon_id: self.data.mainData[index].id,
			
			data:{
				pay_status:1,
				invalid_time:now + self.data.mainData[index].valid_time 
			}
		};
		console.log('postData', postData)
	
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res && res.solely_code == 100000) {
				api.showToast('领取成功！', 'none', 2000)
				self.data.currentData = 1;
				self.data.searchItem.use_step =1;
				self.getMainDataTwo(true)
				self.setData({
					currentData:self.data.currentData
				})
			} else {
				api.showToast(res.msg, 'none')
			}
	
		};
		api.couponAdd(postData, callback);
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
