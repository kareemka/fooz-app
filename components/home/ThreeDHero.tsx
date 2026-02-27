"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

const GamingArtifact = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
            meshRef.current.position.y = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <Float speed={3} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1, 0.35, 256, 32]} />
                <MeshDistortMaterial
                    color="#b026ff"
                    speed={4}
                    distort={0.3}
                    radius={1}
                    emissive="#ff007f"
                    emissiveIntensity={0.8}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
        </Float>
    );
};

const ThreeDHero = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                <Environment preset="night" />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#b026ff" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#00f2ff" />
                <pointLight position={[0, 5, -5]} intensity={1} color="#ff007f" />

                <GamingArtifact />

                <ContactShadows
                    position={[0, -2.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4.5}
                />
            </Canvas>
        </div>
    );
};

export default ThreeDHero;
