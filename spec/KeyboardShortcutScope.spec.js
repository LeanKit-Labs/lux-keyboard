import { mount } from "enzyme";

describe( "KeyboardShortcutScope", () => {
	let KeyboardShortcutScope, dispatchStub, component, TestComponent;

	function render( props ) {
		component = mount( <KeyboardShortcutScope { ...props } /> );
	}

	beforeEach( () => {
		TestComponent = React.createClass( {
			render() {
				return <span { ...this.props } />;
			}
		} );

		dispatchStub = sinon.stub();
		KeyboardShortcutScope = proxyquire( "../src/KeyboardShortcutScope", {
			"lux.js": {
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

	describe( "when mounting", () => {
		it( "should dispatch activeScope", () => {
			render( { scope: "testScope" } );

			dispatchStub.should.be.calledOnce
				.and.calledWith( "activateScope", "testScope" );
		} );
	} );

	describe( "when rendering", () => {
		let child;

		beforeEach( () => {
			render( {
				scope: "testScope",
				children: <TestComponent />,
				className: "what"
			} );

			child = component.find( TestComponent );
		} );

		it( "should render the specific component", () => {
			child.should.be.present();
		} );

		it( "should provide just additional props", () => {
			child.props().should.not.have.any.keys( "scope", "component" );
			child.props().className.should.equal( "what" );
		} );
	} );

	describe( "when unmounting", () => {
		it( "should dispatch deactiveScope", () => {
			render( { scope: "testScope" } );
			dispatchStub.reset();
			component.unmount();

			dispatchStub.should.be.calledOnce
				.and.calledWith( "deactivateScope", "testScope" );
		} );
	} );
} );
