import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Visualizer } from "@/components/types/visualizer";
import { Toruses } from "@/components/sections/visualizer/torusVisualizer";
import { LineWave } from "@/components/sections/visualizer/lineWaveVisualizer";
import { StarField } from "@/components/sections/visualizer/starField";

interface AudioVisualizerProps {
    analyserRef: React.RefObject<AnalyserNode>;
    image: string
    height: number;
    width: number;
    type: Visualizer
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserRef, width, height, image, type }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 100, aspect: width / height, near: 0.1, far: 1000 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 0, 5]} />
                <StarField count={500} />
                {type.type === 'Toruses' && <Toruses analyserRef={analyserRef} image={image} />}
                {type.type === 'Line Waves' && <LineWave analyserRef={analyserRef} image={image}/>}
                <OrbitControls minDistance={1} maxDistance={12} makeDefault={true} />
            </Canvas>
        </div>
    );
};

export default AudioVisualizer;