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

	},

	onLoad(options) {
		const self = this;
		//self.getMainData()
	},

	getMainData() {
		wx.request({
			url: 'http://yapi.lxbtrip.cn/mock/19/mshop/v1/{id}/product/{pId}',
			data: {
				id:1,
				pId:100
			},
			method: 'get',
			/*header: {
			    'content-type': 'application/json',
			    'token': wx.getStorageSync('token')
			},*/
			success: function(res) {
				// 判断以2（2xx)开头的状态码为正确
				// 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
				
			},
			fail: function(err) {

				wx.showToast({
					title: '网络故障',
					icon: 'fail',
					duration: 2000,
					mask: true,
				});
				getApp().globalData.buttonClick = false;
			}
		});
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)

	},

	tab(e) {
		const self = this;
		api.buttonCanClick(self);
		var currentId = api.getDataSet(e, 'id');
		if (currentId == 0) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['招生政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		} else if (currentId == 1) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['批次录取政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		} else if (currentId == 2) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['加分政策']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		}
		self.setData({
			currentId: api.getDataSet(e, 'id')
		});
		self.getMainData(true);
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

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
