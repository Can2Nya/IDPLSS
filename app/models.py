# coding: utf-8
import random
from datetime import datetime

from flask import current_app, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

from app import db
from app.utils.model_tools import set_model_attr, user_info_transform, id_change_user, time_transform


class Permission:
    """
    系统权限划分
    说明:
    暂无
    """
    COMMENT_FOLLOW_COLLECT = 0x01
    UPLOAD_RESOURCE = 0x02
    UPLOAD_VIDEO = 0x04
    WRITE_ARTICLE = 0x08
    DELETE_VIDEO = 0x10
    DELETE_RESOURCE = 0x20
    DELETE_ARTICLE = 0x40
    ADMINISTER = 0x80

    def __init__(self):
        pass


class Follow(db.Model):
    """
    用户关注表:
    follower_id:粉丝id
    followed_id:被关注者id
    """
    __tablename__ = 'follows'
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return '< follower_id %r>' % self.followed_id

    def followers_to_json(self):
        json_follow = {
            "name": user_info_transform(self.follower_id, 'name'),
            "user_url": url_for('main.show_user', uid=self.follower_id, _external=True),
            "user_id": self.follower_id,
            "user_avatar": user_info_transform(self.follower_id, 'avatar'),
            "about_me": user_info_transform(self.follower_id, 'about_me')
        }
        return json_follow

    def following_to_json(self):
        json_following = {
            "name": user_info_transform(self.followed_id, 'name'),
            "user_url": url_for('main.show_user', uid=self.followed_id, _external=True),
            "user_id": self.followed_id,
            "user_avatar": user_info_transform(self.followed_id, 'avatar'),
            "about_me": user_info_transform(self.followed_id, 'about_me')
        }
        return json_following


class Role(db.Model):
    """
    角色表,定义系统中用户角色
    分为:学生,教师,学校管理员,系统管理员
    说明:暂无
    """
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True, index=True)
    role_name = db.Column(db.String(32), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    users = db.relationship('User', backref='role', lazy='dynamic')

    @staticmethod
    def create_roles():
        roles = {
            'Student': (Permission.COMMENT_FOLLOW_COLLECT |
                        Permission.UPLOAD_RESOURCE |
                        Permission.WRITE_ARTICLE, True),
            'Teacher': (Permission.COMMENT_FOLLOW_COLLECT |
                        Permission.UPLOAD_RESOURCE |
                        Permission.UPLOAD_VIDEO |
                        Permission.WRITE_ARTICLE, False),
            'SchoolAdmin': (Permission.COMMENT_FOLLOW_COLLECT |
                            Permission.UPLOAD_VIDEO |
                            Permission.UPLOAD_RESOURCE |
                            Permission.WRITE_ARTICLE |
                            Permission.DELETE_ARTICLE |
                            Permission.DELETE_RESOURCE |
                            Permission.DELETE_VIDEO, False),
            'Admin': (0xff, False)

        }
        for r in roles:
            role = Role.query.filter_by(role_name=r).first()
            if role is None:
                role = Role(role_name=r)
            role.permissions = roles[r][0]
            role.default = roles[r][1]
            db.session.add(role)
        db.session.commit()

    def __repr__(self):
        return '<Role %r>' % self.role_name


collectionPosts = db.Table('collectionPosts',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)
    )


collectionCourses = db.Table('collectionCourses',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id')),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)
    )


collectionTextResource = db.Table('collectionTextResource',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('text_resource_id', db.Integer, db.ForeignKey('text_resources.id')),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)
    )


