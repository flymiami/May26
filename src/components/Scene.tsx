import FloatingGeometry from './FloatingGeometry'
import ParticleField from './ParticleField'
import GlowRing from './GlowRing'
import CentralSphere from './CentralSphere'

export default function Scene() {
  return (
    <group>
      <CentralSphere />

      <FloatingGeometry
        position={[-3.5, 1.5, -2]}
        geometry="octahedron"
        color="#a78bfa"
        speed={0.8}
        scale={0.6}
      />
      <FloatingGeometry
        position={[3.8, -1, -3]}
        geometry="torus"
        color="#7c3aed"
        speed={1.2}
        scale={0.5}
      />
      <FloatingGeometry
        position={[-2.5, -2, 1]}
        geometry="icosahedron"
        color="#4f46e5"
        speed={0.6}
        scale={0.45}
      />
      <FloatingGeometry
        position={[2.5, 2.5, -1]}
        geometry="dodecahedron"
        color="#8b5cf6"
        speed={1}
        scale={0.35}
      />
      <FloatingGeometry
        position={[4, 0.5, 2]}
        geometry="tetrahedron"
        color="#6d28d9"
        speed={0.9}
        scale={0.5}
      />
      <FloatingGeometry
        position={[-4, -0.5, -1]}
        geometry="box"
        color="#c4b5fd"
        speed={0.7}
        scale={0.3}
      />

      <GlowRing position={[0, 0, -1]} radius={3} color="#7c3aed" />
      <GlowRing position={[0, 0, -2]} radius={4.5} color="#4f46e5" />

      <ParticleField count={1500} />
    </group>
  )
}
