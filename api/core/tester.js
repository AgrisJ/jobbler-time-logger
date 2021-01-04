class Test {
	constructor() {
		this.tests = 1;
		this.results;
	}
	
	_fail() {
		// Display the failure message
		console.log('\x1b[91mFAILED\x1b[0m');
		// Display server exit message
		console.log('\x1b[33mServer shutting down\x1b[0m');
		// Exit server
		process.exit(1);
	}
	
	_succeed() {
		// Display a success message
		console.log('\x1b[32mOK\x1b[0m');
	}
	
	named(name) {
		process.stdout.write('#' + this.tests + ', ' + name + '...');
		return this;
	}
	
	result(value) {
		this.results = value;
		return this;
	}
	
	shouldBe(value) {
		if (value !== this.results) {
			this._fail();
		}
		
		this._succeed();
	
		this.tests++;
		return this;
	}
	
	isMoreThan(value) {
		if (this.results < value) {
			// Show a failure message
			this._fail();
		}
		
		// Show success message
		this._succeed();
	
		this.tests++;
		return this;
	}
	
	isLessThan(value) {
		if (this.results > value) {
			// Show a failure message
			this._fail();
		}
		
		// Show success message
		this._succeed();
	
		this.tests++;
		return this;
	}
}

module.exports = Test;