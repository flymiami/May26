import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

export default function CentralSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + pointer.y * 0.1
    meshRef.current.rotation.y = t * 0.15 + pointer.x * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.8, 20]} />
      <MeshDistortMaterial
        color="#1a0a3e"
        emissive="#7c3aed"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.9}
        distort={0.25}
        speed={2}
        wireframe={false}
      />
    </mesh>
  )
}
