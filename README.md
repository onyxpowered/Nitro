# Nitro¹

#### A WebGL2 game engine, by Onyx Labs

Nitro¹ is a lightweight, WebGL2-only 3D engine with a built-in physics module, purpose-built to run offline under the `file://` protocol on low-end Chromium.

### Usage

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene. It then creates a renderer for the scene and camera, and it adds that viewport to the `document.body` element. Finally, it animates the cube within the scene for the camera.

```javascript
import * as Nitro from 'nitro1';

const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new Nitro.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const scene = new Nitro.Scene();

const geometry = new Nitro.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new Nitro.MeshNormalMaterial();

const mesh = new Nitro.Mesh( geometry, material );
scene.add( mesh );

const renderer = new Nitro.NitroRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
```

### Physics

Nitro¹ ships with a built-in Physics¹ module that requires no network access:

```javascript
import { PhysicsWorld } from 'nitro1/physics';

const physics = new PhysicsWorld();
physics.addBody( groundMesh, { mass: 0 } );
physics.addBody( boxMesh, { mass: 1 } );

function animate() {

	physics.step( 1 / 60 );
	renderer.render( scene, camera );

}
```

### License

See [LEGAL.md](./LEGAL.md).
