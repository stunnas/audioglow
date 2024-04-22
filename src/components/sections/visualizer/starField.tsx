import React, { useRef, useMemo } from "react";
import * as THREE from "three";

interface StarFieldProps {
    count: number;

}


const StarField: React.FC<StarFieldProps> = ({ count }) => {
    const starsRef = useRef<THREE.Points>(null);
    const { positions } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Ensure that the stars are spread throughout the visible scene
            positions[i * 3] = (Math.random() - 0.5) * 500; // X
            positions[i * 3 + 1] = (Math.random() - 0.5) * 500; // Y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 500; // Z
        }
        return { positions };
    }, [count]);

    return (
        <points ref={starsRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={5} // Increased size for visibility
                sizeAttenuation={false} // Keep stars the same size regardless of distance
                color="white" // Typical star color
                transparent={true}
                opacity={1}
            />
        </points>
    );
};

export { StarField }