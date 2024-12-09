import React, { useState, useEffect, ChangeEvent } from 'react';

interface ModalsProps {
  isImageModalOpen: boolean; // 이미지 수정 모달의 상태 (열림/닫힘)
  isInfoModalOpen: boolean; // 정보 수정 모달의 상태 (열림/닫힘)
  isTechStackModalOpen: boolean; // 기술 스택 수정 모달의 상태 (열림/닫힘)
  info: { name: string; role: string; comment: string; email: string }; // 조원 정보
  techStack: string[]; // 기술 스택 배열
  toggleImageModal: () => void; // 이미지 모달을 열고 닫는 함수
  toggleInfoModal: () => void; // 정보 모달을 열고 닫는 함수
  toggleTechStackModal: () => void; // 기술 스택 모달을 열고 닫는 함수
  onSaveInfo: (updatedInfo: { name: string; role: string; comment: string; email: string }) => void; // 정보 저장 핸들러
  onSaveTechStack: (updatedStacks: string[]) => void; // 기술 스택 저장 핸들러
  onSaveImage: (selectedImage: File | null) => void; // 이미지 저장 핸들러
}

const Modals: React.FC<ModalsProps> = ({
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
  const [tempInfo, setTempInfo] = useState(info); // 정보 수정 모달에서 사용되는 임시 정보 상태
  const [selectedStacks, setSelectedStacks] = useState<string[]>(techStack); // 기술 스택 모달에서 사용되는 선택된 기술 스택 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지 상태

  useEffect(() => {
    // 모달이 열릴 때 상태 초기화
    if (isInfoModalOpen) setTempInfo(info); // 정보 수정 모달의 초기값 설정
    if (isTechStackModalOpen) setSelectedStacks([...techStack].sort()); // 기술 스택 정렬 후 설정
    if (isImageModalOpen) setSelectedImage(null); // 이미지 선택 상태 초기화
  }, [isInfoModalOpen, isTechStackModalOpen, isImageModalOpen, info, techStack]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 이미지 파일 선택 핸들러
    const file = e.target.files?.[0] || null; // 선택된 파일이 없으면 null
    setSelectedImage(file); // 선택된 파일 상태에 저장
  };

  const saveImage = () => {
    // 이미지 저장 로직
    if (selectedImage) {
      onSaveImage(selectedImage); // 부모 컴포넌트로 이미지 저장 핸들러 호출
    }
    toggleImageModal(); // 이미지 모달 닫기
  };

  const toggleStackSelection = (stack: string) => {
    // 기술 스택 선택/해제 로직
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack)); // 이미 선택된 경우 해제
    } else {
      setSelectedStacks([...selectedStacks, stack]); // 선택되지 않은 경우 추가
    }
  };

  const saveTechStack = () => {
    // 기술 스택 저장 로직
    const sortedStacks = [...selectedStacks].sort(); // 저장 전에 정렬
    onSaveTechStack(sortedStacks); // 부모 컴포넌트로 저장 핸들러 호출
    toggleTechStackModal(); // 기술 스택 모달 닫기
  };

  const drawModal = (
    isOpen: boolean,
    title: string,
    content: JSX.Element,
    saveFunction: () => void,
    closeFunction: () => void
  ) => {
    // 공통 모달 컴포넌트 렌더링 함수
    if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {content} {/* 모달 내용 렌더링 */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={closeFunction}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={saveFunction}
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
        isImageModalOpen,
        'Change Profile Image',
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // 이미지 변경 핸들러
            className="p-2 border rounded"
          />
        </div>,
        saveImage,
        toggleImageModal
      )}

      {/* 정보 수정 모달 */}
      {drawModal(
        isInfoModalOpen,
        'Edit Information',
        <form className="flex flex-col gap-4">
          <input
            type="text"
            value={tempInfo.name}
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
        () => onSaveInfo(tempInfo),
        toggleInfoModal
      )}

      {/* 기술 스택 수정 모달 */}
      {drawModal(
        isTechStackModalOpen,
        'Edit Tech Stack',
        <div className="grid grid-cols-3 gap-4">
          {availableTechStacks.map((stack) => (
            <button
              key={stack}
              onClick={() => toggleStackSelection(stack)} // 스택 선택/해제
              className={`relative w-12 h-12 flex items-center justify-center rounded-full border ${
                selectedStacks.includes(stack) ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <img
                src={`/images/Member/${stack}.png`} // 기술 스택 이미지 경로
                alt={stack} // 이미지 대체 텍스트
                className="w-full h-full object-cover rounded-full"
              />
              {selectedStacks.includes(stack) && (
                <span className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-75 text-white text-lg font-bold rounded-full">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>,
        saveTechStack,
        toggleTechStackModal
      )}
    </>
  );
};

export default Modals;