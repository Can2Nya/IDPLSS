# coding: utf-8
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from datetime import datetime
from application import db


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
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return '< follower_id %r>' % self.followed_id


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
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    confirmed = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(32))
    about_me = db.Column(db.String(128))
    followers = db.relationship('Follow', foreign_keys=[Follow.follower_id], backref=db.backref('follower',
                                lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')
    followings = db.relationship('Follow', foreign_keys=[Follow.followed_id], backref=db.backref('followed',
                                lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            if self.email == current_app.config['IDPLSS_ADMIN']:
                self.role = Role.query.filter_by(permissions=0xff).first()
            if self.role is None:
                self.role = Role.query.filter_by(default=True).first()

    def __repr__(self):
        return '<User %r>' % self.user_name

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



class AnonymousUser(object):
    def __init__(self):
        pass

    @staticmethod
    def can(permissions):
        return False

    @staticmethod
    def is_admin():
        return False
