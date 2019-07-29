//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {


    isFirstLoadAllStandard:['getMainData'],
    searchItem:{
      thirdapp_id:2
    }
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);

    self.data.id = options.id;
    self.getMainData();
  },

  getMainData(){
    const self= this;
    const postData = {};
    postData.searchItem =api.cloneForm(self.data.searchItem)
    postData.searchItem.id=self.data.id;
    const callback = (res)=>{
      self.data.mainData = {};
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.mainData);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
  },
  

})
