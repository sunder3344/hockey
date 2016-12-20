var Storage = {
	getCurrentScore:function(key) {
		var score = cc.sys.localStorage.getItem(key) || 0;
		return parseInt(score);
	},
	
	setCurrentScore:function(key, score) {
		cc.sys.localStorage.setItem(key, score);
		return true;
	},
	
	getCurrentHighest:function(key) {
		var highest = cc.sys.localStorage.getItem(key) || 0;
		return parseInt(highest);
	},
	
	setCurrentHighest:function(key, highest) {
		cc.sys.localStorage.setItem(key, highest);
		return true;
	},
	
	getCurrentSound:function(key) {
		var sound = cc.sys.localStorage.getItem(key) || "on";
		return sound.toString();
	},
	
	setCurrentSound:function(key, sound) {
		cc.sys.localStorage.setItem(key, sound);
		return true;
	}
}