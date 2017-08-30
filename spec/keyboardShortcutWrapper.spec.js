import { mount } from "enzyme";

describe( "keyboardShortcutWrapper", () => {
	let dispatchStub, TestComponent, WrappedComponent, wrapper, component;

	function render( props = {}, options = {} ) {
		WrappedComponent = wrapper( TestComponent, options );
		component = mount( <WrappedComponent { ...props } /> );
	}

	beforeEach( () => {
		TestComponent = React.createClass( {
			render() {
				return <span />;
			}
		} );

		dispatchStub = sinon.stub();
		wrapper = proxyquire( "../src/keyboardShortcutWrapper", {
			"lux.js": {
				dispatch: dispatchStub
			}
		} );
	} );

	describe( "when mounting", () => {
		describe( "when an initialScopeToActivate is provided", () => {
			it( "should activate the scope", () => {
				render( {}, { initialScopeToActivate: "test-scope" } );

				dispatchStub.should.be.calledOnce
					.and.calledWith( "activateScope", "test-scope" );
			} );
		} );

		describe( "when no initialScopeToActivate is provided", () => {
			it( "should not try to activate a scope", () => {
				render();

				dispatchStub.should.not.be.called();
			} );
		} );
	} );

	describe( "when unmounting", () => {
		it( "should deactivate any active scopes", () => {
			render( {}, { initialScopeToActivate: "test-scope" } );

			const { activateScope, deactivateScope } = component.instance();

			activateScope( "test-scope2" );
			activateScope( "test-scope3" );
			deactivateScope( "test-scope2" );

			dispatchStub.reset();

			component.unmount();

			dispatchStub.should.be.calledTwice
				.and.calledWith( "deactivateScope", "test-scope" )
				.and.calledWith( "deactivateScope", "test-scope3" );
		} );
	} );

	describe( "when rendering", () => {
		it( "should render the supplied component", () => {
			render();

			component.find( TestComponent ).should.be.present();
		} );

		it( "should pass props down the the component", () => {
			render( { className: "bar" } );

			component.find( TestComponent ).should.have.prop( "className", "bar" );
		} );

		it( "should provide an activeScope prop", () => {
			render();

			component.find( TestComponent ).prop( "activateScope" ).should.be.a( "function" );
		} );

		it( "should provide a deactiveScope prop", () => {
			render();

			component.find( TestComponent ).prop( "deactivateScope" ).should.be.a( "function" );
		} );

		it( "should add a displayName", () => {
			render();

			WrappedComponent.displayName.should.equal( "KeyboardShortcutWrapper(TestComponent)" );
		} );

		it( "should handle adding a display name when the component has none", () => {
			const Component = wrapper( () => {} );
			Component.displayName.should.equal( "KeyboardShortcutWrapper(Component)" );
		} );
	} );

	describe( "when activating scopes", () => {
		let activateScope;

		beforeEach( () => {
			render();

			activateScope = component.instance().activateScope;

			activateScope( "new-scope" );
		} );

		it( "should activate the scope, if it is not active", () => {
			dispatchStub.should.be.calledOnce
				.and.calledWith( "activateScope", "new-scope" );
		} );

		it( "should not activate the scope again, if it is already active", () => {
			dispatchStub.reset();

			activateScope( "new-scope" );

			dispatchStub.should.not.be.called();
		} );
	} );

	describe( "when deactivating scopes", () => {
		let deactivateScope;

		beforeEach( () => {
			render( {}, { initialScopeToActivate: "new-scope" } );
			deactivateScope = component.instance().deactivateScope;
			dispatchStub.reset();
		} );

		it( "should deactivate the scope, if it is active", () => {
			deactivateScope( "new-scope" );

			dispatchStub.should.be.calledOnce
				.and.calledWith( "deactivateScope", "new-scope" );
		} );

		it( "should not deactivate the scope, if it is not active", () => {
			deactivateScope( "some-other-scope" );

			dispatchStub.should.not.be.called();
		} );
	} );
} );
