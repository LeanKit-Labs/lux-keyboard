
describe( "lux-keyboard", () => {
	let instance, dispatchStub, resetStub;

	beforeEach( () => {
		dispatchStub = sinon.stub();

		resetStub = sinon.stub();

		instance = proxyquire( "../src/index", {
			"./KeyboardShortcutScope": {},
			"./KeyboardInputManager": {},
			"./keyboardShortcutWrapper": {},
			"lux.js": { dispatch: dispatchStub },
			"./MousetrapWrapper": { reset: resetStub }
		} );
	} );

	describe( "loadKeyMap", () => {
		it( "should dispatch receiveKeyMaps", () => {
			instance.loadKeyMap( { foo: "bar" } );

			dispatchStub.should.be.calledOnce
				.and.calledWith( "receiveKeyMaps", { foo: "bar" } );
		} );
	} );

	describe( "unbindAllShortcuts", () => {
		it( "should reset Mousetrap", () => {
			instance.unbindAllShortcuts();

			resetStub.should.be.calledOnce();
		} );
	} );

	describe( "disableShortcuts", () => {
		it( "should dispatch disableKeyboardShortcuts", () => {
			instance.disableShortcuts();

			dispatchStub.should.be.calledOnce
				.and.calledWith( "disableKeyboardShortcuts" );
		} );
	} );

	describe( "enableShortcuts", () => {
		it( "should dispatch enableKeyboardShortcuts", () => {
			instance.enableShortcuts();

			dispatchStub.should.be.calledOnce
				.and.calledWith( "enableKeyboardShortcuts" );
		} );
	} );
} );
