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
		sForm:{
			title:''
		},
		order:{
			listorder:'desc'
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
	
		
		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['主课程']],
				},
				middleKey: 'category_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.getMainData();
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
	
	
	goSearch(){
		const self = this;
		if(self.data.sForm.title!=''){
			api.pathTo('/pages/search/search?title='+self.data.sForm.title+'&type=part','nav')
		}else{
			api.showToast('请输入名称搜索','none')
		}
	},
		
	changeOrder(e){
		const self = this;
		var key = api.getDataSet(e,'key');
		if((key=='view_count'&&self.data.order.view_count=='asc')||!self.data.order.view_count){
			delete self.data.order.score;
			self.data.order.view_count = 'desc'
		}else if(key=='view_count'&&self.data.order.view_count=='desc'){
			self.data.order.view_count = 'asc'
		}else if((key=='score'&&self.data.order.score=='asc')||!self.data.order.score){
			delete self.data.order.view_count;
			self.data.order.score = 'desc'
		}else if(key=='score'&&self.data.order.score=='desc'){
			self.data.order.score = 'asc'
		};
		self.getMainData(true)
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
		postData.getBefore = api.cloneForm(self.data.getBefore);
		postData.order = api.cloneForm(self.data.order);
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
