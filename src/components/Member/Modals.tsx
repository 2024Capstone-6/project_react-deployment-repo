import React, { useState } from 'react';

interface ModalsProps {
  isImageModalOpen: boolean; // 이미지 모달 열림 여부, MemberCard에서 전달됨
  isInfoModalOpen: boolean; // 정보 수정 모달 열림 여부, MemberCard에서 전달됨
  isTechStackModalOpen: boolean; // 기술 스택 모달 열림 여부, MemberCard에서 전달됨
  info: {
    name: string; // 조원의 이름, MemberCard에서 전달됨
    role: string; // 조원의 역할, MemberCard에서 전달됨
    comment: string; // 조원의 코멘트, MemberCard에서 전달됨
    email: string; // 조원의 이메일, MemberCard에서 전달됨
  };
  techStack: string[]; // 선택된 기술 스택 배열, MemberCard에서 전달됨
  toggleImageModal: () => void; // 이미지 모달 열기/닫기 함수, MemberCard에서 전달됨
  toggleInfoModal: () => void; // 정보 수정 모달 열기/닫기 함수, MemberCard에서 전달됨
  toggleTechStackModal: () => void; // 기술 스택 모달 열기/닫기 함수, MemberCard에서 전달됨
  onSaveInfo: (updatedInfo: { name: string; role: string; comment: string; email: string }) => void; // 정보 저장 함수, MemberCard에서 전달됨
  onSaveTechStack: (updatedStacks: string[]) => void; // 기술 스택 저장 함수, MemberCard에서 전달됨
}

// Modals 컴포넌트: 조원의 이미지, 정보, 기술 스택을 수정할 수 있는 모달을 관리합니다.
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
}) => {
  const availableTechStacks = ['react', 'typescript', 'node', 'tailwind', 'docker']; // 추가 가능한 기술 스택 목록
  const [tempInfo, setTempInfo] = useState(info); // 입력된 정보를 임시 저장하는 상태
  const [selectedStacks, setSelectedStacks] = useState<string[]>(techStack); // 선택된 기술 스택 상태

  // 기술 스택 선택/해제 함수
  const toggleStackSelection = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack)); // 선택 해제 시 목록에서 제거
    } else {
      setSelectedStacks([...selectedStacks, stack]); // 선택 추가 시 목록에 추가
    }
  };

  // 정보 저장 함수, 입력된 정보를 부모 컴포넌트로 전달하여 저장
  const handleInfoSave = () => {
    onSaveInfo(tempInfo); // 부모 컴포넌트에서 전달받은 onSaveInfo 함수 실행
    toggleInfoModal(); // 정보 수정 후 모달 닫기
  };

  // 선택된 기술 스택 저장 함수, 부모 컴포넌트로 선택한 스택을 전달
  const handleTechStackSave = () => {
    onSaveTechStack(selectedStacks); // 부모 컴포넌트에서 전달받은 onSaveTechStack 함수 실행
    toggleTechStackModal(); // 기술 스택 모달 닫기
  };

  return (
    <>
      {/* 이미지 모달 */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
            <h2 className="text-xl font-semibold mb-4">Change Profile Image</h2>
            <div className="flex flex-col items-center gap-4">
              <img src="https://picsum.photos/250" alt="Current profile" className="w-32 h-32 rounded-lg shadow-md" />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={toggleImageModal} // 이미지 변경 후 모달 닫기
              >
                Change Image
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleImageModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정보 수정 모달 */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Information</h2>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                defaultValue={tempInfo.name}
                onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })} // 이름 수정, 임시 정보 상태 업데이트
                placeholder="Name"
                className="p-2 border rounded"
              />
              <input
                type="text"
                defaultValue={tempInfo.role}
                onChange={(e) => setTempInfo({ ...tempInfo, role: e.target.value })} // 역할 수정, 임시 정보 상태 업데이트
                placeholder="Role"
                className="p-2 border rounded"
              />
              <input
                type="text"
                defaultValue={tempInfo.comment}
                onChange={(e) => setTempInfo({ ...tempInfo, comment: e.target.value })} // 코멘트 수정, 임시 정보 상태 업데이트
                placeholder="Comment"
                className="p-2 border rounded"
              />
              <input
                type="email"
                defaultValue={tempInfo.email}
                onChange={(e) => setTempInfo({ ...tempInfo, email: e.target.value })} // 이메일 수정, 임시 정보 상태 업데이트
                placeholder="Email"
                className="p-2 border rounded"
              />
            </form>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={toggleInfoModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleInfoSave} // 임시 상태에 저장된 정보를 부모 컴포넌트에 전달 후 모달 닫기
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 기술 스택 추가 모달 */}
      {isTechStackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/2">
            <h2 className="text-xl font-semibold mb-4">Add Tech Stack</h2>
            <div className="grid grid-cols-3 gap-4">
              {availableTechStacks.map((stack) => (
                <button
                  key={stack}
                  onClick={() => toggleStackSelection(stack)} // 스택 클릭 시 선택/해제
                  className={`relative w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 ${
                    selectedStacks.includes(stack) ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <img src={`/images/${stack}.png`} alt={stack} className="w-full h-full object-contain" />
                  {selectedStacks.includes(stack) && (
                    <span className="absolute inset-0 bg-blue-500 bg-opacity-75 flex items-center justify-center text-white text-lg font-bold rounded-full">
                      ✔
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={toggleTechStackModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleTechStackSave} // 선택된 기술 스택을 부모 컴포넌트에 저장 후 모달 닫기
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;