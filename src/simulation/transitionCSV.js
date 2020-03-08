'use strict';

export default class TransitionCSV { 

	constructor(frame, id, state, input, output, errorMsg, phase) {

		this.frame = frame;
		this.id = id;
		this.state = state;
		this.input = input;
		this.output = output;
		this.errorMsg = errorMsg;
		this.phase = phase;
	}

	get Frame() {
		return this.frame;
	}

	get Id() {
		return this.id;
	}
	
	get State() {
		return this.state;
	}

	get Input() {
		return this.input;
	}
	
	get Output() {
		return this.output;
	}

	get ErrorMsg() {
		return this.errorMsg;
	}

	get Phase() {
		return this.phase;
	}
}
