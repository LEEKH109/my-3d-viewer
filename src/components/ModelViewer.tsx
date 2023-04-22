import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Group } from 'three';

interface ModelViewerProps {
	objFile: File;
	mtlFile: File | null;
	imgFile: File | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ objFile, mtlFile, imgFile }) => {
	const [objUrl, setObjUrl] = useState<string | null>(null);
	const [imgUrl, setImgUrl] = useState<string | null>(null);

	useEffect(() => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				setObjUrl(e.target.result as string);
			}
		};
		reader.readAsDataURL(objFile);
	}, [objFile]);

	useEffect(() => {
		if (imgFile) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					setImgUrl(e.target.result as string);
				}
			};
			reader.readAsDataURL(imgFile);
		}
	}, [imgFile]);

	const Model = () => {
		const obj = useLoader(OBJLoader, objUrl as string);
		const meshRef = useRef<Group>();
		const texture = imgUrl ? new TextureLoader().load(imgUrl) : null;

		useEffect(() => {
			if (meshRef.current) {
				meshRef.current.scale.set(20, 20, 20); // 모델의 크기를 조절
			}
		}, [meshRef]);

		if (texture) {
			obj.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const meshChild = child as THREE.Mesh;
					if (imgUrl) {
						const texture = new THREE.TextureLoader().load(imgUrl);
						meshChild.material = new THREE.MeshStandardMaterial({ map: texture });
					}
				}
			});
		}

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
