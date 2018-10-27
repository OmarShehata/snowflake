import Tone from 'tone';
import teoria from 'teoria';

class Music {
	constructor(options){
		console.log(options);
		this.CONSTANT_VALUE = 2;
	}

	playSampleNote() {
		console.log(teoria)
		let synth = new Tone.FMSynth({
		    envelope  : {
		        attack  : 0.01 ,
		        decay  : 0.01 ,
		        sustain  : .5 ,
		        release  : 0.7
		    }
		}).toMaster()

        synth.triggerAttackRelease('C4', '8n')
	}
}

export default Music;