import { ExtrudeGeometry, ExtrudeGeometryOptions, Shape, ShapePath } from 'three';
import { Font } from './fontLoader';  // Ensure Font is correctly imported

interface TextGeometryParameters extends ExtrudeGeometryOptions {
    font?: Font;
    size?: number;
}

class TextGeometry extends ExtrudeGeometry {
    type = 'TextGeometry';

    constructor(text: string, parameters: TextGeometryParameters = {}) {
        if (!parameters.font) {
            throw new Error("Font is required to create TextGeometry");
        }

        // Retrieve ShapePath array and convert each to Shape
        const shapePaths = parameters.font.generateShapes(text, parameters.size ?? 100);
        const shapes = shapePaths.reduce((acc: Shape[], path: ShapePath) => {
            // Convert each ShapePath to Shape(s) and append to accumulator
            const convertedShapes = path.toShapes(true);  // 'true' to get all holes included
            acc.push(...convertedShapes);
            return acc;
        }, []);

        const extrudeSettings: ExtrudeGeometryOptions = {
            depth: parameters.depth ?? 50,
            steps: parameters.steps ?? 1,
            bevelEnabled: parameters.bevelEnabled ?? false,
            bevelThickness: parameters.bevelThickness ?? 2,
            bevelSize: parameters.bevelSize ?? 0.5,
            bevelOffset: parameters.bevelOffset ?? 0,
            bevelSegments: parameters.bevelSegments ?? 3
        };

        super(shapes, extrudeSettings);
    }
}

export { TextGeometry };
