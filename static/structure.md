## layouts

id为layout的action.payload
```
.
├──index(主页)(NavAndMarginWithFooter)id:1
├──nav+foot(不同于主页的导航和)(navWithFooter)id:2
│ ├──classes(分类)(用于视频，文库，测试)
│ ├──detail(详情)(用于视频，文库，测试)
│ ├──learn classes(学习分类)
├──only nav(视频，文库，测试，用户)(navWithoutFooter)id:3

```

## components

详见sketch里的symbol］
可以复用的component后面在思考

## url
```
### id:1
/ or /index
---
### id:2
全部分类
/category/video/#!/1/1 #視頻分類 hash#!/(分类)/(页数)
/category/text  #文本分類
/category/test  #測試分類

/detail/video/<:id>  #視頻描述『以此推類』
/detail/text/<:id>
/detail/text/<:id>
...

/search/video/<:searchText> ＃搜索「暫定」
...

/forum/ #「換名字系列」
...
---
### id:3

/play/video/<:id> #播放視頻「以此推類」
...
/user/student/<:id>/<後面可能會追加參數> #用戶「學生 #还是不用这样好惹
/user/teacher/<:id>/<後面可能會追加參數>  #用戶「教師

/user/:id/


```
### 题外话，location.state

不知道怎么设计这个state结构好。。。暂定

state
├──发出改变state的控件名称
│ ├──健:值

location.state不宜做日常传值［因为只有点击才会改变state，大概？］
可以用来验证是否点击23333

# 组件prop

## Title 标题栏

prop	|   描述  		  |	  类型	| 默认值|
:.......|.................|.........|......:
title   | 需要显示的标题名称 | string  |   x  |
type    | 标题大小		  | string  | x('big'or'small')|

## Menu 分类栏

prop	|   描述  		  |	  类型	| 默认值|
:.......|.................|.........|......:
title   | 需要显示的标题名称 | string  |   x  |
selectkey    | 已选择的菜单		  | int  | x|
location    | router location 传一个进来就对啦 | obj  | x |
