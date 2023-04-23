import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from './components/ModelViewer';

const App: React.FC = () => {
	const [objFile, setObjFile] = useState<File | null>(null);
	const [imgFile, setImgFile] = useState<File | null>(null);
	const [uploadStep, setUploadStep] = useState(0);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop()?.toLowerCase();

			const allowedObjExtensions = ['obj'];
			const allowedImgExtensions = ['jpg', 'jpeg', 'png'];

			if (uploadStep === 0 && allowedObjExtensions.includes(fileExtension!)) {
				setObjFile(file);
				setUploadStep(1);
			} else if (uploadStep === 1 && allowedImgExtensions.includes(fileExtension!)) {
				setImgFile(file);
				setUploadStep(2);
			} else if (uploadStep === 2 && allowedImgExtensions.includes(fileExtension!)) {
				setImgFile(file);
				setUploadStep(2);
			} else {
				alert('허용되지 않은 파일 형식입니다. 다른 파일을 선택하세요.');
				return;
			}
		}
	};

	const handleReset = () => {
		setObjFile(null);
		setImgFile(null);
		setUploadStep(0);
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
					{objFile && <ModelViewer objFile={objFile} imgFile={imgFile} />}
					<UploadButtonContainer centered={!objFile}>
						<UploadButton htmlFor='file-upload'>
							{uploadStep === 0 ? '파일 업로드' : uploadStep === 1 ? '스킨 파일 업로드' : uploadStep === 2 ? '스킨 파일 변경' : 'ERROR'}
						</UploadButton>
						<input id='file-upload' type='file' onChange={handleFileUpload} style={{ display: 'none' }} />
						{objFile && (
							<ResetButton htmlFor='file-reset' onClick={handleReset}>
								리셋
							</ResetButton>
						)}
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
	border-radius: 30px;
	width: 60%;
	height: 400px;
	margin-bottom: 30px;

	@media (max-width: 768px) {
		width: 80%;
		height: 300px;
	}
`;

const UploadButtonContainer = styled.div<{ centered: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: ${({ centered }) => (centered ? 'calc(50% - 24px)' : '20px')};

	@media (max-width: 768px) {
		margin-top: ${({ centered }) => (centered ? 'calc(50% - 24px)' : '10px')};
	}
`;

const UploadButton = styled.label`
	display: inline-block;
	padding: 12px 24px;
	background-color: #007bff;
	color: white;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;
`;

const ResetButton = styled.label`
	display: inline-block;
	padding: 12px 24px;
	background-color: #800020;
	color: white;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;
	margin-top: 10px;
`;

const Footer = styled.footer`
	font-size: 14px;
	position: fixed;
	bottom: 10px;
	text-align: center;
	width: 100%;
`;

export default App;
