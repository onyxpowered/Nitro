// Nitro — Onyx Labs
import { rm, mkdir, writeFile } from 'node:fs/promises';

await rm( './build', { recursive: true, force: true } );

await mkdir( './build' );

const contents = {
    'nitro.core.js': `export * from '../src/Nitro.Core.js';`,
    'nitro.module.js': `export * from '../src/Nitro.js';`,
    'nitro.physics.js': `export * from '../src/Nitro.Physics.js';`,
}

await Promise.all( Object.entries( contents ).map( ( [ filename, content ] ) =>
    writeFile( `./build/${ filename }`, '// dev build\n' + content + '\n' )
) );
