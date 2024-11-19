import React, { useState, MouseEvent } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './Modals';

interface MemberCardProps {
  onDelete: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ onDelete }) => {
  const [info, setInfo] = useState({ name: '', role: '', comment: '', email: '' });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleImageClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsImageModalOpen(true);
  };

  const handleInfoClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsInfoModalOpen(true);
  };

  const handleTechStackClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsTechStackModalOpen(true);
  };

  const handleInfoSave = (updatedInfo: typeof info) => {
    setInfo(updatedInfo);
    setIsInfoModalOpen(false);
  };

  const handleTechStackSave = (updatedStacks: string[]) => {
    setTechStack(updatedStacks);
    setIsTechStackModalOpen(false);
  };

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div
      className="relative flex items-center gap-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg"
      onContextMenu={handleRightClick}
    >
      <div
        onClick={handleImageClick}
        onContextMenu={(e) => e.preventDefault()}
        className="w-52 h-52 bg-cover bg-center rounded-lg shadow-md cursor-pointer"
        style={{ backgroundImage: `url("https://picsum.photos/250")` }}
      ></div>

      <MemberInfo info={info} onInfoClick={handleInfoClick} />

      <div className="w-1/3">
        <TechStack
          techStack={techStack}
          onStackClick={handleTechStackClick}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      <Modals
        isImageModalOpen={isImageModalOpen}
        isInfoModalOpen={isInfoModalOpen}
        isTechStackModalOpen={isTechStackModalOpen}
        info={info}
        techStack={techStack}
        toggleImageModal={() => setIsImageModalOpen(!isImageModalOpen)}
        toggleInfoModal={() => setIsInfoModalOpen(!isInfoModalOpen)}
        toggleTechStackModal={() => setIsTechStackModalOpen(!isTechStackModalOpen)}
        onSaveInfo={handleInfoSave}
        onSaveTechStack={handleTechStackSave}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
            <h2 className="text-xl font-semibold mb-4">정말 삭제하시겠습니까?</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCard;