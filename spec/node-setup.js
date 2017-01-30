import "babel-polyfill";
import proxyFn from "proxyquire";
import { jsdom } from "jsdom";
import chai from "chai";

import sinon from "sinon";
import "sinon-as-promised";
import postal from "postal";
import lux from "lux.js";

global.proxyquire = proxyFn.noPreserveCache().noCallThru();
global.document = jsdom( "<html><body></body></html>" );
global.window = document.defaultView;
global.navigator = { userAgent: "Not Chrom3" };
global.chai = chai;
chai.use( require( "dirty-chai" ) );
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );
chai.use( require( "chai-enzyme" )() );
global.should = chai.should();
global.React = require( "react" );
global.ReactDOM = require( "react-dom" );
global.ReactUtils = require( "react-addons-test-utils" );
global.sinon = sinon;
global.postal = postal;
global.lux = lux;
