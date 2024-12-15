import React, { useState, useEffect, ChangeEvent } from 'react';

// Modals 컴포넌트가 받을 props의 구조와 타입 정의
interface ModalsProps {
  isImageModalOpen: boolean; // 이미지 수정 모달의 상태, MemberCard.tsx에서 전달
  isInfoModalOpen: boolean; // 정보 수정 모달의 상태
  isTechStackModalOpen: boolean; // 기술 스택 수정 모달의 상태
  info: { name: string; role: string; comment: string; email: string }; // 조원 정보, MemberCard.tsx에서 각 멤버 데이터 전달
  techStack: string[]; // 기술 스택 배열, MemberCard.tsx에서 전달
  toggleImageModal: () => void; // 이미지 모달 상태 변경, MemberCard.tsx에서 정의
  toggleInfoModal: () => void; // 정보 수정 모달 상태 변경
  toggleTechStackModal: () => void; // 기술 스택 수정 모달 상태 변경
  // 저장 핸들러, 수정된 정보를 부모 컴포넌트로 전달
  onSaveInfo: (updatedInfo: { name: string; role: string; comment: string; email: string }) => void; // 정보 저장 핸들러
  onSaveTechStack: (updatedStacks: string[]) => void; // 기술 스택 저장 핸들러
  onSaveImage: (selectedImage: File | null) => void; // 이미지 저장 핸들러
}