class User(db.Model):
    """
    用户信息表
    说明:
    user_type: 0代表学生,用户注册时默认为学生,1代表教师,school_admin可以对该值进行修改


    """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, unique=True)
    user_name = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(32), unique=True, index=True)
    user_type = db.Column(db.Integer, default=0)
    avatar = db.Column(db.String(64))
    is_ban = db.Column(db.Boolean, default=False)  # 用户是否被屏蔽
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow, index=True)
    confirmed = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(32))
    sex = db.Column(db.Integer, default=0)  # 性别  0代表男生  1代表女生
    subject = db.Column(db.String(32))  # 注册填写专业学科类别 1哲学 2经济学 3法学 4教育学 5文学 6历史学 7理学 8工学 9农学 10医学 11军事学 12管理学
    interested_field = db.Column(db.String(32))  # 注册时填写感兴趣的领域 基础科学1 工程技术2 历史哲学3 经管法律4 语言文化5 艺术音乐6 兴趣生活7
    about_me = db.Column(db.String(128))
    followings = db.relationship('Follow', foreign_keys=[Follow.follower_id], backref=db.backref('follower',
                                lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys=[Follow.followed_id], backref=db.backref('followed',
                                lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    post_comments = db.relationship('PostComment', backref='author', lazy='dynamic')
    courses = db.relationship('Course', backref='author', lazy='dynamic')
    courses_video = db.relationship('VideoList', backref='uploader', lazy='dynamic')
    course_comments = db.relationship('CourseComment', backref='author', lazy='dynamic')
    text_resource = db.relationship('TextResource', backref='uploader', lazy='dynamic')
    text_resource_comments = db.relationship('TextResourceComment', backref='author', lazy='dynamic')
    collection_posts = db.relationship('Post', secondary=collectionPosts,
                                       backref=db.backref('users', lazy='dynamic'), lazy='dynamic')
    collection_courses = db.relationship('Course', secondary=collectionCourses,
                                        backref=db.backref('users', lazy='dynamic'), lazy='dynamic')
    collection_text_resource = db.relationship('TextResource', secondary=collectionTextResource,
                                               backref=db.backref('users', lazy='dynamic'), lazy='dynamic')
    test_list = db.relationship('TestList', backref='author', lazy='dynamic')
    test_problems = db.relationship('TestProblem', backref='author', lazy='dynamic')
    test_record = db.relationship('TestRecord', backref='answer', lazy='dynamic')
    answer_record = db.relationship('AnswerRecord', backref='answer', lazy='dynamic')

    @staticmethod
    def generate_fake(count=100):
        from sqlalchemy.exc import IntegrityError
        import forgery_py
        random.seed()
        for i in range(count):
            u = User(name='user_'+str(i), user_name=forgery_py.internet.user_name(True),
                     email=forgery_py.internet.email_address(), confirmed=True,
                     pass_word='123456',  about_me=forgery_py.lorem_ipsum.sentence(), member_since=forgery_py.date.date(True))
            db.session.add(u)
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()

    @staticmethod
    def add_user():
        user1 = User(user_name='ddragon', role_id=2, pass_word='123456', email='1157675625@qq.com', confirmed=True,
                     interested_field="1:2:3")
        user2 = User(user_name='test', role_id=2, pass_word='123456', email='jxnugo@163.com', confirmed=True, interested_field="1")
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            if self.email == current_app.config['IDPLSS_ADMIN']:
                self.role = Role.query.filter_by(permissions=0xff).first()
            if self.role is None:
                self.role = Role.query.filter_by(default=True).first()

    def __repr__(self):
        return '<User %r>' % self.user_name

    def to_json(self):
        json_user = {
            'user_id': self.id,
            'user_name': self.user_name,
            'name': self.name,
            'user_email': self.email,
            'user_type': self.user_type,
            'user_avatar': self.avatar,
            'user_about_me': self.about_me,
            'sex': self.sex,
            'user_member_since': time_transform(self.member_since),
            'user_last_seen': time_transform(self.last_seen),
            'interested_field': self.interested_field,
            'subject': self.subject,
            'user_followers': self.followers.count(),
            'user_followings': self.followings.count(),
            'user_role_id'
            'user_confirmed': self.confirmed
        }
        return json_user

    @staticmethod
    def from_json(user, json_user):
        user.name = set_model_attr(json_user, 'name')
        user.about_me = set_model_attr(json_user, 'about_me')
        user.avatar = set_model_attr(json_user, 'avatar')
        user.sex = set_model_attr(json_user, 'sex')
        return user

    @property
    def pass_word(self):
        raise AttributeError('the attribute can not to read')

    @pass_word.setter
    def pass_word(self, password):
        """
        设置密码,verify_password验证密码散列值是否正确
        :param password:
        :return:
        """
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expiration=3600):
        """
        生成具有时效的token,供用户登录的调用,无需每次都上传用户名和密码
        :param expiration:
        :return:
        """
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.get(data['id'])
        if user is None:
            return None
        else:
            return user

    def generate_confirm_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'confirm': self.id})

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get['confirm'] != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        db.session.commit()
        return True

    def can(self, permissions):
        return self.role is not None and (self.role.permissions & permissions) == permissions

    def is_administer(self):
        return self.can(Permission.ADMINISTER)

    def update_login_time(self):
        self.last_seen = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def follow(self, user):
        if not self.is_following(user):
            f = Follow(follower=self, followed=user)
            db.session.add(f)
            db.session.commit()

    def unfollow(self, user):
        print self.user_name
        print user.user_name
        f = self.followings.filter_by(followed_id=user.id).first()
        if f:
            db.session.delete(f)
            db.session.commit()

    def is_following(self, user):
        """
        判断当前用户是否关注了user, 如果用户已经关注,返回True,没有关注返回false
        :param user:
        :return:boolean
        """
        return self.followings.filter_by(followed_id=user.id).first() is not None

    def is_followed_by(self, user):
        """
        判断当前用户是否被user关注  如果是用户的粉丝,返回True,如果不是,返回False
        :param user:
        :return: boolean
        """
        return self.followers.filter_by(follower_id=user.id).first() is not None

    def collect_post(self, post):
        if not self.is_collecting_post(post):
            self.collection_posts.append(post)
            db.session.commit()

    def uncollect_post(self, post):
        if self.is_collecting_post(post):
            self.collection_posts.remove(post)
            db.session.commit()

    def is_collecting_post(self, post):
        if post in self.collection_posts.all():
            return True
        else:
            return False

    def is_collecting_course(self, course):
        if course in self.collection_courses.all():
            return True
        else:
            return False

    def collect_course(self, course):
        if not self.is_collecting_course(course):
            self.collection_courses.append(course)
            db.session.commit()

    def uncollect_course(self, course):
        if self.is_collecting_course(course):
            self.collection_courses.remove(course)
            db.session.commit()

    def is_collecting_text_resouurce(self, text_resource):
        if text_resource in self.collection_text_resource.all():
            return True
        else:
            return False

    def collect_text_resouce(self, text_resource):
        if not self.is_collecting_text_resouurce(text_resource):
            self.collection_text_resource.append(text_resource)
            db.session.commit()

    def uncollect_text_resource(self, text_resource):
        if self.is_collecting_text_resouurce((text_resource)):
            self.collection_text_resource.remove(text_resource)
            db.session.commit()


