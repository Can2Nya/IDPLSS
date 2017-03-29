# [兴趣驱动个性化学习模拟系统](study.jxnugo.com)
![idplss_logo](http://oj387fyvl.bkt.clouddn.com/idplss_logo.png)

## 简介
兴趣驱动个性化学习模拟系统(名字老师取的~)是一个微型的仿慕课类在线学习系统，包含课程视频观看，文本资料共享，在线测试，学习交流板块。因为系统实现了简单的推荐算法（基于领域的推荐算法），因此项目名中有兴趣驱动四字，希望能通过对用户学习数据的分析，给用户推荐感兴趣的资料

   * 项目web主页: [主页](http://study.jxnugo.com)


## 技术栈

#### 1、后端采用技术
* Python Flask
* Mysql
* Redis(缓存)
* Celery(任务队列)


##### 2、前端
* HTML
* Less
* JavaScript
* React (主要)
* React-router
* React-redux
* ant design(蚂蚁金服React UI框架)
* webpack（打包工具）


#### 3、服务器部署
* 环境：阿里云ECS ubuntu 14.04 LTS
* gunicorn
* nginx
* supervisor

> 因服务器配置较低，部署的项目多，访问可能会速度慢

#### 4、技术要点
* 使用Restful API设计，解决浏览器跨域问题，减轻了前后端的代码依赖，降低耦合。
* 使用Redis和Celery构建任务队列，对前端请求的热点数据进行备份，提高并发性。
* 使用Nginx+supervisor+gunicorn+virtualenv进行服务器部署。
* 使用pandas,numpy实现了简单基于领域的推荐算法，分析用户行为。
* 灵活使用第三方库和服务（邮件服务，富文本存储）来实现所需的部分功能以及应用加速。

## 联系
如果项目有疑问，请联系ddragonever@gmail.com








