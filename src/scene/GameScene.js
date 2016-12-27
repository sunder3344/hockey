var MainLayer = cc.Scene.extend({
	i:0,
	_name:"mainLayer",
	_flag:0,
	_ball:null,
	_down_pad:null,
	_up_pad:null,
	_round:0,
	_listener:null,
	world:null,
	_soundOn:null,				//静音按钮
	_soundOff:null,
	mouseJoint:null,
	
	ctor:function() {
		this._super();
		this.initPhysics();
		
		var winSize = cc.director.getWinSize();
		this.width = winSize.width;
		this.height = winSize.height;
		//冰球
		this._ball = BallSprite.create(this);
		this._ball.x = winSize.width / 2;
		this._ball.y = winSize.width / 2;
		this.addChild(this._ball, 1);
		
		//上拍
		
		//下拍
		this._down_pad = DownPadSprite.create(this);
		this._down_pad.x = winSize.width / 2;
		this._down_pad.y = winSize.width / 7;
		this.addChild(this._down_pad, 1);
		
		//this._sdk_init();
		//设置事件
		var layerListener = null;
		if ("touches" in cc.sys.capabilities) {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchMoved: this._onMainTouchMoved.bind(this),
				onTouchEnded: this._onMainTouchEnded.bind(this)
			});
		} else {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.MOUSE,
				swallowTouches: true,
				onMouseMove: this._onMainMouseMove.bind(this)
			});
		}
		cc.eventManager.addListener(layerListener, this);
		this._listener = layerListener;
		
		this.scheduleUpdate();
		return true;
	},
	
	onEnter:function() {
		this._super();
		cc.sys.dumpRoot();
        cc.sys.garbageCollect();
		return true;
	},
	
	//物理引擎空间初始化
	initPhysics:function() {
		var winSize = cc.director.getWinSize();
		var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
			//, b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
			//, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
			//, b2Settings = Box2D.Common.b2Settings
			, b2ContactListener = Box2D.Dynamics.b2ContactListener;
		
		//创建物理世界
		this.world = new b2World(new b2Vec2(0, 0), true);
		//开启连续物理测试
		this.world.SetContinuousPhysics(true);
		
		var fixDef = new b2FixtureDef();
		fixDef.density = 1;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;
		var w = winSize.width / Constants.PTM_RATIO;
		var h = winSize.height / Constants.PTM_RATIO;
		
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_staticBody;
		
		fixDef.shape = new b2PolygonShape();
		
		//设置宽度w的水平线
		fixDef.shape.SetAsBox(w/2, 0);
		//顶部
		bodyDef.position.Set(w/2, h);
		this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		//底部
		bodyDef.position.Set(w/2, 0);
		this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		//设置高度h的垂直线
		fixDef.shape.SetAsBox(0, h/2);
		//左边
		bodyDef.position.Set(0, h/2);
		this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		//右边
		bodyDef.position.Set(w, h/2);
		this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		//检测碰撞设置接收碰撞回调函数
		var listener = new b2ContactListener();
		listener.BeginContact = function(contact) {
			//cc.log("BeginContact");
			var bodyA = contact.GetFixtureA().GetBody();
			var bodyB = contact.GetFixtureB().GetBody();
			var spriteA = bodyA.GetUserData();
			var spriteB = bodyB.GetUserData();
			if (spriteA != null && spriteB != null) {
				spriteA.setColor(new cc.Color(255, 255, 0, 255));
				spriteB.setColor(new cc.Color(255, 255, 0, 255));
			}
		}
		listener.EndContact = function(contact) {
			//cc.log("EndContact");
			var bodyA = contact.GetFixtureA().GetBody();
			var bodyB = contact.GetFixtureB().GetBody();
			var spriteA = bodyA.GetUserData();
			var spriteB = bodyB.GetUserData();
			if (spriteA != null && spriteB != null) {
				spriteA.setColor(new cc.Color(255, 255, 255, 255));
				spriteB.setColor(new cc.Color(255, 255, 255, 255));
			}
		}
		listener.PostSolve = function(contact, impulse) {
			//cc.log("PostSolve");
		}
		listener.PreSolve = function(contact, oldManifold) {
			//cc.log("PreSolve");
		}
		this.world.SetContactListener(listener);
	},
	
	_sdk_init:function() {
		this._agent = Anysdk._init();
		this._ads_plugin = this._agent.getAdsPlugin();
		this._ads_plugin.showAds(AdsType.AD_TYPE_BANNER);			//显示banner广告
		this._analytics_plugin = this._agent.getAnalyticsPlugin();
		this._analytics_plugin.startSession();
		this._analytics_plugin.setCaptureUncaughtException(true);			//收集应用错误日志
	},
	
	_exit:function() {
		this._analytics_plugin.stopSession();
		cc.director.end();
	},
	
	//手指开始
	_onMainTouchMoved:function(touch, event) {
		var pos = touch.getLocation();
		this._down_pad.x = pos.x;
		this._down_pad.y = pos.y;
		if (this.mouseJoint != null) {
			var b2Vec2 = Box2D.Common.Math.b2Vec2; 
			this.mouseJoint.SetTarget(new b2Vec2(pos.x/Constants.PTM_RATIO, pos.y/Constants.PTM_RATIO));
		}
	},
	
	//手指结束
	_onMainTouchEnded:function(touch, event) {
		if (this.mouseJoint != null) {
			this.world.DestroyJoint(this.mouseJoint);
			this.mouseJoint = null;
		}
	},
	
	//鼠标移动
	_onMainMouseMove:function(event) {
		var pos = event.getLocation();
		this._down_pad.x = pos.x;
		this._down_pad.y = pos.y;
		if (this.mouseJoint != null) {
			var b2Vec2 = Box2D.Common.Math.b2Vec2; 
			this.mouseJoint.SetTarget(new b2Vec2(pos.x/Constants.PTM_RATIO, pos.y/Constants.PTM_RATIO));
		}
	},
	
	/*draw:function()  
    {  
        var pos = this._ball.getPosition();  
        cc.drawingUtil.setDrawColor4B(255,255,255,255);  
        cc.drawingUtil.drawCircle(cc.p(pos.x, pos.y), 32, 0, 10, true);  
  
        var down_pad = this._down_pad.getPosition();  
        cc.drawingUtil.setDrawColor4B(255,255,255,255);  
        cc.drawingUtil.drawCircle(cc.p(down_pad.x, down_pad.y), 12, 0, 10, true);  
    },*/
	
	update:function(dt) {
		var velocityIterations = 8;
		var positionIterations = 1;
		this.world.Step(dt, velocityIterations, positionIterations);
		for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                //myActor.x = b.GetPosition().x * Constants.PTM_RATIO;
                //myActor.y = b.GetPosition().y * Constants.PTM_RATIO;
				myActor.setPosition(cc.p(b.GetPosition().x * Constants.PTM_RATIO, b.GetPosition().y * Constants.PTM_RATIO)); 
                myActor.rotation = -1 * cc.radiansToDegrees(b.GetAngle());
            }
        }
		return true;
	},
	
	clearLayer:function() {
		
	},
	
	removeListener:function() {
		cc.eventManager.removeListener(this._listener);
	},
	
	//更新分数
	_updateScore:function(score) {

	},
	
	//关闭声音
	_soundSwitchOn:function() {
		this._soundOff.setVisible(true);
		this._soundOn.setVisible(false);
		this._soundSwitch = "off";
		Storage.setCurrentSound("off");
	},
	
	//开启声音
	_soundSwitchOff:function() {
		this._soundOff.setVisible(false);
		this._soundOn.setVisible(true);
		this._soundSwitch = "on";
		Storage.setCurrentSound("on");
	}
});

var GameScene = cc.Scene.extend({
	layer: null,
    onEnter:function () {
        this._super();
        this.layer = new MainLayer();
        this.addChild(this.layer);
    }
});