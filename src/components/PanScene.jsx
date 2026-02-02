import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";

const PanBowl = () => (
  <group rotation={[-0.35, 0, 0]} position={[0, -0.15, 0]}>
    <mesh>
      <cylinderGeometry args={[3.2, 2.8, 0.6, 64, 1, true]} />
      <meshStandardMaterial
        color="#2d2a28"
        metalness={0.7}
        roughness={0.35}
        side={DoubleSide}
      />
    </mesh>
    <mesh position={[0, 0.3, 0]}>
      <torusGeometry args={[3.1, 0.08, 16, 80]} />
      <meshStandardMaterial color="#5a534f" metalness={0.8} roughness={0.4} />
    </mesh>
    <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2.8, 64]} />
      <meshStandardMaterial color="#252321" metalness={0.4} roughness={0.6} />
    </mesh>
  </group>
);

export const PanScene = ({ notes, activeNoteId, onNotePress }) => (
  <Canvas camera={{ position: [0, 4.2, 6], fov: 45 }}>
    <color attach="background" args={["#0f0e0d"]} />
    <ambientLight intensity={0.4} />
    <directionalLight position={[6, 8, 4]} intensity={0.9} />
    <directionalLight position={[-4, 4, -2]} intensity={0.4} />

    <group rotation={[0.25, 0, 0]}>
      <PanBowl />
      {notes.map((note) => {
        const isActive = note.id === activeNoteId;
        return (
          <mesh
            key={note.id}
            position={note.position}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerDown={(event) => {
              event.stopPropagation();
              onNotePress(note.id);
            }}
          >
            <circleGeometry args={[0.34, 32]} />
            <meshStandardMaterial
              color={isActive ? "#ffad7a" : "#a6e4dd"}
              metalness={0.15}
              roughness={0.35}
              emissive={isActive ? "#ff6a3d" : "#0a3b36"}
              emissiveIntensity={isActive ? 0.5 : 0.2}
            />
          </mesh>
        );
      })}
    </group>

    <OrbitControls
      enablePan={false}
      enableZoom={true}
      minDistance={4.5}
      maxDistance={8}
      maxPolarAngle={Math.PI / 2.1}
    />
  </Canvas>
);