class AnonymousUser(object):
    def __init__(self):
        pass

    @staticmethod
    def can(permissions):
        return False

    @staticmethod
    def is_admin():
        return False


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    post_category = db.Column(db.Integer, default=1)  # 计算机/互联网0 基础科学1 工程技术2 历史哲学3 经管法律4 语言文学5 艺术音乐6
    body = db.Column(db.Text)
    page_view = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    images = db.Column(db.String(512))
    like = db.Column(db.Integer, default=0)
    show = db.Column(db.Boolean, default=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comments = db.relationship('PostComment', backref='post', lazy='dynamic')

    def __repr__(self):
        return '< Post_title %r>' % self.title

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        for i in range(count):
            p = Post(body=forgery_py.lorem_ipsum.sentences(random.randint(1,  9)), timestamp=forgery_py.date.date(True),
                     title=forgery_py.lorem_ipsum.title(),
                     post_category=random.randint(0, 6), like=random.randint(1,1000), page_view=random.randint(1, 1200),
                     show=True, author_id=random.randint(1, 100), images="http://o8evkf73q.bkt.clouddn.com/image/JXNU.png")
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_post = {
            'id': self.id,
            'title': self.title,
            'post_category': self.post_category,
            'body': self.body,
            'like': self.like,
            'page_view': self.page_view,
            'timestamp': time_transform(self.timestamp),
            'images': self.images,
            'show': self.show,
            'author_id': self.author_id,
            'author_user_name': id_change_user(self.author_id).user_name,
            'author_name': id_change_user(self.author_id).name,
            'author_avatar': id_change_user(self.author_id).avatar,
            'comments_count': self.comments.count()
        }
        return json_post

    @staticmethod
    def from_json(json_post):
        body = json_post.get('body')
        post_category = json_post.get('post_category')
        author_id = json_post.get('author_id')
        title = json_post.get('title')
        images = json_post.get('images')
        return Post(title=title, body=body, author_id=author_id, images=images, post_category=post_category)


class PostComment(db.Model):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(128))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    show = db.Column(db.Boolean, default=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

    def __repr__(self):
        return '<Comment_id %r>' % self.id

    @staticmethod
    def generate_fake(count=200):
        import forgery_py
        random.seed()
        for i in range(count):
            p = PostComment(body=forgery_py.lorem_ipsum.sentences(random.randint(1, 2)), timestamp=forgery_py.date.date(True),
                      show=True, author_id=random.randint(1, 100), post_id=random.randint(1, 100))
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_comment = {
            'comment_id': self.id,
            'body': self.body,
            'author_id': self.author_id,
            'author_user_name': id_change_user(self.author_id).user_name,
            'author_name': id_change_user(self.author_id).name,
            'author_avatar': id_change_user(self.author_id).avatar,
            'timestamp': time_transform(self.timestamp),
            'show': self.show,
            'post_id': self.post_id
        }
        return json_comment

    @staticmethod
    def from_json(json_post_comment):
        body = json_post_comment.get('body')
        author_id = json_post_comment.get('author_id')
        post_id = json_post_comment.get('post_id')
        return PostComment(body=body, author_id=author_id, post_id=post_id)


class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(128))
    description = db.Column(db.Text)
    course_category = db.Column(db.Integer, default=1)  # 计算机/互联网0 基础科学1 工程技术2 历史哲学3 经管法律4 语言文学5 艺术音乐6
    images = db.Column(db.String(512))
    like = db.Column(db.Integer, default=0)
    collect_sum = db.Column(db.Integer, default=0)  # 收藏该课程的人
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    show = db.Column(db.Boolean, default=True)
    course_all_video = db.relationship('VideoList', backref='course', lazy='dynamic')
    course_comments = db.relationship('CourseComment', backref='course', lazy='dynamic')

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        for i in range(count):
            p = Course(description=forgery_py.lorem_ipsum.sentences(random.randint(1,  9)), timestamp=forgery_py.date.date(True),
                       course_name=forgery_py.lorem_ipsum.title(), like=random.randint(1, 1000), collect_sum=random.randint(0, 200),
                       course_category=random.randint(0, 6), show=True, author_id=random.randint(1, 100),
                       images="http://o8evkf73q.bkt.clouddn.com/image/JXNU.png")
            db.session.add(p)
            db.session.commit()

    def __repr__(self):
        return '<course_name is %r>' % self.course_name

    def to_json(self):
        json_course = {
            'id': self.id,
            'course_name': self.course_name,
            'description': self.description,
            'like': self.like,
            'course_category': self.course_category,
            'images': self.images,
            'show': self.show,
            'timestamp': time_transform(self.timestamp),
            'author_id': self.author_id,
            'author_user_name': id_change_user(self.author_id).user_name,
            'author_name': id_change_user(self.author_id).name,
            'author_avatar': id_change_user(self.author_id).avatar,
            'video_count': self.course_all_video.count(),
            'comments_count': self.course_comments.count()
        }
        return json_course

    @staticmethod
    def from_json(json_course):
        course_name = json_course.get('course_name')
        description = json_course.get('description')
        category = json_course.get('category')
        images = json_course.get('images')
        author_id = json_course.get('author_id')
        return Course(course_name=course_name, description=description, course_category=category,
                       images=images, author_id=author_id)


