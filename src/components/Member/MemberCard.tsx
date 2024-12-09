import React, { useState } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './MemberModals';

interface Member {
  id: number;
  name: string;
  role: string;
  comment: string;
  email: string;
  techStack: string[];
  profileImage: string | null;
}

interface MemberCardProps {
  memberData: Member;
  onDelete: () => void;
  onUpdate: (updatedMember: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ memberData, onDelete, onUpdate }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleImageSave = async (selectedImage: File | null) => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    try {
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );
      if (response.ok) {
        const updatedMember = await response.json();
        onUpdate(updatedMember);
      } else {
        console.error('Error updating image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
    }
    setIsImageModalOpen(false);
  };

  const handleInfoSave = async (updatedInfo: Partial<Member>) => {
    try {
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInfo),
        }
      );
      if (response.ok) {
        const updatedMember = await response.json();
        onUpdate(updatedMember);
      } else {
        console.error('Error updating info');
      }
    } catch (error) {
      console.error('Error updating info:', error);
    }
    setIsInfoModalOpen(false);
  };

  const handleTechStackSave = (updatedStacks: string[]) => {
    const sortedStacks = updatedStacks.sort(
      (a, b) =>
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(a) -
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(b)
    );
    onUpdate({ ...memberData, techStack: sortedStacks });
    setIsTechStackModalOpen(false);
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    setIsDeleteModalOpen(true); // 삭제 모달 열기
  };

  return (
    <div
      className="relative flex items-center gap-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg"
      onContextMenu={openDeleteModal} // 우클릭 시 삭제 모달 열기
    >
      <div
        className="w-52 h-52 bg-cover bg-center rounded-lg shadow-md cursor-pointer"
        style={{
          backgroundImage: `url("${memberData.profileImage || 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png'}")`,
        }}
        onClick={() => setIsImageModalOpen(true)}
      ></div>

      <MemberInfo
        info={{
          name: memberData.name,
          role: memberData.role,
          comment: memberData.comment,
          email: memberData.email,
        }}
        onInfoClick={() => setIsInfoModalOpen(true)}
      />

      <TechStack
        techStack={memberData.techStack}
        onStackClick={() => setIsTechStackModalOpen(true)}
      />

      <Modals
        isImageModalOpen={isImageModalOpen}
        isInfoModalOpen={isInfoModalOpen}
        isTechStackModalOpen={isTechStackModalOpen}
        info={{
          name: memberData.name,
          role: memberData.role,
          comment: memberData.comment,
          email: memberData.email,
        }}
        techStack={memberData.techStack}
        toggleImageModal={() => setIsImageModalOpen(!isImageModalOpen)}
        toggleInfoModal={() => setIsInfoModalOpen(!isInfoModalOpen)}
        toggleTechStackModal={() => setIsTechStackModalOpen(!isTechStackModalOpen)}
        onSaveImage={handleImageSave}
        onSaveInfo={handleInfoSave}
        onSaveTechStack={handleTechStackSave}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
            <h2 className="text-xl font-semibold mb-4">정말 삭제하시겠습니까?</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
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