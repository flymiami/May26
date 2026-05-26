import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'

interface Props {
  position: [number, number, number]
  radius: number
  color: string
}

export default function GlowRing({ position, radius, color }: Props) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.15 + pointer.y * 0.05
    meshRef.current.rotation.z = t * 0.1 + pointer.x * 0.05
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[radius, 0.01, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
