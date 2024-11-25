import React, { useState, useEffect, ChangeEvent } from 'react';

interface ModalsProps {
  isImageModalOpen: boolean;
  isInfoModalOpen: boolean;
  isTechStackModalOpen: boolean;
  info: { name: string; role: string; comment: string; email: string };
  techStack: string[];
  toggleImageModal: () => void;
  toggleInfoModal: () => void;
  toggleTechStackModal: () => void;
  onSaveInfo: (updatedInfo: { name: string; role: string; comment: string; email: string }) => void;
  onSaveTechStack: (updatedStacks: string[]) => void;
  onSaveImage: (imageUrl: string) => void; // 파일 업로드 시 URL 저장
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
  const availableTechStacks = ['react', 'typescript', 'node', 'tailwind', 'docker'];
  const [tempInfo, setTempInfo] = useState(info);
  const [selectedStacks, setSelectedStacks] = useState<string[]>(techStack);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Initialize states when modals open
  useEffect(() => {
    if (isInfoModalOpen) setTempInfo(info);
    if (isTechStackModalOpen) setSelectedStacks(techStack);
    if (isImageModalOpen) setSelectedImage(null);
  }, [isInfoModalOpen, isTechStackModalOpen, isImageModalOpen, info, techStack]);

  // File change handler
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  // File upload handler
  const uploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to upload image');
        return;
      }

      const data = await response.json();
      onSaveImage(data.imageUrl); // 서버에서 받은 이미지 URL 저장
      toggleImageModal(); // 모달 닫기
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Toggle selection for tech stacks
  const toggleStackSelection = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  // Draw modal
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
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Image Upload Modal */}
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
        uploadImage, // 이미지 업로드 실행
        toggleImageModal
      )}

      {/* Information Edit Modal */}
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

      {/* Tech Stack Modal */}
      {drawModal(
        isTechStackModalOpen,
        'Add Tech Stack',
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
                src={`/images/Member/${stack}.png`} // 이미지 경로
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