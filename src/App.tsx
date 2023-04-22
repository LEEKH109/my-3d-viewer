import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from './components/ModelViewer';

const App: React.FC = () => {
	const [objFile, setObjFile] = useState<File | null>(null);
	const [mtlFile, setMtlFile] = useState<File | null>(null);
	const [imgFile, setImgFile] = useState<File | null>(null);
	const [uploadStep, setUploadStep] = useState(0);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const fileType = file.type;
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop()?.toLowerCase();

			const allowedObjExtensions = ['obj'];
			const allowedMtlExtensions = ['mtl'];
			const allowedImgExtensions = ['jpg', 'jpeg', 'png'];

			if (allowedObjExtensions.includes(fileExtension!)) {
				setObjFile(file);
				setUploadStep(1);
			} else if (allowedImgExtensions.includes(fileExtension!)) {
				setImgFile(file);
				setUploadStep(2);
			} else {
				alert('허용되지 않은 파일 형식입니다. 다른 파일을 선택하세요.');
				return;
			}
		}
	};

	const getButtonText = () => {
		switch (uploadStep) {
			case 0:
				return '파일 업로드';
			case 1:
				return '모델 스킨 파일 업로드';
			case 2:
				return '스킨 파일 교체';
			default:
				return '파일 업로드';
		}
	};

	return (
		<Container>
			<Header>
				Free 3D Web Viewer
				<br />
				<KoreanHeader>무료 3D 웹 뷰어</KoreanHeader>
			</Header>
			<Text>
				Click and upload the file to operate.
				<br />
				<KoreanText>파일을 클릭하여 업로드하면 작동합니다.</KoreanText>
			</Text>
			<UploadArea>
				<ModelContainer>
					{objFile && <ModelViewer objFile={objFile} mtlFile={mtlFile} imgFile={imgFile} />}
					<UploadButtonContainer>
						<UploadButton htmlFor='file-upload'>{getButtonText()}</UploadButton>
						<input id='file-upload' type='file' onChange={handleFileUpload} style={{ display: 'none' }} />
					</UploadButtonContainer>
				</ModelContainer>
			</UploadArea>
			<Footer>저작권 관련 정보 © 2023</Footer>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	min-height: 100vh;
	padding-top: 50px;
`;

const ModelContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const Header = styled.header`
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 20px;
	text-align: center;
`;

const KoreanHeader = styled.span`
	font-size: 30px;
`;

const Text = styled.p`
	font-size: 18px;
	text-align: center;
	max-width: 600px;
	margin-bottom: 30px;
`;

const KoreanText = styled.span`
	font-size: 16px;
`;

const UploadArea = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px dashed #cccccc;
	border-radius: 30px; /* 점선 코너를 동그랗게 수정 */
	width: 60%;
	height: 400px;
	margin-bottom: 30px;
`;

const UploadButtonContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const UploadButton = styled.label`
	display: inline-block;
	padding: 12px 24px; /* 버튼 사이즈를 조금 크게 수정 */
	background-color: #007bff;
	color: white;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;
	margin-top: 100px; /* 버튼 위치를 약간 내리기 */
`;

const Footer = styled.footer`
	font-size: 14px;
	position: absolute;
	bottom: 20px;
	text-align: center;
	width: 100%;
`;

export default App;
