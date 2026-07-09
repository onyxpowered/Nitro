/**
 * @license
 * Nitro — By Onyx Labs
 * SPDX-License-Identifier: MIT
 *
 * The CommonJS build of Nitro is deprecated. Nitro is ESM-only going forward;
 * this entry now re-exports the ES module via require(esm) and will be removed
 * in a future release.
 *
 * Replace `require('nitro1')` with `import * as Nitro from 'nitro1'`.
 */
process.emitWarning(
	'`require("nitro1")` is deprecated and will be removed.\n' +
	'Replace `const Nitro = require("nitro1")` with `import * as Nitro from "nitro1"`.',
	{ type: 'DeprecationWarning', code: 'NITRO_CJS_DEPRECATED' }
);
module.exports = require( './nitro.module.js' );
