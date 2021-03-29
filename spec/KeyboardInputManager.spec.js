import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe( "KeyboardInputManager", () => {
	let keyMap, trapStub, luxConfig, dispatchStub, component, KeyboardInputManager;

	function render( props ) {
		component = mount( <KeyboardInputManager { ...props } /> );
	}

	beforeEach( () => {
		dispatchStub = sinon.stub();

		trapStub = {
			reset: sinon.stub(),
			bind: sinon.stub(),
			bindGlobal: sinon.stub()
		};

		keyMap = {
			esc: {
				actionName: "actionOne",
				includeInputs: true
			},
			a: {
				actionName: "actionTwo",
				includeInputs: false
			},
			b: {
				actionName: "actionThree",
				includeInputs: true,
				preventDefault: false
			},
			c: {
				actionName: "actionFour",
				allowRepeat: true
			}
		};

		proxyquire( "../src/KeyboardInputManager", {
			"./keyboardInputStore": {
				getCurrentKeyMap: sinon.stub().returns( keyMap )
			},
			"./MousetrapWrapper": trapStub,
			"lux.js": {
				luxWrapper( comp, cfg ) {
					KeyboardInputManager = comp;
					luxConfig = cfg;
				},
				dispatch: dispatchStub
			}
		} );
	} );

	afterEach( () => {
		if ( component ) {
			component.unmount();
			component = null;
		}
	} );

	describe( "component", () => {
		beforeEach( () => {
			render( { keyMap } );
		} );

		describe( "when mounting", () => {
			it( "should setup Mousetrap on mount", () => {
				trapStub.bindGlobal.should.be.calledTwice
					.and.calledWith( "esc" )
					.and.calledWith( "b" );

				trapStub.bind.should.be.calledTwice
					.and.calledWith( "a" )
					.and.calledWith( "c" );
			} );

			it( "should add global handler that does not allow repeats", () => {
				const preventDefault = sinon.stub();

				trapStub.bindGlobal.getCall( 0 ).args[ 1 ]( { preventDefault } );
				trapStub.bindGlobal.getCall( 0 ).args[ 1 ]( { preventDefault, repeat: true } );
				dispatchStub.should.be.calledOnce.and.calledWith( "actionOne" );
				preventDefault.should.be.calledTwice();
			} );

			it( "should add global handler that does not prevent default", () => {
				const preventDefault = sinon.stub();
				trapStub.bindGlobal.getCall( 1 ).args[ 1 ]( { preventDefault } );
				preventDefault.should.not.be.called();
				dispatchStub.should.be.calledWith( "actionThree" );
			} );

			it( "should add local handler that dispatches", () => {
				const preventDefault = sinon.stub();
				trapStub.bind.getCall( 0 ).args[ 1 ]( { preventDefault } );
				dispatchStub.should.be.calledWith( "actionTwo" );
				preventDefault.should.be.calledOnce();
			} );

			it( "should add local handler that allows repeats", () => {
				const preventDefault = sinon.stub();
				trapStub.bind.getCall( 1 ).args[ 1 ]( { preventDefault } );
				trapStub.bind.getCall( 1 ).args[ 1 ]( { preventDefault, repeat: true } );
				dispatchStub.should.be.calledTwice.and.calledWith( "actionFour" );
				preventDefault.should.be.calledTwice();
			} );
		} );

		describe( "when updating the component", () => {
			beforeEach( () => {
				trapStub.bindGlobal.reset();
				trapStub.bind.reset();

				component.setProps( {
					keyMap: {
						esc: {
							actionName: "actionOne",
							includeInputs: true
						},
						c: {
							actionName: "actionFour",
							includeInputs: false,
							preventDefault: false
						},
						d: {
							actionName: "actionFive",
							includeInputs: true
						}
					}
				} );
			} );

			it( "should reset and rebind on update", () => {
				trapStub.reset.should.be.calledOnce();

				trapStub.bindGlobal.should.be.calledTwice
					.and.calledWith( "esc" )
					.and.calledWith( "d" );

				trapStub.bind.should.be.calledOnce
					.and.calledWith( "c" );
			} );

			it( "should bind with new keyMap", () => {
				const preventDefault = sinon.stub();

				trapStub.bindGlobal.getCall( 0 ).args[ 1 ]( { preventDefault } );
				dispatchStub.should.be.calledWith( "actionOne" );
				preventDefault.should.be.calledOnce();

				preventDefault.reset();
				trapStub.bindGlobal.getCall( 1 ).args[ 1 ]( { preventDefault } );
				dispatchStub.should.be.calledWith( "actionFive" );
				preventDefault.should.be.calledOnce();

				preventDefault.reset();
				trapStub.bind.getCall( 0 ).args[ 1 ]( { preventDefault } );
				dispatchStub.should.be.calledWith( "actionFour" );
				preventDefault.should.not.be.called();
			} );
		} );

		describe( "when unmounting", () => {
			beforeEach( () => {
				render( { keyMap } );
			} );

			it( "should reset on unmount", () => {
				act( () => {
					component.unmount();
					component = null;
				} );

				trapStub.reset.should.be.calledOnce();
			} );
		} );
	} );

	describe( "luxWrapper", () => {
		it( "should return state", () => {
			luxConfig.getState().should.eql( { keyMap } );
		} );
	} );
} );
