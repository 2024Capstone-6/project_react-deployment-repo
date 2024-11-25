import React, { useState, MouseEvent } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './Modals';

interface MemberCardProps {
  onDelete: () => void;
  memberOwnerId: number;
  loggedInUserId: number;
}

const MemberCard: React.FC<MemberCardProps> = ({
  onDelete,
  memberOwnerId,
  loggedInUserId,
}) => {
  const [info, setInfo] = useState({
    name: '',
    role: '',
    comment: '',
    email: '',
  });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>(
    'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png'
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOwner = loggedInUserId === memberOwnerId;

  const mouseImageClick = (e: MouseEvent) => {
    if (!isOwner) return;
    e.preventDefault();
    setIsImageModalOpen(true);
  };

  const mouseInfoClick = (e: MouseEvent) => {
    if (!isOwner) return;
    e.preventDefault();
    setIsInfoModalOpen(true);
  };

  const mouseTechStackClick = (e: MouseEvent) => {
    if (!isOwner) return;
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

  const handleImageSave = async (selectedImage: File | null) => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.url); // 서버에서 반환된 URL 사용
        } else {
          console.error('Error uploading image');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }
    setIsImageModalOpen(false);
  };

  const mouseRightClick = (e: MouseEvent) => {
    if (!isOwner) return;
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
      onContextMenu={mouseRightClick}
    >
      <div
        onClick={mouseImageClick}
        className={`w-52 h-52 bg-cover bg-center rounded-lg shadow-md ${
          isOwner ? 'cursor-pointer' : ''
        }`}
        style={{ backgroundImage: `url("${profileImage}")` }}
      ></div>

      <MemberInfo info={info} onInfoClick={isOwner ? mouseInfoClick : undefined} />

      <div className="w-1/3">
        <TechStack
          techStack={techStack}
          onStackClick={isOwner ? mouseTechStackClick : undefined}
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
        onSaveImage={handleImageSave}
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