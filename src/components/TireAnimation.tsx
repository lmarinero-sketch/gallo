import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Neumático individual que rota y avanza
const MovingTire = ({ startOffset = 0, speed = 2, color = "#222" }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotar el neumático sobre el eje correspondiente para simular que rueda
      meshRef.current.rotation.x -= speed * delta;
      
      // Mover en el eje X de izquierda a derecha
      meshRef.current.position.x += speed * 0.8 * delta;
      
      // Bucle infinito: si cruza el margen derecho, lo devolvemos al izquierdo
      if (meshRef.current.position.x > 12) {
        meshRef.current.position.x = -12;
      }
    }
  });

  return (
    // Rotamos inicialmente 90 grados en Z para que el cilindro parezca una rueda apoyada
    <mesh ref={meshRef} position={[startOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      {/* Geometría de cilindro parecida a un neumático */}
      <cylinderGeometry args={[1, 1, 0.8, 24, 1]} />
      {/* Estilo holográfico/wireframe sutil */}
      <meshStandardMaterial 
        color={color} 
        wireframe={true} 
        transparent={true} 
        opacity={0.4} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default function TireAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60" style={{ zIndex: 0 }}>
      {/* El fondo de Canvas debe ser transparente para no tapar el header */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        
        {/* Instancias de ruedas con diferentes velocidades y posiciones iniciales */}
        <MovingTire startOffset={-12} speed={3.5} color="#4f46e5" />
        <MovingTire startOffset={-6} speed={2.8} color="#0ea5e9" />
        <MovingTire startOffset={0} speed={4.2} color="#3b82f6" />
        <MovingTire startOffset={6} speed={3.1} color="#6366f1" />
        <MovingTire startOffset={12} speed={3.8} color="#2563eb" />
      </Canvas>
    </div>
  );
}