class VideoList(db.Model):
    __tablename__ = 'video_list'
    id = db.Column(db.Integer, primary_key=True)
    video_name = db.Column(db.String(128))
    video_description = db.Column(db.Text)
    source_url = db.Column(db.String(256))
    show = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    time_line = db.Column(db.String(128))
    # TODO:保留一个timeline 如前端能返回视频的时间则用
    video_order = db.Column(db.Integer)  # 视频的顺序
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))

    def __repr__(self):
        return '<course_video_name is %r>' % self.video_name

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        user_count = User.query.count()
        random.seed()
        for i in range(count):
            u = User.query.offset(random.randint(0, user_count-1)).first()
            p = VideoList(video_description=forgery_py.lorem_ipsum.sentences(random.randint(1,  9)),
                          timestamp=forgery_py.date.date(True),
                      video_order=random.randint(1, 10), video_name=forgery_py.lorem_ipsum.title(),
                          show=True, author_id=u.id, course_id=random.randint(1, 100))
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_video = {
            'id': self.id,
            'video_name': self.video_name,
            'video_description': self.video_description,
            'source_url': self.source_url,
            'show': self.show,
            'timestamp': time_transform(self.timestamp),
            'time_line': self.time_line,
            'author_id': self.author_id,
            'video_order': self.video_order,
            'author_user_name': id_change_user(self.author_id).user_name,
            'author_name': id_change_user(self.author_id).name,
            'author_avatar': id_change_user(self.author_id).avatar,
            'course_id': self.course_id
        }
        return json_video

    @staticmethod
    def from_json(json_video):
        video_name = json_video.get('video_name')
        video_description = json_video.get('video_description')
        source_url = json_video.get('source_url')
        author_id = json_video.get('author_id')
        video_order = json_video.get('video_order')
        course_id = json_video.get('course_id')
        return VideoList(video_name=video_name, video_description=video_description, source_url=source_url,
                         author_id=author_id, course_id=course_id, video_order=video_order)


