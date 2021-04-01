const jsdom = require( "jsdom" );
const { window } = new jsdom.JSDOM( "<html><body></body></html>", { url: "http://localhost" } );
Object.assign( global, {
	window,
	self: window,
	document: window.document,
	HTMLElement: window.HTMLElement,
	BROWSER: false,
	navigator: { userAgent: "Not Chrom3" },
	_babelPolyfill: true /* For lux */
} );
