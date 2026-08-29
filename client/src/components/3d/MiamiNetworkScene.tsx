import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

interface RouteDef {
  end: [number, number, number];
  speed: number;
  offset: number;
}

const MIAMI: [number, number, number] = [1.6, 0, 1.1];

// Stylized destination points fanning out from the Miami hub — not real coordinates.
const ROUTE_ENDS: [number, number, number][] = [
  [1.2, 0, -3.4],
  [-1.6, 0, -2.4],
  [-3.6, 0, -0.4],
  [-2.6, 0, 1.8],
  [-0.2, 0, 2.6],
];

function buildRoutes(count: number): RouteDef[] {
  return ROUTE_ENDS.slice(0, count).map((end, i) => ({
    end,
    speed: 0.18 + i * 0.03,
    offset: i / count,
  }));
}

function arcPoints(end: [number, number, number]): THREE.Vector3[] {
  const start = new THREE.Vector3(...MIAMI);
  const finish = new THREE.Vector3(...end);
  const mid = start.clone().lerp(finish, 0.5);
  mid.y += start.distanceTo(finish) * 0.28;
  const curve = new THREE.QuadraticBezierCurve3(start, mid, finish);
  return curve.getPoints(48);
}

function RouteArc({ end }: { end: [number, number, number] }) {
  const points = useMemo(() => arcPoints(end), [end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#FF7F45" transparent opacity={0.55} />
    </line>
  );
}

function ShipmentDot({ end, speed, offset }: RouteDef) {
  const ref = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...MIAMI);
    const finish = new THREE.Vector3(...end);
    const mid = start.clone().lerp(finish, 0.5);
    mid.y += start.distanceTo(finish) * 0.28;
    return new THREE.QuadraticBezierCurve3(start, mid, finish);
  }, [end]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    const p = curve.getPoint(t);
    ref.current.position.copy(p);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#FFC2A1" />
    </mesh>
  );
}

function MiamiHub() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
    ref.current.scale.setScalar(s);
  });
  return (
    <group position={MIAMI}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#FF6A2C" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.2, 32]} />
        <meshBasicMaterial color="#FF6A2C" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GroundGrid() {
  return (
    <group>
      <gridHelper args={[14, 28, '#274873', '#1B3355']} position={[0, -0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#0A1220" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/** Slow auto-drift + gentle mouse parallax on the camera rig. Disabled entirely when reduced=true. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ camera, clock, pointer }) => {
    if (reduced) {
      camera.position.set(0, 5.2, 6.5);
      camera.lookAt(0, 0, 0);
      return;
    }
    mouse.current.x += (pointer.x - mouse.current.x) * 0.02;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.02;
    const t = clock.getElapsedTime() * 0.05;
    camera.position.x = Math.sin(t) * 1.2 + mouse.current.x * 0.6;
    camera.position.z = 6.5 + Math.cos(t) * 0.5;
    camera.position.y = 5.2 + mouse.current.y * 0.4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface SceneProps {
  routeCount: number;
  reducedMotion: boolean;
}

function Scene({ routeCount, reducedMotion }: SceneProps) {
  const routes = useMemo(() => buildRoutes(routeCount), [routeCount]);

  return (
    <>
      <CameraRig reduced={reducedMotion} />
      <ambientLight intensity={1.2} />
      <GroundGrid />
      <MiamiHub />
      {routes.map((r) => (
        <group key={r.end.join(',')}>
          <RouteArc end={r.end} />
          {!reducedMotion && <ShipmentDot {...r} />}
        </group>
      ))}
    </>
  );
}

interface MiamiNetworkSceneProps {
  /** Fewer routes / no particles for small screens or low-power situations. */
  lowPower?: boolean;
  /** Freezes camera drift and shipment dots. */
  reducedMotion?: boolean;
}

const cameraProps: NonNullable<ThreeElements['perspectiveCamera']['position']> = [0, 5.2, 6.5];

export function MiamiNetworkScene({ lowPower = false, reducedMotion = false }: MiamiNetworkSceneProps) {
  const routeCount = lowPower ? 3 : 5;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: cameraProps, fov: 42 }}
      shadows={false}
    >
      <Scene routeCount={routeCount} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
