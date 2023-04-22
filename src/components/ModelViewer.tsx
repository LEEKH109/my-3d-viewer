import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { Group } from 'three';

interface ModelViewerProps {
	file: File;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ file }) => {
	const [objUrl, setObjUrl] = useState<string | null>(null);

	useEffect(() => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				setObjUrl(e.target.result as string);
			}
		};
		reader.readAsDataURL(file);
	}, [file]);

	const Model = () => {
		const obj = useLoader(OBJLoader, objUrl as string);
		const meshRef = useRef<Group>();

		useEffect(() => {
			if (meshRef.current) {
				meshRef.current.scale.set(20, 20, 20); // 모델의 크기를 조절
			}
		}, [meshRef]);

		return <primitive ref={meshRef} object={obj} />;
	};

	return (
		<Canvas>
			<ambientLight intensity={0.5} />
			<Suspense fallback={null}>
				{objUrl && <Model />}
				<Environment preset='sunset' />
			</Suspense>
			<OrbitControls />
		</Canvas>
	);
};

export default ModelViewer;
