var Sound = {
	silence:"on",
	
	_playMerge:function() {
		Sound.silence = Storage.getCurrentSound();
		if (Sound.silence == "on") {
			cc.audioEngine.playEffect(res.MERGE_MP3, false);
		}
	},
	
	_playSelect:function() {
		Sound.silence = Storage.getCurrentSound();
		if (Sound.silence == "on") {
			cc.audioEngine.playEffect(res.SELECT_MP3, false);
		}
	},
	
	_playSetpos:function() {
		Sound.silence = Storage.getCurrentSound();
		if (Sound.silence == "on") {
			cc.audioEngine.playEffect(res.SETPOS_MP3, false);
		}
	}
}