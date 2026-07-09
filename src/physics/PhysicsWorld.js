import { Body, Vec3, World } from './vendor/physics1.js';
import { ShapeFactory } from './ShapeFactory.js';

/**
 * A thin wrapper around a Physics¹ `World` that keeps bound `Object3D`
 * transforms in sync with their physics bodies.
 *
 * ```js
 * const physics = new PhysicsWorld();
 * physics.addBody( floorMesh, { mass: 0 } );
 * physics.addBody( boxMesh, { mass: 1 } );
 *
 * function animate() {
 *
 * 	physics.step( 1 / 60 );
 * 	renderer.render( scene, camera );
 *
 * }
 * ```
 */
class PhysicsWorld {

	/**
	 * @param {Object} [options]
	 * @param {Vector3|{x:number,y:number,z:number}} [options.gravity] - Defaults to `(0, -9.82, 0)`.
	 */
	constructor( options = {} ) {

		const gravity = options.gravity ?? { x: 0, y: - 9.82, z: 0 };

		/**
		 * The underlying Physics¹ world.
		 *
		 * @type {World}
		 */
		this.world = new World( {
			gravity: new Vec3( gravity.x, gravity.y, gravity.z )
		} );

		/**
		 * Objects currently bound to a physics body, kept in sync on `step()`.
		 *
		 * @type {Array<Object3D>}
		 */
		this.objects = [];

	}

	/**
	 * Creates a physics body for the given object, binds it via
	 * `object.physicsBody`, and starts syncing the object's transform to the
	 * body's transform on every `step()` call.
	 *
	 * @param {Object3D} object - Must have a `geometry` unless `shape` is provided.
	 * @param {Object} [options]
	 * @param {number} [options.mass=0] - `0` creates a static body.
	 * @param {Shape} [options.shape] - Explicit shape; inferred from `object.geometry` if omitted.
	 * @return {Body} The created body.
	 */
	addBody( object, options = {} ) {

		const shape = options.shape ?? ShapeFactory.fromGeometry( object.geometry );
		const mass = options.mass ?? 0;

		const body = new Body( { mass, shape } );

		body.position.set( object.position.x, object.position.y, object.position.z );
		body.quaternion.set( object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w );

		this.world.addBody( body );

		object.physicsBody = body;
		this.objects.push( object );

		return body;

	}

	/**
	 * Removes the object's physics body from the world and unbinds it.
	 *
	 * @param {Object3D} object
	 */
	removeBody( object ) {

		if ( object.physicsBody === null ) return;

		this.world.removeBody( object.physicsBody );
		object.physicsBody = null;

		const index = this.objects.indexOf( object );
		if ( index !== - 1 ) this.objects.splice( index, 1 );

	}

	/**
	 * Steps the simulation and copies each bound body's transform back onto
	 * its `Object3D`.
	 *
	 * @param {number} deltaTime - Elapsed time in seconds since the last step.
	 * @param {number} [maxSubSteps=10]
	 */
	step( deltaTime, maxSubSteps = 10 ) {

		this.world.step( 1 / 60, deltaTime, maxSubSteps );

		for ( let i = 0; i < this.objects.length; i ++ ) {

			const object = this.objects[ i ];
			const body = object.physicsBody;

			object.position.set( body.position.x, body.position.y, body.position.z );
			object.quaternion.set( body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w );

		}

	}

}

export { PhysicsWorld };
