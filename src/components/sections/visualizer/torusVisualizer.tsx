import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import {  useFrame, useLoader } from '@react-three/fiber';

interface TorusProps {
    analyserRef: React.RefObject<AnalyserNode>;
    image: string;
}
interface ParticleEffectsProps {
    analyserRef: React.RefObject<AnalyserNode>;
    scale: number;
}


const Toruses: React.FC<TorusProps> = ({ analyserRef, image }) => {
    const toruses = useRef<THREE.Mesh[]>([]);
    const texture = useLoader(THREE.TextureLoader, image); // Load the image as a texture
    const scales = useRef(new Array(40).fill(1));

    useFrame(() => {
        if (analyserRef.current && toruses.current.length) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            toruses.current.forEach((torus, index) => {
                const frequencyBandIndex = Math.floor((index / toruses.current.length) * dataArray.length);
                scales.current[index] = dataArray[frequencyBandIndex] / 128;
                torus.scale.set(scales.current[index] + 1, scales.current[index] + 1, 1);
            });
        }
    });

    return (
        <>
            {[...Array(40)].map((_, i) => (
                <group key={i}>
                    <mesh
                        ref={el => { if (el) toruses.current[i] = el; }}
                        position={[0, 0, 0]}
                        geometry={new THREE.TorusGeometry(0.5 + i * 0.2, 0.1, 24, 100)}
                        material={new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })}
                    />
                    <ParticleEffects scale={scales.current[i]} analyserRef={analyserRef} />
                </group>
            ))}
        </>
    );
};

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ scale, analyserRef }) => {
    const numParticles = 5;
    const particlesRef = useRef<THREE.Points>(null);
    const { positions, colors, phases } = useMemo(() => {
        const positions = [];
        const colors = [];
        const phases = new Float32Array(numParticles); // Store initial angles
        const color = new THREE.Color();

        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * scale * 2; // Scale particles outward
            const y = Math.sin(angle) * scale * 2; // Scale particles outward
            const z = 0; // Centered around the torus

            positions.push(x, y, z);
            phases[i] = angle; // Store the initial angle

            color.setHSL(i / numParticles, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
        }

        return { positions: new Float32Array(positions), colors: new Float32Array(colors), phases };
    }, [scale]);

    useFrame(() => {
        if (particlesRef.current && analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const positions = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                const frequency = dataArray[Math.floor((idx / positions.length) * dataArray.length)] / 256;
                phases[idx] += frequency * 0.1;
                const x = Math.cos(phases[idx]) * scale * 2;
                const y = Math.sin(phases[idx]) * scale * 2;
                positions[i] = x;
                positions[i + 1] = y;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    itemSize={3}
                    count={positions.length / 3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    array={colors}
                    itemSize={3}
                    count={colors.length / 3}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.05}
                sizeAttenuation={true}
                vertexColors={true}
                transparent={true}
                alphaTest={0.5}
                opacity={0.75}
            />
        </points>
    );
};

export { Toruses, ParticleEffects }