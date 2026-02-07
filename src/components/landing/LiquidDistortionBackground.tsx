import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Vertex Shader - passes UV coordinates to fragment shader
 */
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment Shader - creates liquid distortion effect
 * Uses Simplex noise for organic distortion patterns
 */
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    // Normalize coordinates
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    // Calculate distance from mouse (in normalized coordinates)
    vec2 mouseNorm = uMouse * 0.5 + 0.5; // Convert from [-1,1] to [0,1]
    float distToMouse = distance(uv, mouseNorm);
    
    // Smooth falloff - stronger near cursor, fades with distance
    float influence = smoothstep(0.6, 0.0, distToMouse);
    
    // Create flowing noise pattern
    float noise1 = snoise(uv * 3.0 + uTime * 0.1);
    float noise2 = snoise(uv * 5.0 - uTime * 0.05);
    
    // Combine noise layers for complex distortion
    vec2 distortion = vec2(noise1, noise2) * 0.02;
    
    // Add cursor-based distortion
    vec2 toMouse = uv - mouseNorm;
    float mouseDist = length(toMouse);
    vec2 mouseDistortion = toMouse * influence * 0.08 * sin(uTime * 0.5);
    
    // Apply total distortion to UV
    vec2 distortedUV = uv + distortion + mouseDistortion;
    
    // Create gradient background with green theme colors
    // Base colors from tailwind config: #0f3d2e and #145a3a
    vec3 color1 = vec3(0.059, 0.239, 0.180); // #0f3d2e
    vec3 color2 = vec3(0.078, 0.353, 0.227); // #145a3a
    vec3 color3 = vec3(0.133, 0.545, 0.369); // Lighter green accent
    
    // Create gradient based on distorted UV
    float gradientMix = distortedUV.y;
    vec3 baseColor = mix(color1, color2, gradientMix);
    
    // Add subtle highlights where cursor influence is strong
    vec3 highlightColor = color3;
    vec3 finalColor = mix(baseColor, highlightColor, influence * 0.3);
    
    // Add subtle animated glow
    float glow = snoise(distortedUV * 2.0 + uTime * 0.08) * 0.1 + 0.9;
    finalColor *= glow;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/**
 * Distortion Plane - the mesh with custom shader material
 */
function DistortionPlane() {
    const meshRef = useRef<THREE.Mesh>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Shader uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }),
        []
    );

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Convert to normalized device coordinates (-1 to +1)
            targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const handleResize = () => {
            uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [uniforms]);

    // Animation loop
    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Smooth mouse interpolation for fluid movement
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

        // Update uniforms
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = state.clock.elapsedTime;
        material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
}

/**
 * Main Component - Liquid Distortion Background
 * 
 * Creates a full-screen WebGL canvas with organic liquid distortion effect
 * that responds to cursor movement. Automatically disabled on mobile devices.
 */
export default function LiquidDistortionBackground() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile devices and disable effect for performance
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || window.innerWidth < 768;
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render on mobile devices
    if (isMobile) return null;

    return (
        <div
            className="fixed inset-0 w-full h-full"
            style={{
                zIndex: 0,
                pointerEvents: 'none' // Allow clicks to pass through
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio for performance
            >
                <DistortionPlane />
            </Canvas>
        </div>
    );
}
