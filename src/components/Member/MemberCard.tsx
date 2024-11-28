import React, { useState } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './Modals';

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
    if (selectedImage) {
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      try {
        const response = await fetch(`http://localhost:3001/members/${memberData.id}`, {
          method: 'PATCH',
          body: formData,
        });

        if (response.ok) {
          const updatedMember = await response.json();
          onUpdate(updatedMember);
        } else {
          console.error('Error updating image');
        }
      } catch (err) {
        console.error('Error updating image:', err);
      }
    }
    setIsImageModalOpen(false);
  };

  const handleInfoSave = async (updatedInfo: Partial<Member>) => {
    try {
      const response = await fetch(`http://localhost:3001/members/${memberData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        onUpdate(updatedMember);
      } else {
        console.error('Error updating member info');
      }
    } catch (err) {
      console.error('Error updating member info:', err);
    }
    setIsInfoModalOpen(false);
  };

  const handleTechStackSave = (updatedStacks: string[]) => {
    handleInfoSave({ techStack: updatedStacks });
    setIsTechStackModalOpen(false);
  };

  return (
    <div
      className="relative flex items-center gap-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg"
      onContextMenu={(e) => {
        e.preventDefault();
        setIsDeleteModalOpen(true);
      }}
    >
      <div
        onClick={() => setIsImageModalOpen(true)}
        className="w-52 h-52 bg-cover bg-center rounded-lg shadow-md cursor-pointer"
        style={{
          backgroundImage: `url("${
            memberData.profileImage || 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png'
          }")`,
        }}
      ></div>

      <MemberInfo info={memberData} onInfoClick={() => setIsInfoModalOpen(true)} />

      <div className="w-1/3">
        <TechStack
          techStack={memberData.techStack}
          onStackClick={() => setIsTechStackModalOpen(true)}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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