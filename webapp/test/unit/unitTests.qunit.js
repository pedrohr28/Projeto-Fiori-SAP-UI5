/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"acn/btpui5treinamento/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
