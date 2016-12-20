var UtilityHelper = {
	//生成随机数
	createRandomIndex:function(number) {
		return parseInt(Math.random() * number);
	},
	
	getRandomNum:function() {
		num = Constants.CARD_2;
		if (Math.random() > 0.1) {
			num = Constants.CARD_2;
		} else {
			num = Constants.CARD_4;
		}
		return num;
	},
	
	logs:function(object, iteration) {
		if (typeof(object) == "object") {
			this.objectEach(object);
		} else {
			cc.log("LOG => " + object);
		}
	},
	
	objectEach:function(object, iteration) {
		if (iteration <= 0) {
			return;
		}
		for (var data in object) {
			if (typeof(data) == "object") {
				iteration--;
				this.objectEach(data, iteration);
			} else {
				cc.log(data + " => " + object[data]);
			}
		}
	}
}