class CourseComment(db.Model):
    __tablename__ = 'course_comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(128))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    show = db.Column(db.Boolean, default=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))

    def __repr__(self):
        return 'CourseComment_id %r>' % self.id

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        user_count = User.query.count()
        random.seed()
        for i in range(count):
            u = User.query.offset(random.randint(0, user_count-1)).first()
            p = CourseComment(body=forgery_py.lorem_ipsum.sentences(random.randint(1,  5)), timestamp=forgery_py.date.date(True),
                      show=True, author_id=u.id, course_id=random.randint(1, 100))
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_comment = {
            'id': self.id,
            'body': self.body,
            'author_id': self.author_id,
            'author_user_name': id_change_user(self.author_id).user_name,
            'author_avatar': id_change_user(self.author_id).avatar,
            'author_name': id_change_user(self.author_id).name,
            'timestamp': time_transform(self.timestamp),
            'show': self.show,
            'course_id': self.course_id
        }
        return json_comment

    @staticmethod
    def from_json(json_course_comment):
        body = json_course_comment.get('body')
        author_id = json_course_comment.get('author_id')
        course_id = json_course_comment.get('course_id')
        return CourseComment(body=body, author_id=author_id, course_id=course_id)


class TextResource(db.Model):
    __tablename__ = 'text_resources'
    id = db.Column(db.Integer, primary_key=True)
    resource_name = db.Column(db.String(128))
    description = db.Column(db.Text)
    download_sum = db.Column(db.Integer, default=0)  # 下载该资源的总人数
    resource_category = db.Column(db.Integer, default=1)  # 计算机/互联网0 基础科学1 工程技术2 历史哲学3 经管法律4 语言文学5 艺术音乐6
    resource_type = db.Column(db.Integer, default=0)  # word类型1  excel类型2  pdf类型3  ppt类型4 其它0
    source_url = db.Column(db.String(256))
    like = db.Column(db.Integer, default=0)
    show = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comments = db.relationship('TextResourceComment', backref='text_resources', lazy='dynamic')

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        user_count = User.query.count()
        random.seed()
        for i in range(count):
            u = User.query.offset(random.randint(0, user_count-1)).first()
            p = TextResource(description=forgery_py.lorem_ipsum.sentences(random.randint(1,  9)), timestamp=forgery_py.date.date(True),
                             resource_name=forgery_py.lorem_ipsum.title(),
                             resource_type=random.choice([1, 3, 4]), download_sum=random.randint(1, 200),
                             like=random.randint(1, 1000), resource_category=random.randint(0, 6), show=True,
                             author_id=u.id, source_url="www.baidu.com")
            db.session.add(p)
            db.session.commit()

    def __repr__(self):
        return '<TextResource file_name %r>' % self.id

    def to_json(self):
        json_text_resource = {
            "id": self.id,
            "resource_name": self.resource_name,
            "description": self.description,
            "source_url": self.source_url,
            "show": self.show,
            "download_count":self.download_sum,
            "like": self.like,
            "resource_type": self.resource_type,
            "timestamp": time_transform(self.timestamp),
            "author_id": self.author_id,
            "author_user_name": id_change_user(self.author_id).user_name,
            "author_name": id_change_user(self.author_id).name,
            "author_avatar": id_change_user(self.author_id).avatar,
            "resource_category": self.resource_category
        }
        return json_text_resource

    @staticmethod
    def from_json(json_text_resource):
        resource_name = json_text_resource.get('resource_name')
        description = json_text_resource.get('description')
        source_url = json_text_resource.get('source_url')
        author_id = json_text_resource.get('author_id')
        resource_type = json_text_resource.get('resource_type')
        resource_category = json_text_resource.get('resource_category')
        return TextResource(resource_name=resource_name, description=description, source_url=source_url,
                            author_id=author_id, resource_type=resource_type, resource_category=resource_category)


