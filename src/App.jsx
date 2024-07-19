import * as THREE from 'three';
import { Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Sky, useScroll, useGLTF } from '@react-three/drei';

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10] }} style={{ width: '100%', height: '100vh' }}>
      {/* Ambient light to illuminate the model evenly */}
      <ambientLight intensity={0.4} />

      {/* Directional light to simulate sunlight */}
      <directionalLight
        color="#ffffff"
        intensity={10}
        position={[10, 10, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Additional directional light to ensure good coverage from different angles */}
      <directionalLight
        color="#ffffff"
        intensity={10}
        position={[-10, -10, -5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* Spot light to add emphasis */}
      <spotLight
        angle={10}
        color="#ffd0d0"
        penumbra={5}
        position={[25, 50, -20]}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        castShadow
      />

      <Sky scale={1000} sunPosition={[2, 0.4, 10]} />
      
      <Suspense fallback={null}>
        <ScrollControls pages={3}>
          <LittlestTokyo scale={0.5} position={[0, -2, 0]} />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

function LittlestTokyo({ ...props }) {
  const scroll = useScroll();
  const { scene } = useGLTF('/3we.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true; // Ensure materials are updated
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    const offset = scroll.offset;
    scene.rotation.y = offset * Math.PI * 2; // Rotate around Y-axis
    scene.position.set(-offset * 5, -offset * 5, 0); // Move to bottom-left
    scene.scale.set(0.05 + 0.45 * (1 - offset), 0.05 + 0.45 * (1 - offset), 0.05 + 0.45 * (1 - offset)); // Scale down
  });

  return <primitive object={scene} {...props} />;
}

export default App;
