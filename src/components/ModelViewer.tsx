import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib/loaders/OBJLoader';
import { Environment, OrbitControls } from '@react-three/drei';

interface ModelProps {
	file: File;
}

const Model: React.FC<ModelProps> = ({ file }) => {
	const objUrl = URL.createObjectURL(file);
	const obj = useLoader(OBJLoader, objUrl);

	useEffect(() => {
		return () => {
			URL.revokeObjectURL(objUrl);
		};
	}, [objUrl]);

	return <primitive object={obj} />;
};

const ModelViewer: React.FC<ModelProps> = ({ file }) => {
	if (!file) return null;

	return (
		<Canvas>
			<ambientLight intensity={0.5} />
			<Suspense fallback={null}>
				<Model file={file} />
				<Environment preset='sunset' />
			</Suspense>
			<OrbitControls />
		</Canvas>
	);
};

export default ModelViewer;
