var BallSprite = cc.Sprite.extend({
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
		var b2BodyDef = Box2D.Dynamics.b2BodyDef
			, b2Body = Box2D.Dynamics.b2Body
			, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
			, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

		var winSize = cc.director.getWinSize();
		//设置大小
		this.scale = 0.15;
		//设置物理引擎body及shape
		var mass = 1;
		var radius = 16/Constants.PTM_RATIO;
		//动态物体定义
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set((winSize.width/2)/Constants.PTM_RATIO, (winSize.width/2)/Constants.PTM_RATIO);
		this._body = this._gameScene.world.CreateBody(bodyDef);
		this._body.SetUserData(this);
		//定义圆形
		var dynamicCircle = new b2CircleShape(radius);
		//动态物体夹具定义
		var fixtureDef = new b2FixtureDef();
		//设置夹具的形状
		fixtureDef.shape = dynamicCircle;
		//设置密度
		fixtureDef.density = 0.1;
		//设置摩擦系数
		fixtureDef.friction = 0.9;
		//设置弹性系数
		fixtureDef.restitution = 0.2;
		//使用夹具固定形状到物体上
		this._body.CreateFixture(fixtureDef);
	},
	
	setCardId:function(id) {
		this._id = id;
	},
});

BallSprite.create = function(gameScene) {
	if (cc.pool.hasObject(BallSprite)) {
		return cc.pool.getFromPool(BallSprite);
	} else {
		return new BallSprite(gameScene);
	}
}