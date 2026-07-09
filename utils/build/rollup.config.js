// Nitro — Onyx Labs
import MagicString from 'magic-string';

function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl.js$/.test( id ) === false ) return;

			code = new MagicString( code );

			code.replace( /\/\* glsl \*\/\`(.*?)\`/sg, function ( match, p1 ) {

				return JSON.stringify(
					p1
						.trim()
						.replace( /\r/g, '' )
						.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
						.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
						.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
				);

			} );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

function header() {

	return {

		renderChunk( code ) {

			code = new MagicString( code );

			code.prepend( `/**
 * @license
 * Nitro — By Onyx Labs
 * SPDX-License-Identifier: MIT
 */\n` );

			return {
				code: code.toString(),
				map: code.generateMap()
			};

		}

	};

}

/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const builds = [
	{
		input: {
			'nitro.core.js': 'src/Nitro.Core.js',
			'nitro.module.js': 'src/Nitro.js',
			'nitro.physics.js': 'src/Nitro.Physics.js',
		},
		plugins: [
			glsl(),
			header()
		],
		preserveEntrySignatures: 'allow-extension',
		output: [
			{
				format: 'esm',
				dir: 'build',
				minifyInternalExports: false,
				entryFileNames: '[name]',
			}
		]
	}
];

export default builds;
