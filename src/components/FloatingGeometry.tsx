import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

interface Props {
  position: [number, number, number]
  geometry: 'octahedron' | 'torus' | 'icosahedron' | 'dodecahedron' | 'tetrahedron' | 'box'
  color: string
  speed: number
  scale: number
}

const geometries = {
  octahedron: <octahedronGeometry args={[1, 0]} />,
  torus: <torusGeometry args={[1, 0.4, 16, 32]} />,
  icosahedron: <icosahedronGeometry args={[1, 0]} />,
  dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
  tetrahedron: <tetrahedronGeometry args={[1, 0]} />,
  box: <boxGeometry args={[1, 1, 1]} />,
}

export default function FloatingGeometry({ position, geometry, color, speed, scale }: Props) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * speed
    meshRef.current.rotation.x = t * 0.5
    meshRef.current.rotation.y = t * 0.3
    meshRef.current.rotation.z = t * 0.2
  })

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometries[geometry]}
        <MeshTransmissionMaterial
          color={color}
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.3}
          backside
          samples={4}
          resolution={256}
        />
      </mesh>
    </Float>
  )
}
