var DownPadSprite = cc.Sprite.extend({
	_id:null,
	_gameScene:null,
	_body:null,
	
	ctor:function(gameScene) {
		this._super(res.BALL_SPRITE);
		this._gameScene = gameScene;
		this._init(gameScene);
		return true;
	},
	
	_init:function(gameScene) {
		var winSize = cc.director.getWinSize();
		//设置大小
		this.scale = 0.15;
		//设置物理引擎
		var b2BodyDef = Box2D.Dynamics.b2BodyDef
			, b2Body = Box2D.Dynamics.b2Body
			, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
			, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
			, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

		var winSize = cc.director.getWinSize();
		//设置大小
		this.scale = 0.15;
		//设置物理引擎body及shape
		var mass = 1;
		var radius = 16/Constants.PTM_RATIO;
		//动态物体定义
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.fixedRotation = true;				//控制物体是否在鼠标周围旋转(true:不旋转；false:旋转)
		bodyDef.angle = cc.degreesToRadians(0);
		bodyDef.linearDamping = 0
		bodyDef.angularDamping = 0;
		bodyDef.position.Set((winSize.width/2)/Constants.PTM_RATIO, (winSize.width/7)/Constants.PTM_RATIO);
		this._body = this._gameScene.world.CreateBody(bodyDef);
		this._body.SetUserData(this);
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		//this._body.SetLinearVelocity(new b2Vec2(1000, 1000));
		//定义圆形
		var dynamicCircle = new b2CircleShape(radius);
		//动态物体夹具定义
		var fixtureDef = new b2FixtureDef();
		//设置夹具的形状
		fixtureDef.shape = dynamicCircle;
		//设置密度
		fixtureDef.density = 1;
		//设置摩擦系数
		fixtureDef.friction = 1;
		//设置弹性系数
		fixtureDef.restitution = 1;
		//使用夹具固定形状到物体上
		this._body.CreateFixture(fixtureDef);
		//施加力量http://lib.ivank.net/?p=demos&d=box2D
		//this._gameScene._ball._body.ApplyImpulse(new b2Vec2(0, -5), this._gameScene._ball._body.GetWorldCenter());
		
		var mouseJointDef = new b2MouseJointDef();
        mouseJointDef.bodyA = this._gameScene.world.GetGroundBody();			//一般为世界边界 
        mouseJointDef.bodyB = this._body;										//需要拖动的物体 
        mouseJointDef.target.Set((winSize.width/2)/Constants.PTM_RATIO, (winSize.height/7)/Constants.PTM_RATIO);  //指定拖动的坐标
        mouseJointDef.maxForce = 10000.0 * this._body.GetMass();				//给一个拖动的力
		mouseJointDef.collideConnected = false;
		mouseJointDef.frequencyHz = 30;
		mouseJointDef.dampingRatio = 0;
        this._gameScene.mouseJoint = this._gameScene.world.CreateJoint(mouseJointDef);
	},
	
	setCardId:function(id) {
		this._id = id;
	},
});

DownPadSprite.create = function(gameScene) {
	if (cc.pool.hasObject(DownPadSprite)) {
		return cc.pool.getFromPool(DownPadSprite);
	} else {
		return new DownPadSprite(gameScene);
	}
}