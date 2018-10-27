import Tone from 'tone';
import teoria from 'teoria';

class Music {

	constructor(options){
					this.synth = new Tone.FMSynth({
		    envelope  : {
		        attack  : 0.01 ,
		        decay  : 0.01 ,
		        sustain  : .5 ,
		        release  : 0.7
		    }
		}).toMaster()
		console.log(options);
		this.CONSTANT_VALUE = 2;
	}

	playSampleNote() {
		console.log(this.CONSTANT_VALUE)

        this.synth.triggerAttackRelease('C4', '8n')
	}
}

export default Music;