class TextResourceComment(db.Model):
    __tablename__ = 'resource_comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(128))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    show = db.Column(db.Boolean, default=True)
    text_resource_id = db.Column(db.Integer, db.ForeignKey('text_resources.id'))

    def __repr__(self):
        return '<TextResourceComment id %r>' % self.id

    @staticmethod
    def generate_fake(count=200):
        import forgery_py
        random.seed()
        user_count = User.query.count()
        random.seed()
        for i in range(count):
            u = User.query.offset(random.randint(0, user_count-1)).first()
            p = TextResourceComment(body=forgery_py.lorem_ipsum.sentences(random.randint(1,  2)), timestamp=forgery_py.date.date(True),
                      show=True, author_id=random.randint(1, 100), text_resource_id=random.randint(1, 100))
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_text_resource_comment = {
            "id": self.id,
            "body": self.body,
            "author_id": self.author_id,
            "author_user_name": id_change_user(self.author_id).user_name,
            "author_name": id_change_user(self.author_id).name,
            "author_avatar": id_change_user(self.author_id).avatar,
            "timestamp": time_transform(self.timestamp),
            "show": self.show,
            "text_resource_id": self.text_resource_id
        }
        return json_text_resource_comment

    @staticmethod
    def from_json(json_resource_comment):
        body = json_resource_comment.get('body')
        author_id = json_resource_comment.get('author_id')
        text_resource_id = json_resource_comment.get('text_resource_id')
        return TextResourceComment(body=body, author_id=author_id, text_resource_id=text_resource_id)


class TestList(db.Model):
    """
    测试表,用来保存测试试卷信息
    """
    __tablename__ = 'test_list'
    id = db.Column(db.Integer, primary_key=True)
    test_title = db.Column(db.String(128))
    test_description = db.Column(db.Text)
    show = db.Column(db.Boolean, default=True)
    test_sum = db.Column(db.Integer, default=0)  # 参与过该测试的人
    test_category = db.Column(db.Integer, default=1)  # 计算机/互联网0 基础科学1 工程技术2 历史哲学3 经管法律4 语言文学5 艺术音乐6
    key_words = db.Column(db.String(128))  # 存储该试卷对应的知识点
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    like = db.Column(db.Integer, default=0)
    image = db.Column(db.String(256))  # 存放该测试的封面图
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    problems = db.relationship('TestProblem', backref='testList', lazy='dynamic')

    def __repr__(self):
        return '< test_list titile is %r>' % self.test_title

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        user_count = User.query.count()
        random.seed()
        for i in range(count):
            u = User.query.offset(random.randint(0, user_count-1)).first()
            p = TestList(test_description=forgery_py.lorem_ipsum.sentences(random.randint(1,  9)),
                         timestamp=forgery_py.date.date(True), test_title=forgery_py.lorem_ipsum.title(), key_words="computer science",
                         like=random.randint(1, 100), test_category=random.randint(0, 6), show=True,
                         author_id=u.id, image="http://o8evkf73q.bkt.clouddn.com/image/JXNU.png", \
                test_sum=random.randint(0, 200))
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_test = {
            "id": self.id,
            "test_title": self.test_title,
            "test_description": self.test_description,
            "show": self.show,
            "like": self.like,
            "test_category": self.test_category,
            "key_words": self.key_words,
            "timestamp": time_transform(self.timestamp),
            "image": self.image,
            "test_count": self.test_sum,
            "author_id": self.author_id,
            "author_user_name": id_change_user(self.author_id).user_name,
            "author_name": id_change_user(self.author_id).name,
            "author_avatar": id_change_user(self.author_id).avatar,
            "problems_count": self.problems.count()
        }
        return json_test

    @staticmethod
    def from_json(json_info):
        test_title = json_info.get('test_title')
        test_description = json_info.get('test_description')
        test_category = json_info.get('test_category')
        key_words = json_info.get('key_words')
        image = json_info.get('image')
        author_id = json_info.get('author_id')
        return TestList(test_title=test_title, test_description=test_description, test_category=test_category,
                        key_words=key_words, image=image, author_id=author_id)


