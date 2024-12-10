import React, { useState } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './MemberModals';

// 멤버 데이터 타입 정의
interface Member {
  id: number; // 멤버의 고유 ID
  name: string; // 멤버의 이름
  role: string; // 멤버의 역할
  comment: string; // 멤버의 코멘트
  email: string; // 멤버의 이메일
  techStack: string[]; // 멤버의 기술 스택 배열
  profileImage: string | null; // 멤버의 프로필 이미지 URL (없을 경우 null)
}

// MemberCard 컴포넌트의 Props 타입 정의
interface MemberCardProps {
  memberData: Member; // 렌더링할 멤버의 데이터
  onDelete: () => void; // 멤버 삭제 핸들러
  onUpdate: (updatedMember: Member) => void; // 멤버 정보 업데이트 핸들러
}

// MemberCard 컴포넌트 정의
const MemberCard: React.FC<MemberCardProps> = ({ memberData, onDelete, onUpdate }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 수정 모달 상태
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 정보 수정 모달 상태
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false); // 기술 스택 수정 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태

  // 이미지 저장 핸들러
  const handleImageSave = async (selectedImage: File | null) => {
    if (!selectedImage) return; // 선택된 이미지가 없으면 함수 종료
    const formData = new FormData();
    formData.append('profileImage', selectedImage); // FormData에 이미지 추가

    try {
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`, // 멤버 ID를 포함한 URL
        {
          method: 'PATCH', // PATCH 요청
          body: formData, // FormData 전송
        }
      );
      if (response.ok) {
        const updatedMember = await response.json(); // 응답 데이터를 JSON으로 파싱
        onUpdate(updatedMember); // 업데이트된 멤버 데이터를 상위 컴포넌트로 전달
      } else {
        console.error('Error updating image'); // 오류 로그 출력
      }
    } catch (error) {
      console.error('Error updating image:', error); // 네트워크 오류 로그 출력
    }
    setIsImageModalOpen(false); // 이미지 모달 닫기
  };

  // 정보 저장 핸들러
  const handleInfoSave = async (updatedInfo: Partial<Member>) => {
    try {
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`, // 멤버 ID를 포함한 URL
        {
          method: 'PATCH', // PATCH 요청
          headers: { 'Content-Type': 'application/json' }, // JSON 요청 헤더 설정
          body: JSON.stringify(updatedInfo), // 업데이트할 정보를 JSON 문자열로 변환
        }
      );
      if (response.ok) {
        const updatedMember = await response.json(); // 응답 데이터를 JSON으로 파싱
        onUpdate(updatedMember); // 업데이트된 멤버 데이터를 상위 컴포넌트로 전달
      } else {
        console.error('Error updating info'); // 오류 로그 출력
      }
    } catch (error) {
      console.error('Error updating info:', error); // 네트워크 오류 로그 출력
    }
    setIsInfoModalOpen(false); // 정보 수정 모달 닫기
  };

  // 기술 스택 저장 핸들러
  const handleTechStackSave = async (updatedStacks: string[]) => {
    const sortedStacks = updatedStacks.sort(
      (a, b) =>
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(a) -
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(b) // 기술 스택 정렬 기준
    );

    try {
      const response = await fetch(`http://localhost:3001/members/${memberData.id}`, {
        method: 'PATCH', // PATCH 요청
        headers: { 'Content-Type': 'application/json' }, // JSON 요청 헤더 설정
        body: JSON.stringify({ techStack: sortedStacks }), // 기술 스택 데이터 전송
      });

      if (!response.ok) {
        throw new Error('Failed to update tech stack'); // 요청 실패 시 예외 발생
      }

      const updatedMember = await response.json(); // 응답 데이터를 JSON으로 파싱
      onUpdate(updatedMember); // 업데이트된 멤버 데이터를 상위 컴포넌트로 전달
    } catch (error) {
      console.error('Error updating tech stack:', error); // 네트워크 오류 로그 출력
    }

    setIsTechStackModalOpen(false); // 기술 스택 모달 닫기
  };

  // 삭제 모달 열기 핸들러
  const openDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    setIsDeleteModalOpen(true); // 삭제 모달 열기
  };

  return (
    <div
      className="relative flex items-center gap-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg"
      onContextMenu={openDeleteModal} // 우클릭 시 삭제 모달 열기
    >
      {/* 프로필 이미지 영역 */}
      <div
        className="w-52 h-52 bg-cover bg-center rounded-lg shadow-md cursor-pointer"
        style={{
          backgroundImage: `url("${memberData.profileImage || 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png'}")`,
        }}
        onClick={() => setIsImageModalOpen(true)} // 클릭 시 이미지 수정 모달 열기
      ></div>

      {/* 멤버 정보 */}
      <MemberInfo
        info={{
          name: memberData.name,
          role: memberData.role,
          comment: memberData.comment,
          email: memberData.email,
        }}
        onInfoClick={() => setIsInfoModalOpen(true)} // 클릭 시 정보 수정 모달 열기
      />

      {/* 기술 스택 */}
      <TechStack
        techStack={memberData.techStack} // 기술 스택 데이터 전달
        onStackClick={() => setIsTechStackModalOpen(true)} // 클릭 시 기술 스택 수정 모달 열기
      />

      {/* 모달 컴포넌트 */}
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
        toggleImageModal={() => setIsImageModalOpen(!isImageModalOpen)} // 이미지 모달 토글
        toggleInfoModal={() => setIsInfoModalOpen(!isInfoModalOpen)} // 정보 모달 토글
        toggleTechStackModal={() => setIsTechStackModalOpen(!isTechStackModalOpen)} // 기술 스택 모달 토글
        onSaveImage={handleImageSave} // 이미지 저장 핸들러
        onSaveInfo={handleInfoSave} // 정보 저장 핸들러
        onSaveTechStack={handleTechStackSave} // 기술 스택 저장 핸들러
      />

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black w-1/3">
            <h2 className="text-xl font-semibold mb-4">정말 삭제하시겠습니까?</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)} // 취소 버튼 클릭 시 삭제 모달 닫기
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={onDelete} // 삭제 버튼 클릭 시 삭제 핸들러 실행
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