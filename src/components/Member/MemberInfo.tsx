import React, { MouseEvent } from 'react';

interface MemberInfoProps {
  info: {
    name: string; // 조원의 이름 (string)
    role: string; // 조원의 역할 (string)
    comment: string; // 조원의 코멘트 (string)
    email: string; // 조원의 이메일 (string)
  };
  onInfoClick?: (e: MouseEvent<HTMLDivElement>) => void; // 클릭 이벤트 선택적 적용
}

// MemberInfo 컴포넌트는 조원의 이름, 역할, 코멘트, 이메일을 표시하고, 클릭 시 정보 수정 모달을 여는 역할을 합니다.
const MemberInfo: React.FC<MemberInfoProps> = ({ info, onInfoClick }) => {
  return (
    <div
      className={`flex flex-col justify-center w-[24rem] h-44 p-5 rounded-lg shadow-md text-gray-900 bg-gray-100 ${
        onInfoClick ? 'cursor-pointer' : ''
      }`} // 클릭 가능 여부에 따라 커서 스타일 변경
      onClick={onInfoClick} // MemberCard에서 전달받은 onInfoClick 함수 실행
      onContextMenu={(e) => e.preventDefault()} // 우클릭 방지
    >
      <h2 className="text-md font-semibold">NAME: {info.name}</h2>
      <h2 className="text-sm">ROLE: {info.role}</h2>
      <p>COMMENT: {info.comment}</p>
      <p>EMAIL: {info.email}</p>
    </div>
  );
};

export default MemberInfo;