import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Scene from './components/Scene'
import Overlay from './components/Overlay'

export default function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 8, 25]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[-5, 3, -5]} intensity={0.8} color="#7c3aed" />
        <pointLight position={[3, -2, 4]} intensity={0.4} color="#4f46e5" />
        <Scene />
        <Environment preset="night" />
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0005, 0.0005]}
          />
        </EffectComposer>
      </Canvas>
      <Overlay />
    </>
  )
}
