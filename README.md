# 智囊团项目开发文档

### 目录

- 功能概述
- 数据对照表


---

**1\. 功能概述**

&emsp;&emsp;项目主要功能包括：
包含用户管理、菜单管理、文章管理、商品管理、订单管理等基本模块；
支持微信支付；

---
**2\. 数据对照表**

### 通用字段说明

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| id | int(11)| 主键：该数据ID |
| listorder | int(11) | 自定义排序 |
| img_array | varchar(100) | 图片组 |
| create_time | int(11) | 创建时间 |
| update_time | int(11) | 更新时间 |
| delete_time | int(11) | 删除时间 |
| thirdapp_id | int(11) | 关联thirdapp |
| user_no | varchar(255) | 关联user |
| user_type | tinyint(2) | 用户类型0.前端2.cms |
| status | tinyint(2) | 状态:1正常；-1删除 |



### user表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| nickname | varchar(255) | 微信昵称 |
| openid | varchar(255) | 微信openid |
| headImgUrl | varchar(9999) | 微信头像 |
| primary_scope | int(255) | 权限级别：90平台管理员;60超级管理员;30管理员;10用户 |
| user_type | tinyint(2) | 0,小程序用户;2,cms用户; |
| user_no | varchar(255) | 用户编号|



### user_info表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| name | varchar(255) | 姓名 |
| phone | varchar(255) | 电话 |
| level | tinyint(2) | 0.非会员,1.智囊团会员,2.智囊团钻石会员 |
| deadline | int(11) | 会员有效期 |



### label表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------  | 
| title | varchar(40) | 菜单名称 |
| description| varchar(255) | 描述 |
| parentid| int(11) | 父级菜单ID |
| type | tinyint(2) |  1,menu;2,menu_item; |



### article表-文章（type=1）

| 字段 | 类型 | 说明 |
| ------ |  :------:  | ------  | 
| title | varchar(100) | 文章标题 |
| menu_id | int(11) | 关联label表 |
| type | int(11) | 1.文章2.音频 |
| description | varchar((255) | 描述 |
| content | text | 文章内容 |
| mainImg | varchar(9999) | 文章主图 |



### article表-音频（type=2）

| 字段 | 类型 | 说明 |
| ------ |  :------:  | ------  | 
| title | varchar(100) | 标题 |
| small_title | varchar(100) | 讲师名称 |
| menu_id | int(11) | 关联label表 |
| type | int(11) | 1.文章2.音频 |
| description | varchar((255) | 音频时长 |
| content | text | 文章内容 |
| mainImg | varchar(9999) | 音频头像 |
| bannerImg | varchar(9999) | 音频文件 |




### message表-留言(type=1)

| 字段 | 类型 | 说明 |
| ------ |  :------:  | ------  | 
| title | varchar(255) | 标题 |
| description | varchar(255) | 描述 |
| content | text | 内容 |
| mainImg | varchar(999) | 主图，一般在列表渲染 |



### log表

| 字段 | 类型 | 说明 |
| ------ |  :------:  | ------  | 
| type | int(11) | 类别:4.点赞;5.关注; |
| order_no | varchar(100) | 关联message |
| pay_no | varchar(255) | 关联user |



### pay_log表

| 字段 | 类型 | 说明 |
| ------ |  :------:  | ------  | 
| title | varchar(255) | 标题 |
| result | varchar(255) | 结果描述 |
| content | text | 详情 |
| type | int(11) | 类别:1.微信支付 |
| order_no | varchar(100) | 关联order |
| pay_no | varchar(255) | 关联flowLog |
| transaction_id | varchar(255) | 微信流水 |
| behavior | int(11) | 预留 |
| pay_info | varchar(999) | 支付信息 |
| prepay_id | varchar(255) | 订单微信支付的预订单id(用于发送模板消息) |
| wx_prepay_info | varchar(999) | 储存微信预支付信息，再次调起支付使用 |



### product表-会员（type=1）

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| product_no | varchar(255) | no编号 |
| title | varchar(255) | 商品名称 |
| description | varchar(255) | 描述 |
| content | text | 详情 |
| mainImg | text | 主图 |
| bannerImg | text | banner图 |
| category_id | int(11) | 关联label表 |
| price | decimal(10,2) | 价格 |
| stock | int(11) | 库存 |
| sale_count | int(11) | 销量 |
| duration | bigint(13) | 有效期-毫秒数 |
| level | tinyint(2) | 1.智囊团会员2.智囊团钻石会员 |



### product表-视频（type=2）

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| product_no | varchar(255) | no编号 |
| title | varchar(255) | 课程名称 |
| description | varchar(255) | 课程描述 |
| content | text | 课程介绍 |
| mainImg | text | 主图 |
| bannerImg | text | banner图 |
| category_id | int(11) | 关联label表 |
| view_count | int(11) | 学习人数 |
| score | int(11) | 好评数 |
| difficulty | varchar(10) | 课程难度 |
| times | varchar(20) | 时长 |
| teacher | varchar(10) | 讲师 |
| headImg | text | 讲师头像 |
| introduction | varchar(500) | 讲师介绍 |



### sku表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| sku_no | varchar(255) | no编号 |
| product_no | varchar(255) | 关联product表 |
| title | varchar(255) | 商品名称 |
| price | decimal(10,2) | 价格 |
| stock | int(11) | 库存 |
| sale_count | int(11) | 销量 |



### order表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| order_no | varchar(255) | no |
| pay | varchar(255) | pay方式详情 |
| price | decimal(10,2) | 订单金额 |
| pay_status | tinyint(2) | 0.未支付1.已支付 |
| type | tinyint(2) | 1.普通商品,2.会员卡 |
| order_step | tinyint(2) | 0.正常下单,1.申请撤单,2.完成撤单,3.完结 |
| transport_status | tinyint(2) | 0.未发货；1.配送中；2.已收货 |
| prepay_id | varchar(255) | 订单微信支付的预订单id |
| wx_prepay_info | varchar(999) | 储存微信预支付信息 |
| transaction_id | varchar(999) | 微信交易id，退款需要 |



### coupon表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| coupon_no | varchar(255) | 优惠券编号 |
| title | varchar(255) | 标题 |
| description | varchar(255) | 描述 |
| content | text | 详情 |
| mainImg | text | 主图 |
| bannerImg | text | 轮播图 |
| price | decimal(10,2) | 价格 |
| score | int(11) | 最高可使用积分 |
| value | int(11) | 价值，可抵扣金额 |
| discount | int(11) | 折扣百分比，默认100，即无折扣 |
| condition | int(11) | 使用条件，满减要求 |
| stock | int(11) | 库存 |
| sale_count | int(11) | 销量 |
| type | int(11) | 1.抵扣券2.折扣券 |
| valid_time | int(13) | 有效期-毫秒数 |
| start_time | int(13) | 开始时间 |
| end_time | int(13) | 结束时间 |




### user_coupon表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| type | tinyint(2) | 1.抵扣券2.折扣券 |
| use_step | tinyint(2) | 1.未使用2.已使用-1.已过期 |
| invalid_time | bigint(13) | 过期时间戳，前段记录13位 |



### qrcode表

| 字段 | 类型 | 说明 |
| ------ | ------  | ------ | 
| vip_code | varchar(255) | 邀请码 |
| level | tinyint(2) | 1.智囊团会员2.智囊团钻石会员 |
| use_step | tinyint(2) | 1.未使用2.已使用 |
| use_no | varchar(255) | 兑换人 |
| valid_time | bigint(13) | 有效期-毫秒数 |

---