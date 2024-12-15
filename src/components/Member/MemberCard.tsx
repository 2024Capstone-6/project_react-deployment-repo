import React, { useState } from 'react';
import MemberInfo from './MemberInfo';
import TechStack from './TechStack';
import Modals from './MemberModals';

// 멤버 객체의 타입을 정의한 인터페이스
// interface: 객체의 구조를 정의
interface Member {
  id: number; // 멤버의 고유 ID
  name: string; // 멤버 이름
  role: string; // 멤버 역할
  comment: string; // 멤버 코멘트
  email: string; // 멤버 이메일
  techStack: string[]; // 멤버 기술 스택, 문자열 배열
  profileImage: string | null; // 프로필 이미지, null 허용
}

// MemberCard 컴포넌트의 Props 타입 정의
interface MemberCardProps {
  memberData: Member; // 렌더링할 멤버의 데이터, Member.tsx로부터 전달받음
  onDelete: () => void; // 멤버 삭제 핸들러
  onUpdate: (updatedMember: Member) => void; // 멤버 데이터 업데이트 핸들러, 업데이트된 멤버 데이터
}

// 멤버 데이터를 표시하고 수정/삭제/추가 등의 작업을 처리하는 카드 컴포넌트
const MemberCard: React.FC<MemberCardProps> = ({ memberData, onDelete, onUpdate }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 수정 모달 상태
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 정보 수정 모달 상태
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false); // 기술 스택 수정 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태

  // 이미지 저장 핸들러
  // 선택된 이미지 파일을 서버에 업로드, 업데이트된 멤버 데이터를 부모 컴포넌트로 전달
  // selectedImage: 사용자가 업로드한 파일, null: 이미지가 선택되지 않음
  const handleImageSave = async (selectedImage: File | null) => {
    if (!selectedImage) return; // 선택된 이미지가 없으면 함수 종료
    // FormData: 브라우저에서 파일을 포함한 데이터를 서버로 전송할 때 사용하는 객체
    const formData = new FormData();
    // .append(key, value): key = 서버에서 참조할 이름, value = 사용자가 선택한 파일
    formData.append('profileImage', selectedImage); // FormData에 이미지 추가

    try {
      // fetch: HTTP 요청을 보내는 브라우저 API
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`, // 멤버 ID를 포함한 URL
        {
          method: 'PATCH', // PATCH 요청
          body: formData, // FormData 전송
        }
      );
      // 요청 성공 시
      if (response.ok) {
        // 서버에서 반환한 JSON 데이터를 자바스크립트 객체로 변환
        // Type: Member 타입
        const updatedMember = await response.json();
        onUpdate(updatedMember); // 업데이트된 멤버 데이터를 상위 컴포넌트로 전달
      } else { // 요청 실패 시
        console.error('Error updating image'); // 오류 로그 출력
      } 
    } catch (error) { // 에러 발생 시
      console.error('Error updating image:', error); // 네트워크 오류 로그 출력
    }
    setIsImageModalOpen(false); // 이미지 모달 닫기
  };

  // 정보 저장 핸들러
  // Partial<Member>: Member의 모든 속성을 선택적으로 바꿈
  // updatedInfo: 사용자가 수정한 정보만 포함
  const handleInfoSave = async (updatedInfo: Partial<Member>) => {
    try {
      // fetch 호출
      const response = await fetch(
        `http://localhost:3001/members/${memberData.id}`, // 멤버 ID를 포함한 URL
        {
          method: 'PATCH', // PATCH 요청
          headers: { 'Content-Type': 'application/json' }, // JSON 데이터 전송
          body: JSON.stringify(updatedInfo), // 업데이트할 데이터를 JSON 문자열로 변환
        }
      );
      // 요청 성공 시
      if (response.ok) {
        // 서버에서 반환된 멤버 데이터를 JSON으로 파싱
        const updatedMember = await response.json();
        onUpdate(updatedMember); // 업데이트된 멤버 데이터를 부모 컴포넌트로 전달
      } else { // 요청 실패 시
        console.error('Error updating info'); // 오류 로그 출력
      }
    } catch (error) { // 에러 발생 시
      console.error('Error updating info:', error); // 네트워크 오류 로그 출력
    }
    setIsInfoModalOpen(false); // 정보 수정 모달 닫기
  };

  // 기술 스택 저장 핸들러
  // updatedStacks: 사용자가 선택하거나 수정한 기술 스택의 배열, 문자열 배열
  const handleTechStackSave = async (updatedStacks: string[]) => {
    // 배열을 미리 정의된 순서에 맞게 정렬
    const sortedStacks = updatedStacks.sort(
      (a, b) =>
        // ['react', 'typescript', 'node', 'tailwind', 'docker']: 미리 정의된 배열 순서
        // 미리 정의된 순서에서 a. b가 어디에 위치하는지 비교
        // a가 b보다 작으면 앞, 크면 뒤
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(a) -
        ['react', 'typescript', 'node', 'tailwind', 'docker'].indexOf(b) // 기술 스택 정렬 기준
    );

    try {
      // fetch 호출
      const response = await fetch(`http://localhost:3001/members/${memberData.id}`, {
        method: 'PATCH', // PATCH 요청
        headers: { 'Content-Type': 'application/json' }, // JSON 데이터 전송
        body: JSON.stringify({ techStack: sortedStacks }), // 정렬된 기술 스택 배열을 JSON 문자열로 변환
      });
      // 요청 실패 시
      if (!response.ok) {
        // 에러 메시지 출력
        throw new Error('Failed to update tech stack');
      }
      // 서버에서 반환된 데이터를 JSON으로 파싱
      const updatedMember = await response.json();
      onUpdate(updatedMember); // 업데이트된 멤버 데이터를 부모 컴포넌트로 전달
    } catch (error) { // 에러 발생 시
      console.error('Error updating tech stack:', error); // 네트워크 오류 로그 출력
    }

    setIsTechStackModalOpen(false); // 기술 스택  수정 모달 닫기
  };

  // 삭제 모달 열기 핸들러
  // e: React.MouseEvent: onContextMenu 이벤트 핸들러에서 전달되는 이벤트 객체
  const openDeleteModal = (e: React.MouseEvent) => {
    // 브라우저의 우클릭 메뉴 방지
    e.preventDefault();
    setIsDeleteModalOpen(true); // 삭제 모달 열기
  };

  return (
    <div
      className="relative flex items-center gap-4 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg"
      // 우클릭 시 삭제 모달 열기
      // openDeleteModal에서 isDeleteModalOpend을 true로 변경
      onContextMenu={openDeleteModal}
    >
      {/* 프로필 이미지 */}
      <div
        className="w-52 h-52 bg-cover bg-center rounded-lg shadow-md cursor-pointer"
        style={{
          // 멤버의 프로필 이미지를 배경으로 설정, 프로필 이미지가 없으면 기본 이미지 URL 사용
          backgroundImage: `url("${memberData.profileImage || 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png'}")`,
        }}
        // 이미지를 클릭할 시 이미지 수정 모달 열림
        onClick={() => setIsImageModalOpen(true)}
      ></div>

      {/* 정보란 */}
      <MemberInfo
        // info: memberData 객체에서 이름, 역할, 코멘트, 이메일을 전달
        info={{
          name: memberData.name,
          role: memberData.role,
          comment: memberData.comment,
          email: memberData.email,
        }}
        // 클릭할 시 정보 수정 모달 열림
        // onInfoClick 프로퍼티 정의
        onInfoClick={() => setIsInfoModalOpen(true)}
      />

      {/* 기술 스택 */}
      <TechStack
        techStack={memberData.techStack} // 멤버의 기술 스택 배열 전달
        // 클릭할 시 기술 스택 수정 모달 열림
        onStackClick={() => setIsTechStackModalOpen(true)}
      />

      {/* 모달 컴포넌트 */}
      <Modals
        isImageModalOpen={isImageModalOpen} // Modals.tsx로 이미지 수정 모달의 상태 전달
        isInfoModalOpen={isInfoModalOpen} // 정보 수정 모달의 상태 전달
        isTechStackModalOpen={isTechStackModalOpen} // 기술 스택 수정 모달의 상태 전달
        info={{ // memberData 객체에서 각 멤버 정보를 추출해 전달
          name: memberData.name,
          role: memberData.role,
          comment: memberData.comment,
          email: memberData.email,
        }}
        techStack={memberData.techStack}
        // 이미지 수정 모달 상태 변경
        toggleImageModal={() => setIsImageModalOpen(!isImageModalOpen)}
        // 정보 수정 모달 상태값 변경
        toggleInfoModal={() => setIsInfoModalOpen(!isInfoModalOpen)}
        // 기술 스택 수정 모달 상태값 변경
        toggleTechStackModal={() => setIsTechStackModalOpen(!isTechStackModalOpen)}
        // onSaveImage: 이미지 저장 핸들러, Modals 컴포넌트에서 호출
        onSaveImage={handleImageSave}
        // onSaveInfo: 정보 수정 핸들러, Modals 컴포넌트에서 호출
        onSaveInfo={handleInfoSave}
        // onSaveTechStack: 기술 스택 수정 핸들러, Modals 컴포넌트에서 호출
        onSaveTechStack={handleTechStackSave}
      />

      {/* 삭제 모달 */}
      {isDeleteModalOpen && ( // isDeleteModalOpen이 true라면
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
                onClick={onDelete} // 삭제 버튼 클릭 시 Member.tsx에서 삭제 함수 실행
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