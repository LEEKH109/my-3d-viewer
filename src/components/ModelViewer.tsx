import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Group } from 'three';
import { Object3D } from 'three';

interface ModelViewerProps {
	objFile: File;
	imgFile: File | null;
}

function useModelLoader(extension: string | undefined, url: string) {
	const { scene } = useThree();
	const [object, setObject] = useState<Object3D | undefined>();

	useEffect(() => {
		if (!extension || !url) return;

		async function loadModel() {
			let obj: THREE.Object3D | undefined;

			if (extension === 'obj') {
				const loader = new OBJLoader();
				obj = await loader.loadAsync(url);
			} else if (extension === 'gltf' || extension === 'glb') {
				const loader = new GLTFLoader();
				const { scene: gltfScene } = await loader.loadAsync(url);
				obj = gltfScene;
			} else if (extension === 'fbx') {
				const loader = new FBXLoader();
				obj = await loader.loadAsync(url);
			} else if (extension === 'dae') {
				const loader = new ColladaLoader();
				const { scene: colladaScene } = await loader.loadAsync(url);
				obj = colladaScene;
			} else if (extension === 'ply') {
				const loader = new PLYLoader();
				const bufferGeometry = await loader.loadAsync(url);
				obj = new THREE.Mesh(bufferGeometry, new THREE.MeshStandardMaterial());
			} else if (extension === 'stl') {
				const loader = new STLLoader();
				const bufferGeometry = await loader.loadAsync(url);
				obj = new THREE.Mesh(bufferGeometry, new THREE.MeshStandardMaterial());
			}

			setObject(obj);
			if (obj) {
				scene.add(obj);
			}
		}

		loadModel();

		return () => {
			if (object) {
				scene.remove(object);
			}
		};
	}, [extension, url, scene]);

	return object;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ objFile, imgFile }) => {
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
		const fileExtension = objFile.name.split('.').pop()?.toLowerCase();
		const obj = useModelLoader(fileExtension, objUrl as string);
		const meshRef = useRef<Object3D>();
		const texture = imgUrl ? new TextureLoader().load(imgUrl) : null;

		useEffect(() => {
			if (meshRef.current) {
				meshRef.current.scale.set(10, 10, 10); // 모델의 크기를 조절
			}
		}, [meshRef]);

		if (texture && obj) {
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

		if (!obj) return null;
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
