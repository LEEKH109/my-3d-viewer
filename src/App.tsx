import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from './components/ModelViewer';

const App: React.FC = () => {
	const [fileUploaded, setFileUploaded] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const fileType = file.type;
			const fileName = file.name;
			const fileExtension = fileName.split('.').pop()?.toLowerCase();

			// 허용되는 파일 종류를 제한합니다.
			const allowedFileTypes = ['model/obj'];
			const allowedFileExtensions = ['obj'];

			if (!allowedFileTypes.includes(fileType) && (!fileExtension || !allowedFileExtensions.includes(fileExtension))) {
				alert('허용되지 않은 파일 형식입니다. 다른 파일을 선택하세요.');
				return;
			}

			setFileUploaded(true);
			setUploadedFile(file);

			// 파일 업로드 처리를 수행하세요.
			setTimeout(() => {
				setLoading(true);
			}, 100);
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
				{!fileUploaded && (
					<>
						<UploadButton htmlFor='file-upload'>파일 업로드</UploadButton>
						<input id='file-upload' type='file' onChange={handleFileUpload} style={{ display: 'none' }} />
					</>
				)}
				{fileUploaded && !loading && <div>로딩 SVG...</div>}
				{fileUploaded && loading && uploadedFile && <ModelViewer file={uploadedFile} />}
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
