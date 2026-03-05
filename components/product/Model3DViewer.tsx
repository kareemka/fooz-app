"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Model ────────────────────────────────────────────────────────────────
function GLBModel({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    return (
        <Center>
            <primitive ref={ref} object={scene} dispose={null} />
        </Center>
    );
}

// ─── Fallback mesh while model loads ─────────────────────────────────────────
function ModelFallback() {
    const ref = useRef<THREE.Mesh>(null);
    return (
        <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#7c3aed" wireframe />
        </mesh>
    );
}

// ─── Main Viewer ──────────────────────────────────────────────────────────────
export default function Model3DViewer({ glbUrl }: { glbUrl: string }) {
    return (
        <Canvas
            camera={{ position: [0, 0.5, 3], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%", background: "transparent" }}
            dpr={[1, 1.5]}
        >
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 2, -5]} intensity={0.4} color="#6366f1" />
            <pointLight position={[0, 4, 0]} intensity={0.6} color="#ffffff" />

            {/* Lights provide enough volume without external Environment maps that might fail CSP */}

            {/* Model */}
            <Suspense fallback={<ModelFallback />}>
                <GLBModel url={glbUrl} />
            </Suspense>

            {/* Ground shadow */}
            <ContactShadows
                position={[0, -1.4, 0]}
                opacity={0.35}
                scale={8}
                blur={2}
                far={4}
                color="#000000"
            />

            {/* Controls - drag to rotate, scroll to zoom */}
            <OrbitControls
                enablePan={false}
                minDistance={1}
                maxDistance={8}
                autoRotate={false}
                dampingFactor={0.08}
                enableDamping
            />
        </Canvas>
    );
}
