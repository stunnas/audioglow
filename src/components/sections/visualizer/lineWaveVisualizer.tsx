import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from '@react-three/fiber';


interface LineWaveProps {
    analyserRef: React.RefObject<AnalyserNode>;
    image: string;

}

const LineWave: React.FC<LineWaveProps> = ({ analyserRef, image }) => {
    const { scene } = useThree();
    const texture = useLoader(THREE.TextureLoader, image); // Load the image as a texture
    const linesRef = useRef<THREE.Mesh[]>([]);
    const numLines = 250; // Number of lines
    const spacing = 15 / numLines; // Adjust spacing relative to the number of lines

    useEffect(() => {
        linesRef.current = new Array(numLines).fill(null).map((_, i) => {
            const xPosition = (i - numLines / 2) * spacing;
            const geometry = new THREE.PlaneGeometry(0.05, 1); // Width, Height of the plane

            // Set up UV mapping for each plane
            const uStart = i / numLines;
            const uEnd = (i + 1) / numLines;
            const uvAttribute = geometry.attributes.uv;
            uvAttribute.setXY(0, uStart, 1); // Bottom left
            uvAttribute.setXY(1, uEnd, 1);   // Bottom right
            uvAttribute.setXY(2, uStart, 0); // Top left
            uvAttribute.setXY(3, uEnd, 0);   // Top right

            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(xPosition, 0, 0);
            scene.add(plane);
            return plane;
        });

        return () => {
            linesRef.current.forEach(plane => {
                scene.remove(plane);
                plane.geometry.dispose();
            });
        };
    }, [scene, numLines, spacing, texture]);

    useFrame(() => {
        if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            linesRef.current.forEach((plane, index) => {
                const t = index / numLines;
                const frequency = dataArray[Math.floor(t * dataArray.length)] / 64;
                plane.scale.setY(Math.max(0.1, frequency * 15)); // Adjust the height scaling based on frequency
                plane.position.setY(frequency / 2 ); // Adjust the vertical position
            });
        }
    });

    return null; // Components are added to the scene in useEffect, no need to return anything
};

export { LineWave }