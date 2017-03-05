# 一元夺宝项目介绍
与三真艺术合作，开发类似网易一元夺宝的项目。（全民艺术家）
艺术家将作品拍成照片，创建一个宝贝，并附加图片及文字说明到后台，等待审核（审核可能要求艺术家将作品放到公司寄存），审核通过后自动发布到网站上，艺术家自行发布到朋友圈，等待微信用户投注。
艺术家可以查看自己的宝贝列表，状态，满额后可以自己设置开奖随机数开奖。（建议抽奖方案：首先系统选择一个随机数在1-最大值之间，艺术家从1-最大值之间随机选一个，两个值相加对最大值取余就是当期中奖的号码）
用户看到艺术家在朋友圈发布的作品后有兴趣会关注公众号并投注，后台会记录用户信息及用户电话号码及用户因参与哪个艺术品而关注公众号。
管理人员能对艺术品进行审核上架下架处理。

# 问题
1, 艺术品长时间无法凑够标的额，怎么办？
2, 下架怎么退款？

# 数据结构
+ 创建数据库
CREATE DATABASE `wpcoin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

+ post: 艺术品 & postmeta: 艺术品额外信息
    - {id, desc: {name, artist, desc/excerpt}, _mainImage_, _mainImageThumb_, images}
    - {status, unit, count, lucky}
    - {ownerId}
    - {favor}
    - 关联信息{rating[五级评价，与人关联]}
+ user: 用户信息 & usermeta: 用户额外信息
    - {id, openid, pass, nicename, avatar, phone, address }
    - {caps}
    - {status}
+ order: 订单表
    - {id, uuid, userId, postId, count}
## 艺术品信息包含字段
标题title、作品介绍content（创作人员、创作日期、收藏轨迹、艺术评价）、照片列表pictureList、摘要excerpt
标签、分类
拥有者

# 页面
## 框架页面
## 艺术品列表 （所有进行中的艺术品 /artworks，按类列表 /artworks/:category）
## 艺术品详情 （/artwork/:id, 艺术品详情，艺术品状态[草案draft，待审核pending，审核失败fail，进行中publish，已揭晓/完成finish，已撤销canceled，已删除deleted]，投注列表，中签号、中签人，艺术品推荐）
+ thumbs 图片列表（至少一张，至多5张）
+ name 艺术品名称
+ price 总价格即总注数
+ desc 艺术品详情
+ luckyNumber 幸运号码
+ orders 用户投注列表

## 我的->夺宝记录 （全部/my/orders，进行中/orders/publish，已揭晓/orders/finish，已取消/orders/canceled），
## 我的->幸运记录 (/my/fortune)
## 我的->橱窗宝贝 （全部/my/artworks，未开始/my/artworks/:status=draft,pending,fail,canceled，进行中publish，已揭晓finish） 
## 我的->创建/编辑艺术品(/my/create(edit)/artwork)
## 管理员页面-> 艺术品列表（/admin/artworks全部，/admin/artworks/:status草案，待审核，审核失败，进行中，已揭晓/完成，已撤销，已删除）（按类型列表/admin/artworks/:category）
## 管理员页面-> 艺术家（粉丝）分析（/admin/users） / 艺术品分析
## 管理员页面-> 分类管理（/admin/artwork_categories），创建分类，删除分类