class TestProblem(db.Model):
    """
    问题表,用来保存测试的每个问题
    """
    __tablename__ = 'test_problems'
    id = db.Column(db.Integer, primary_key=True)
    problem_description = db.Column(db.Text)  # 问题的描述
    problem_order = db.Column(db.Integer)  # 题目的顺序
    show = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    description_image = db.Column(db.String(256))   # 问题描述的图片,可选
    problem_type = db.Column(db.Integer)  # 该题目的类型,选择题为0  主观题为1
    choice_a = db.Column(db.String(128))
    choice_b = db.Column(db.String(128))
    choice_c = db.Column(db.String(128))
    choice_d = db.Column(db.String(128))
    right_answer = db.Column(db.Text)  # 问题答案
    answer_explain = db.Column(db.Text)       # 答案解释
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    test_list_id = db.Column(db.Integer, db.ForeignKey('test_list.id'))

    def __repr__(self):
        return '<probles id is %r>' % self.id

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        for i in range(count):
            p = TestProblem(problem_description=forgery_py.lorem_ipsum.sentences(random.randint(1,  3)),
                            timestamp=forgery_py.date.date(True),
                            problem_order=random.randint(1, 50), show=True, problem_type=random.randint(0, 1),
                            choice_a=forgery_py.lorem_ipsum.sentence(),
                            choice_b=forgery_py.lorem_ipsum.sentence(),
                            choice_c=forgery_py.lorem_ipsum.sentence(),
                            choice_d=forgery_py.lorem_ipsum.sentence(),
                            right_answer=random.randint(1, 4),
                            answer_explain=forgery_py.lorem_ipsum.sentence(),
                            test_list_id=random.randint(1, 100),
                            author_id=random.randint(1, 100), description_image="http://o8evkf73q.bkt.clouddn.com/image/JXNU.png")
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_problem = {
            "id": self.id,
            "problem_description": self.problem_description,
            "problem_order": self.problem_order,
            "show": self.show,
            "timestamp": time_transform(self.timestamp),
            "description_image": self.description_image,
            "problem_type": self.problem_type,
            "choice_a": self.choice_a,
            "choice_b": self.choice_b,
            "choice_c": self.choice_c,
            "choice_d": self.choice_d,
            "right_answer": self.right_answer,
            "answer_explain": self.answer_explain,
            "author_id": self.id,
            "test_id": self.test_list_id
        }
        return json_problem

    @staticmethod
    def from_json(json_info):
        problem_description = json_info.get('problem_description')
        problem_order = json_info.get('problem_order')
        description_image = json_info.get('description_image')
        problem_type = json_info.get('problem_type')
        choice_a = json_info.get('choice_a')
        choice_b = json_info.get('choice_b')
        choice_c = json_info.get('choice_c')
        choice_d = json_info.get('choice_d')
        right_answer = json_info.get('right_answer')
        answer_explain = json_info.get('answer_explain')
        author_id = json_info.get('author_id')
        test_list_id = json_info.get('test_id')
        return TestProblem(problem_description=problem_description, problem_order=problem_order,
                           description_image=description_image, problem_type=problem_type,
                           choice_a=choice_a, choice_b=choice_b, choice_c=choice_c, choice_d=choice_d,
                           right_answer=right_answer, answer_explain=answer_explain, author_id=author_id,
                           test_list_id=test_list_id)


class TestRecord(db.Model):
    """
    用户测试记录表,用来记录用户测试的记录
    """
    __tablename__ = 'test_record'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    show = db.Column(db.Boolean, default=True)
    test_accuracy = db.Column(db.Float, default=0)
    answerer_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # 做题人id
    test_list_id = db.Column(db.Integer, db.ForeignKey('test_list.id'))  # 对应试卷的id
    is_finished = db.Column(db.Boolean, default=False)   # 是否完成测试
    answers = db.relationship('AnswerRecord', backref='record', lazy='dynamic')

    def __repr__(self):
        return '<test record id is %r>' % self.id

    @staticmethod
    def generate_fake(count=100):
        random.seed()
        for i in range(count):
            p = TestRecord(
                           show=True, answerer_id=random.randint(1, 100), test_list_id=random.randint(1, 100), test_accuracy=0,
                            )
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_test_record = {
            "id": self.id,
            "timestamp": time_transform(self.timestamp),
            "show": self.show,
            "test_accuracy": self.test_accuracy,
            "answerer_id": self.answerer_id,
            "answerer_user_name": id_change_user(self.answerer_id).user_name,
            "answerer_name": id_change_user(self.answerer_id).name,
            "answers_count": self.answers.count(),
            "test_id": self.test_list_id,
            "test_title": TestList.query.get_or_404(self.test_list_id).test_title,
            "is_finished": self.is_finished
        }
        return json_test_record

    @staticmethod
    def from_json(json_info):
        answerer_id = json_info.get('answerer_id')
        test_list_id = json_info.get('test_id')
        return TestRecord(answerer_id=answerer_id, test_list_id=test_list_id)


