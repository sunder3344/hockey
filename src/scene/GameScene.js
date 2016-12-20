var MainLayer = cc.Scene.extend({
	i:0,
	_name:"mainLayer",
	_flag:0,
	_ball:null,
	_down_pad:null,
	_up_pad:null,
	_round:0,
	_listener:null,
	space:null,
	_soundOn:null,				//静音按钮
	_soundOff:null,
	
	ctor:function() {
		this._super();
		this.initPhysics();
		
		var winSize = cc.director.getWinSize();
		this.width = winSize.width;
		this.height = winSize.height;
		//冰球
		this._ball = BallSprite.create(this);
		this._ball.x = winSize.width / 2;
		this._ball.y = winSize.height / 2;
		this.addChild(this._ball);
		
		//上拍
		
		//下拍
		this._down_pad = DownPadSprite.create(this);
		this._down_pad.x = winSize.width / 2;
		this._down_pad.y = winSize.height / 7;
		this.addChild(this._down_pad);
		
		//this._sdk_init();
		this.onCollisionCheck();
		//设置事件
		var layerListener = null;
		if ("touches" in cc.sys.capabilities) {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchMoved: this._onMainTouchMoved.bind(this)
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
		this.space = new cp.Space();
		this.setupDebugNode();
		//设置重力
		this.space.gravity = cp.v(0, 0);
		//this.space.iterations = 15;
		var staticBody = this.space.staticBody;
		
		//设置空间边界(此处没有空间边界)
		var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0),
										cp.v(winSize.width, 0), 0),
					 new cp.SegmentShape(staticBody, cp.v(0, winSize.height),
										cp.v(winSize.width, winSize.height), 0),
					 new cp.SegmentShape(staticBody, cp.v(0, 0),
										cp.v(0, winSize.height), 0),
					 new cp.SegmentShape(staticBody, cp.v(winSize.width, 0),
										cp.v(winSize.width, winSize.height), 0)
					];
		for (var i = 0; i < walls.length; i++) {
			var shape = walls[i];
			shape.setElasticity(1);
			shape.setFriction(0);
			shape.collision_type = i;
			this.space.addStaticShape(shape);
		}
	},
	
	setupDebugNode:function() {
		this._debugNode = new cc.PhysicsDebugNode(this.space);
		this._debugNode.visible = Constants.PHYSICS_DEBUG_NODE_SHOW;
		this.addChild(this._debugNode);
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
	
	//鼠标开始
	_onMainTouchMoved:function(touch, event) {
		var pos = touch.getLocation();
		this._down_pad.x = pos.x;
		this._down_pad.y = pos.y;
	},
	
	//鼠标移动
	_onMainMouseMove:function(event) {
		var pos = event.getLocation();
		this._down_pad.x = pos.x;
		this._down_pad.y = pos.y;
	},
	
	update:function() {
		var timeStep = 0.07;
		this.space.step(timeStep);
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
	},
	
	//碰撞检测
	onCollisionCheck:function() {		
		//添加碰撞检测事件
		//important！如果有很多物体，此处需要遍历
		//小球的collision_type始终是1,与其他的遍历
		this.space.setDefaultCollisionHandler(
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
		/*this.space.addCollisionHandler(1, 2, 
			this.collisionBegin.bind(this),
			this.collisionPre.bind(this),
			this.collisionPost.bind(this),
			this.collisionSeparate.bind(this)
		);
		
		this.space.addCollisionHandler(1, 3, 
			this.collisionBegin.bind(this),
			this.collisionPre.bind(this),
			this.collisionPost.bind(this),
			this.collisionSeparate.bind(this)
		);*/
	},
	
	//碰撞检测
	collisionBegin:function(arbiter, space) {
		var shapes = arbiter.getShapes();
		var shapeA = shapes[0];
		var shapeB = shapes[1];
		var collTypeA = shapeA.collision_type;
		var collTypeB = shapeB.collision_type;
		//有任何的碰撞，游戏失败
		if (collTypeA >= 1 && collTypeB >= 1) {
			
		}
		return true;
	},
	
	collisionPre:function(arbiter, space) {
		//cc.log("collision Pre");
		return true;
	},
	
	collisionPost:function(arbiter, space) {
		//cc.log("collision post");
	},
	
	collisionSeparate:function(arbiter, space) {
		//cc.log("collision seperate");
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