import { Box, ConvexPolyhedron, Cylinder, Sphere, Vec3 } from './vendor/physics1.js';

/**
 * Converts common Nitro¹ geometries into their closest matching `Physics¹.Shape`.
 *
 * Geometries are expected to be centered on their local origin (as produced by
 * `BoxGeometry`, `SphereGeometry`, etc. by default) since Physics¹ shapes are
 * always defined relative to their body's origin.
 */
class ShapeFactory {

	/**
	 * Creates a `Physics¹.Box` matching the given `BoxGeometry`'s parameters.
	 *
	 * @param {BoxGeometry} geometry
	 * @return {Box}
	 */
	static box( geometry ) {

		const { width = 1, height = 1, depth = 1 } = geometry.parameters ?? {};

		return new Box( new Vec3( width / 2, height / 2, depth / 2 ) );

	}

	/**
	 * Creates a `Physics¹.Sphere` matching the given `SphereGeometry`'s radius.
	 *
	 * @param {SphereGeometry} geometry
	 * @return {Sphere}
	 */
	static sphere( geometry ) {

		const { radius = 1 } = geometry.parameters ?? {};

		return new Sphere( radius );

	}

	/**
	 * Creates a `Physics¹.Cylinder` matching the given `CylinderGeometry`'s parameters.
	 *
	 * @param {CylinderGeometry} geometry
	 * @return {Cylinder}
	 */
	static cylinder( geometry ) {

		const {
			radiusTop = 1,
			radiusBottom = 1,
			height = 1,
			radialSegments = 8
		} = geometry.parameters ?? {};

		return new Cylinder( radiusTop, radiusBottom, height, radialSegments );

	}

	/**
	 * Builds a `Physics¹.ConvexPolyhedron` convex hull from a `BufferGeometry`'s
	 * position attribute. Intended for simple, already-convex meshes; this does
	 * not compute a hull from arbitrary concave geometry.
	 *
	 * @param {BufferGeometry} geometry
	 * @return {ConvexPolyhedron}
	 */
	static convexHull( geometry ) {

		const position = geometry.getAttribute( 'position' );
		const index = geometry.getIndex();

		const vertices = [];

		for ( let i = 0; i < position.count; i ++ ) {

			vertices.push( new Vec3( position.getX( i ), position.getY( i ), position.getZ( i ) ) );

		}

		const faces = [];

		if ( index !== null ) {

			for ( let i = 0; i < index.count; i += 3 ) {

				faces.push( [ index.getX( i ), index.getX( i + 1 ), index.getX( i + 2 ) ] );

			}

		} else {

			for ( let i = 0; i < position.count; i += 3 ) {

				faces.push( [ i, i + 1, i + 2 ] );

			}

		}

		return new ConvexPolyhedron( { vertices, faces } );

	}

	/**
	 * Picks a conversion strategy based on the geometry's type.
	 *
	 * @param {BufferGeometry} geometry
	 * @return {Shape}
	 */
	static fromGeometry( geometry ) {

		switch ( geometry.type ) {

			case 'BoxGeometry':
				return ShapeFactory.box( geometry );

			case 'SphereGeometry':
				return ShapeFactory.sphere( geometry );

			case 'CylinderGeometry':
				return ShapeFactory.cylinder( geometry );

			default:
				return ShapeFactory.convexHull( geometry );

		}

	}

}

export { ShapeFactory };