class AnswerRecord(db.Model):
    """
    用户测试答案表,用来保存用户完成测试后的答案记录
    """
    __tablename__ = 'answer_record'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    show = db.Column(db.Boolean, default=True)
    right_answer = db.Column(db.Text)
    user_answer = db.Column(db.Text)
    problem_type = db.Column(db.Integer)  # 该题目的类型,选择题为0  主观题为1
    answerer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    test_record_id = db.Column(db.Integer, db.ForeignKey('test_record.id'))
    problem_id = db.Column(db.Integer, db.ForeignKey('test_problems.id'))
    test_list_id = db.Column(db.Integer, db.ForeignKey('test_list.id'))

    def __repr__(self):
        return '<answer record id is %r>' % self.id

    @staticmethod
    def generate_fake(count=100):
        import forgery_py
        random.seed()
        for i in range(count):
            p = AnswerRecord(show=True, answerer_id=random.randint(1, 100), right_answer=forgery_py.lorem_ipsum.sentence(),
                           user_answer=forgery_py.lorem_ipsum.sentence(),
                           problem_type=random.randint(0, 1),
                           test_record_id=random.randint(1, 100),
                           problem_id=random.randint(1, 100),
                           test_list_id=random.randint(1, 100) )
            db.session.add(p)
            db.session.commit()

    def to_json(self):
        json_ans_record = {
            "id": self.id,
            "timestamp": time_transform(self.timestamp),
            "show": self.show,
            "right_answer": self.right_answer,
            "user_answer": self.user_answer,
            "problem_type": self.problem_type,
            "answerer_id": self.answerer_id,
            "answerer_user_name": id_change_user(self.answerer_id),
            "answerer_name": id_change_user(self.answerer_id),
            "test_record_id": self.test_record_id,
            "problem_id": self.problem_id,
            "test_id": self.test_list_id
        }
        return json_ans_record

    @staticmethod
    def from_json(json_info):
        right_answer = json_info.get('right_answer')
        user_answer = json_info.get('user_answer')
        problem_type = json_info.get('problem_type')
        answerer_id = json_info.get('answerer_id')
        test_record_id = json_info.get('test_record_id')
        problem_id = json_info.get('problem_id')
        test_list_id = json_info.get('test_id')
        return AnswerRecord(right_answer=right_answer, user_answer=user_answer, problem_type=problem_type,
                            answerer_id=answerer_id, test_record_id=test_record_id, problem_id=problem_id,
                            test_list_id=test_list_id)


class TextResourceBehavior(db.Model):
    __tablename__ = 'text_resource_behavior'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    text_resource_id = db.Column(db.Integer, db.ForeignKey('text_resources.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    is_collect = db.Column(db.Boolean, default=False)
    is_like = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<text_resource record user_id is %r>' % self.user_id

    @staticmethod
    def generate_fake(count=200):
        random.seed()
        for i in range(count):
            p = TextResourceBehavior(user_id=random.randint(1, 102), text_resource_id=random.randint(1,100),
                                     is_collect=random.randint(0, 1), is_like=random.randint(0, 1))
            db.session.add(p)
            db.session.commit()


class CourseBehavior(db.Model):
    __tablename__ = 'course_behavior'
    id = db.Column(db.Integer, primary_key=BadSignature)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    is_collect = db.Column(db.Boolean, default=False)
    is_like = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<course_record user_id is %r>' % self.user_id

    @staticmethod
    def generate_fake(count=200):
        random.seed()
        for i in range(count):
            p = CourseBehavior(user_id=random.randint(1, 102), course_id=random.randint(1, 100),
                                     is_collect=random.randint(0, 1), is_like=random.randint(0, 1))
            db.session.add(p)
            db.session.commit()


class TestBehavior(db.Model):
    __tablename__ = 'test_behavior'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    test_id = db.Column(db.Integer, db.ForeignKey('test_list.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    is_test = db.Column(db.Boolean, default=False)
    is_like = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<test_record user_id is %r>' % self.user_id

    @staticmethod
    def generate_fake(count=200):
        random.seed()
        for i in range(count):
            p = TestBehavior(user_id=random.randint(1, 102), test_id=random.randint(1,100),
                                     is_test=random.randint(0, 1), is_like=random.randint(0, 1))
            db.session.add(p)
            db.session.commit()
