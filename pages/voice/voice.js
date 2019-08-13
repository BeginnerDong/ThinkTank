import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();
const innerAudioContext = wx.createInnerAudioContext();

Page({
	data: {

		mainData: [],
		getBefore: {},
		isFirstLoadAllStandard: ['getMainData'],
		currentPath:'',
		status:'',
		duration:'00:00',
		nowSeconds:0
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
			
			var res = token.getProjectToken(function(){
				self.getMainData()
			},{});
			if(res){
				self.getMainData()
			};
		
		}else{
			api.showToast('跳转参数有误','none')
		}

	},

	onUnload(){
		const self = this;
		innerAudioContext.destroy()
	},

	play(e){

		const self = this;
		var path = api.getDataSet(e,'path');
		
		if(self.data.currentPath == path){
			if(self.data.status=='play'){
				innerAudioContext.pause();
				self.data.status = 'pause';
			}else if(self.data.status=='pause'){
				innerAudioContext.play();
        		self.data.status = 'play';
			};
		}else{
			self.data.duration = '00:00';
			self.data.nowSeconds = 0;
			self.setData({
				web_duration:self.data.duration
			});
        	innerAudioContext.src = path;
        	innerAudioContext.play();
        	setTimeout(function(){
        		console.log(111)
        		innerAudioContext.duration;
        		innerAudioContext.currentTime;
        		innerAudioContext.onTimeUpdate(() => {
        			
        			var nowSeconds = Math.floor(innerAudioContext.currentTime);
        			if(nowSeconds>self.data.nowSeconds){
        				self.data.nowSeconds = nowSeconds;
	        				self.data.duration = self.calDuration(self.data.nowSeconds);
	        				
			    			self.setData({
			    				web_duration:self.data.duration
			    			})
        			};
			    })
        	},100)
        	self.data.currentPath = path;
        	self.setData({
        		web_currentPath:self.data.currentPath
        	});
        	self.data.status = 'play';
		};
		
	},
	calDuration(seconds){
		var duration = '';
		if(seconds<60){
			if(seconds<10){
				duration = '00:0'+seconds;
			}else{
				duration = '00:'+seconds;
			};
		}else{
			var min = parseInt(seconds/60);
			if(min<10){
				duration = duration + '0' + min + ':';
			}else{
				duration = duration + min + ':';
			};
			var sec = seconds - (min*60);
			if(sec<10){
				duration = duration + '0' +sec;
			}else{
				duration = duration + sec;
			};
		};
		return duration;
	},
	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		//postData.tokenFuncName = 'getProjectToken';
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
				for (var i = 0; i < self.data.mainData.length; i++) {
					if(self.data.mainData[i].bannerImg[0]){

						(function(e){
							setTimeout(function(){
								var testaudi = wx.createInnerAudioContext();
								testaudi.src = self.data.mainData[e].bannerImg[0].url;
								testaudi.onCanplay(() => {
						      		testaudi.duration; //类似初始化-必须触发-不触发此函数延时也获取不到
						      		testaudi.currentTime; //类似初始化-必须触发-不触发此函数延时也获取不到
							      	setTimeout(function () {
										if(testaudi.duration){
											self.data.mainData[e].o_duration = self.calDuration(parseInt(testaudi.duration));
										}else{
											self.data.mainData[e].o_duration = self.data.mainData[e].description;
										};
								      	
										console.log('testaudi.duration',testaudi.duration)
										self.setData({
											web_mainData:self.data.mainData
										})
								     }, 100)  //这里设置延时1秒获取
							    })
							},101*(e+2));
						})(i)
					};
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			console.log('getMainData',self.data.mainData);
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
