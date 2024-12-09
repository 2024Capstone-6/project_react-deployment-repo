import React, { MouseEvent } from 'react';

interface MemberInfoProps {
  info: {
    name: string; // 조원의 이름
    role: string; // 조원의 역할
    comment: string; // 조원의 코멘트
    email: string; // 조원의 이메일
  };
  onInfoClick?: (e: MouseEvent<HTMLDivElement>) => void; // 클릭 이벤트 (선택적)
}

// MemberInfo 컴포넌트: 조원의 주요 정보를 표시하고 클릭 이벤트를 처리
const MemberInfo: React.FC<MemberInfoProps> = ({ info, onInfoClick }) => {
  return (
    <div
      className={`flex flex-col justify-center w-[24rem] h-44 p-5 rounded-lg shadow-md text-gray-900 bg-gray-100 ${
        onInfoClick ? 'cursor-pointer' : ''
      }`}
      onClick={onInfoClick} // 클릭 이벤트 실행
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