import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Neumático abstracto estilizado
const MovingTire = ({ startOffset = 0, speed = 2, scale = 1, color = "#4f46e5", z = 0 }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotar el grupo entero (alrededor del eje Z) simulando que la rueda gira
      groupRef.current.rotation.z -= speed * 0.8 * delta;
      
      // Mover en X (de izquierda a derecha)
      groupRef.current.position.x += speed * 0.8 * delta;
      
      if (groupRef.current.position.x > 15) {
        groupRef.current.position.x = -15;
      }
    }
  });

  return (
    <group ref={groupRef} position={[startOffset, 0, z]} scale={scale}>
      {/* Outer Tire (Goma oscura y mate) */}
      <mesh>
        <torusGeometry args={[1, 0.35, 16, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Inner Rim Edge (Llanta metálica con brillo neón) */}
      <mesh>
        <torusGeometry args={[0.65, 0.05, 16, 64]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.8} 
          emissive={color} 
          emissiveIntensity={0.8} 
        />
      </mesh>

      {/* Center Cap (Centro de la llanta) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Spokes (Rayos deportivos de la llanta) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <boxGeometry args={[0.12, 1.3, 0.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}

      {/* Aro decorativo interno */}
      <mesh>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export default function TireAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80" style={{ zIndex: 0 }}>
      {/* El fondo de Canvas transparente */}
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 8]} intensity={2.5} />
        <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#0ea5e9" />
        <spotLight position={[5, -5, 5]} angle={0.3} penumbra={1} intensity={2} color="#4f46e5" />
        
        {/* Instancias de ruedas con diferentes velocidades, profundidades (Z) y tamaños */}
        <MovingTire startOffset={-14} speed={3.5} color="#4f46e5" z={-2} scale={0.8} />
        <MovingTire startOffset={-8} speed={2.8} color="#0ea5e9" z={-1} scale={0.9} />
        <MovingTire startOffset={-2} speed={4.2} color="#3b82f6" z={-3} scale={0.7} />
        <MovingTire startOffset={5} speed={3.1} color="#6366f1" z={0} scale={1} />
        <MovingTire startOffset={12} speed={3.8} color="#2563eb" z={-1.5} scale={0.85} />
      </Canvas>
    </div>
  );
}