const MemberModals: React.FC<ModalsProps> = ({
  isImageModalOpen,
  isInfoModalOpen,
  isTechStackModalOpen,
  info,
  techStack,
  toggleImageModal,
  toggleInfoModal,
  toggleTechStackModal,
  onSaveInfo,
  onSaveTechStack,
  onSaveImage,
}) => {
  const availableTechStacks = ['react', 'typescript', 'node', 'tailwind', 'docker']; // 선택 가능한 기술 스택 리스트
  const [tempInfo, setTempInfo] = useState(info); // 정보 수정 모달에서 사용되는 임시 정보 상태, 기존 값
  const [selectedStacks, setSelectedStacks] = useState<string[]>(techStack); // 기술 스택 모달에서 사용되는 선택된 기술 스택 상태, 기존 값
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지 상태, 기존값, 초기값 null

  useEffect(() => {
    if (isInfoModalOpen) setTempInfo(info); // 정보 수정 모달이 열리면 기존 값 설정
    if (isTechStackModalOpen) setSelectedStacks([...techStack].sort()); // 기존 기술 스택 값 정렬 후 설정
    if (isImageModalOpen) setSelectedImage(null); // 이미지 선택 상태 초기화
  }, // 모달이 열릴 때 상태 초기화
  [isInfoModalOpen, isTechStackModalOpen, isImageModalOpen, info, techStack]);

  // 이미지 파일 선택 핸들러
  // (e: ChangeEvent<HTMLInputElement>): HTML <input> 요소에서 발생한 변경 이벤트
  // 이미지 파일이 선택되었을 때 호출
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // e.target.files: 사용자가 선택한 파일
    // ?.(Optional Chaining): 파일을 선택하지 않은 상태일 때, 에러를 발생시키지 않고 null 반환
    // file: File 객체 저장, {name, lastModified, size, type}
    const file = e.target.files?.[0] || null;
    setSelectedImage(file); // 선택한 파일을 상태에 저장
  };

  // 이미지 저장 로직
  const saveImage = () => {
    // selectedImage가 null이 아니면
    if (selectedImage) {
      // MemberCard.tsx의 handleImageSave를 전달받아 이미지 저장 작업 수행
      onSaveImage(selectedImage);
    }
    toggleImageModal(); // 이미지 모달 닫기
  };

  // 기술 스택 선택/해제 로직
  // stack: 사용자가 클릭한 기술 스택의 이름
  const toggleStackSelection = (stack: string) => {
    // 선택된 스택 목록(selectedStacks)에 클릭한 스택이 포함되어 있는 지 확인
    if (selectedStacks.includes(stack)) {
      // 이미 선택된 경우
      // 선택된 목록에서 해당 스택을 제거
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else { // 선택되지 않은 경우
      // 선택된 목록에 해당 스택 추가
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  // 기술 스택 저장 로직
  const saveTechStack = () => {
    // 기존 기술 스택 정렬
    const sortedStacks = [...selectedStacks].sort();
    // MemberCard.tsx의 handleTechStackSave를 전달받아 기술 스택 저장 작업 수행
    onSaveTechStack(sortedStacks);
    toggleTechStackModal(); // 기술 스택 모달 닫기
  };

  // 각 모달의 공통적인 구조를 렌더링하기 위한 함수
  const drawModal = (
    isOpen: boolean, // 모달의 열림/닫힘 상태
    title: string, // 모달 상단의 제목
    content: JSX.Element, // 모달 내부에 표시될 내용
    saveFunction: () => void, // 저장 버튼 클릭 시 호출되는 함수
    closeFunction: () => void // 취소 버튼 클릭 시 호출되는 함수
  ) => {
    // 모달이 true일 때만 모달을 렌더링
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {content} {/* 모달 내용 렌더링 */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closeFunction} // 취소 버튼 클릭 시 실행
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={saveFunction} // 저장 버튼 클릭 시 실행
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 이미지 수정 모달 */}
      {drawModal(
        // isImageModalOpen: MemberCard.tsx에서 setIsImageModalOpen(true)로 열림 상태가 설정된 후 전달
        isImageModalOpen,
        'Change Profile Image', // 모달 제목, h2 태그로 렌더링
        // 모달 내용
        <div className="flex flex-col items-center gap-4">
          {/* 파일 업로드 필드 */}
          <input
            type="file"
            accept="image/*" // 파일의 형식을 이미지로 제한
            onChange={handleImageChange} // 선택한 파일을 selectedImage 상태에 저장
            className="p-2 border rounded"
          />
        </div>,
        // 선택한 파일(selectedImage)을 부모 컨포넌트로 전달 후 모달 닫기
        saveImage,
        // 모달 닫기
        toggleImageModal
      )}

      {/* 정보 수정 모달 */}
      {drawModal(
        // isInfoModalOpen이 true일 때 정보 수정 모달이 렌더링
        isInfoModalOpen,
        // 모달 제목
        'Edit Information',
        // 모달 내용
        <form className="flex flex-col gap-4">
          <input
            type="text"
            // 입력 필드의 초기 값
            value={tempInfo.name}
            // 입력 내용이 변경될 때마다 tempInfo 상태 업데이트
            onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })}
            placeholder="Name"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={tempInfo.role}
            onChange={(e) => setTempInfo({ ...tempInfo, role: e.target.value })}
            placeholder="Role"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={tempInfo.comment}
            onChange={(e) => setTempInfo({ ...tempInfo, comment: e.target.value })}
            placeholder="Comment"
            className="p-2 border rounded"
          />
          <input
            type="email"
            value={tempInfo.email}
            onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })}
            placeholder="Email"
            className="p-2 border rounded"
          />
        </form>,
        // tempInfo 객체를 부모 컴포넌트에 전달
        () => onSaveInfo(tempInfo),
        // 모달 닫기
        toggleInfoModal
      )}

      {/* 기술 스택 수정 모달 */}
      {drawModal(
        // isTechStackModalOpen이 true일 때 기술 스택 수정 모달이 렌더링
        isTechStackModalOpen,
        // 모달 제목
        'Edit Tech Stack',
        // 모달 내용
        <div className="grid grid-cols-3 gap-4">
          {/* availableTechStacks: 기술 스택의 전체 리스트 */}
          {availableTechStacks.map((stack) => (
            // 기술 스택 버튼
            <button
              key={stack} // 고유값으로 스택 이름 사용
              onClick={() => toggleStackSelection(stack)} // 클릭 시 기술 스택 선택/해제 로직 실행
              className={`relative w-12 h-12 flex items-center justify-center rounded-full border ${
                // selectedStacks: 사용자가 선택한 기술 스택
                //  includes(): 배열의 항목에 특정 값이 포함되어 있는지를 판단
                selectedStacks.includes(stack) ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <img
                src={`/images/Member/${stack}.png`} // 기술 스택 이미지 경로
                alt={stack} // 이미지 대체 텍스트
                className="w-full h-full object-cover rounded-full"
              />
              {/* selectedStacks에 stack이 있다면 */}
              {selectedStacks.includes(stack) && (
                // 체크 표시
                <span className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-75 text-white text-lg font-bold rounded-full">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>,
        // 기술 스택 저장 로직
        saveTechStack,
        // 모달 닫기
        toggleTechStackModal
      )}
    </>
  );
};

export default MemberModals;