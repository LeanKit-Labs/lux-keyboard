import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

describe( "KeyboardShortcutScope", () => {
	let KeyboardShortcutScope, dispatchStub, component, TestComponent;

	function render( props ) {
		component = mount( <KeyboardShortcutScope { ...props } /> );
	}

	beforeEach( () => {
		TestComponent = props => <span { ...props } />;

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
		it( "should render the component", () => {
			render( {
				scope: "testScope",
				children: <TestComponent />,
				className: "what"
			} );

			component.find( TestComponent ).should.be.present();
		} );

		it( "should render null when there is no children", () => {
			render( {
				scope: "testScope",
				children: null,
				className: "what"
			} );

			component.children().should.have.lengthOf( 0 );
		} );
	} );

	describe( "when unmounting", () => {
		it( "should dispatch deactiveScope", () => {
			render( { scope: "testScope" } );
			dispatchStub.reset();

			act( () => {
				component.unmount();
				component = null;
			} );

			dispatchStub.should.be.calledOnce
				.and.calledWith( "deactivateScope", "testScope" );
		} );
	} );
} );
