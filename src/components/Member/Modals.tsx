import React, { useState, useEffect, ChangeEvent } from 'react';

interface ModalsProps {
  isImageModalOpen: boolean; // 이미지 모달 열림 여부
  isInfoModalOpen: boolean; // 정보 수정 모달 열림 여부
  isTechStackModalOpen: boolean; // 기술 스택 수정 모달 열림 여부
  info: { name: string; role: string; comment: string; email: string }; // 멤버 정보
  techStack: string[]; // 기술 스택 배열
  toggleImageModal: () => void; // 이미지 모달 토글 함수
  toggleInfoModal: () => void; // 정보 수정 모달 토글 함수
  toggleTechStackModal: () => void; // 기술 스택 수정 모달 토글 함수
  onSaveInfo: (updatedInfo: { name: string; role: string; comment: string; email: string }) => void; // 정보 저장 함수
  onSaveTechStack: (updatedStacks: string[]) => void; // 기술 스택 저장 함수
  onSaveImage: (selectedImage: File | null) => void; // 이미지 저장 함수
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
  const availableTechStacks = ['react', 'typescript', 'node', 'tailwind', 'docker']; // 선택 가능한 기술 스택
  const [tempInfo, setTempInfo] = useState(info); // 임시 정보 상태
  const [selectedStacks, setSelectedStacks] = useState<string[]>(techStack); // 선택된 기술 스택
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지 파일

  // 모달 열릴 때 상태 초기화
  useEffect(() => {
    if (isInfoModalOpen) setTempInfo(info);
    if (isTechStackModalOpen) setSelectedStacks(techStack);
    if (isImageModalOpen) setSelectedImage(null);
  }, [isInfoModalOpen, isTechStackModalOpen, isImageModalOpen, info, techStack]);

  // 이미지 선택 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  // 기술 스택 선택/해제 토글
  const toggleStackSelection = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  // 모달 렌더링 함수
  const drawModal = (
    isOpen: boolean,
    title: string,
    content: JSX.Element,
    saveFunction: () => void,
    closeFunction: () => void
  ) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {content}
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
      {/* 이미지 변경 모달 */}
      {drawModal(
        isImageModalOpen,
        'Change Profile Image',
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded"
          />
        </div>,
        () => {
          onSaveImage(selectedImage);
          toggleImageModal();
        },
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
              onClick={() => toggleStackSelection(stack)}
              className={`relative w-12 h-12 flex items-center justify-center rounded-full border ${
                selectedStacks.includes(stack) ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <img
                src={`/images/Member/${stack}.png`}
                alt={stack}
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
        () => onSaveTechStack(selectedStacks),
        toggleTechStackModal
      )}
    </>
  );
};

export default Modals;