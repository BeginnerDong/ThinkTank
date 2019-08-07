//logs.js
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
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 1000,
		previousMargin: 0,
		nextMargin: 0,
		currentData: 0,
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			thirdapp_id: 2
		},
		isInCollectData: false,
		messageData:[]
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.data.id = options.id;
		var collectData = api.getStorageArray('collectData');
		self.data.isInCollectData = api.findItemInArray(collectData, 'id', self.data.id);
		self.getMainData();
		self.setData({
			web_isInCollectData: self.data.isInCollectData,
		});
	},

	collect() {
		const self = this;
	
		if (self.data.isInCollectData) {
			api.delStorageArray('collectData', self.data.mainData, 'id');
		} else {
			api.setStorageArray('collectData', self.data.mainData, 'id', 999);
		};
		var collectData = api.getStorageArray('collectData');
		self.data.isInCollectData = api.findItemInArray(collectData, 'id', self.data.id);
		self.setData({
			web_isInCollectData: self.data.isInCollectData,
		});
	},

	checkCurrent(e) {
		const self = this;
		var currentData = api.getDataSet(e, 'current');
		if (self.data.currentData != currentData) {
			self.data.currentData = currentData;
			self.setData({
				currentData: self.data.currentData
			})
		}
	},

	getMainData() {
		const self = this;
		const postData = {};
		
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.searchItem.id = self.data.id;
		postData.getAfter = {
			sku: {
				tableName: 'Sku',
				middleKey: 'product_no',
				key: 'product_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		const callback = (res) => {
			self.data.mainData = {};
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				if(self.data.mainData.sku.length>0){
					self.data.chooseSku = self.data.mainData.sku[0]
				};
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			};
			api.setStorageArray('footData', self.data.mainData, 'id', 999);
			console.log(self.data.mainData);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_chooseSku:self.data.chooseSku,
				web_mainData: self.data.mainData,
			});
			self.getMessageData()
		};
		api.productGet(postData, callback);
	},
	
	getMessageData() {
		const self = this;
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			relation_id:self.data.id,
			type:2
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info:['headImgUrl','nickname']
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data);
				
			} else {
				self.data.isLoadAll = true;
				
			};
			self.setData({
				web_total:res.info.total,
				web_messageData: self.data.messageData,
			});
		};
		api.messageGet(postData, callback);
	},
	
	vedioPlay(e) {
		const self = this;
	
		var videoId = api.getDataSet(e,'id');
		console.log(videoId)
		if (videoId && self.data.playId != videoId) {
			if (self.data.playId) {
				var videoContextPrev = wx.createVideoContext(self.data.playId)
				videoContextPrev.pause();
			};
			self.data.playId = videoId;
			var videoContextNext = wx.createVideoContext(self.data.playId)
			console.log(videoContextNext)
			videoContextNext.play();
			self.setData({
				web_playId: self.data.playId
			})
		};
	
	},
	
	chooseSku(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.chooseSku = self.data.mainData.sku[index];
		self.setData({
			web_chooseSku:self.data.chooseSku
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
		
			self.getMainData();
		};
	},
	
})
