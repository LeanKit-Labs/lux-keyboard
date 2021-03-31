import "core-js/stable";
import "regenerator-runtime/runtime";
import proxyFn from "proxyquire";
import chai from "chai";

import sinon from "sinon";
import postal from "postal";
import lux from "lux.js";

import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure( {
	adapter: new Adapter()
} );

global.proxyquire = proxyFn.noPreserveCache().noCallThru();
global.navigator = { userAgent: "Not Chrom3" };
global.chai = chai;
chai.use( require( "dirty-chai" ) );
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );
chai.use( require( "chai-enzyme" )() );
global.should = chai.should();
global.React = require( "react" );
global.ReactDOM = require( "react-dom" );
global.sinon = sinon;
global.postal = postal;
global.lux = lux;
