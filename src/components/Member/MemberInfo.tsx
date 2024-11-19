import React, { MouseEvent } from 'react';

interface MemberInfoProps {
  info: {
    name: string; // 조원의 이름 (string)
    role: string; // 조원의 역할 (string)
    comment: string; // 조원의 코멘트 (string)
    email: string; // 조원의 이메일 (string)
  };
  onInfoClick: (e: MouseEvent<HTMLDivElement>) => void; // 클릭 시 실행되는 함수, 부모 컴포넌트인 MemberCard에서 전달받음
}

// MemberInfo 컴포넌트는 조원의 이름, 역할, 코멘트, 이메일을 표시하고, 클릭 시 정보 수정 모달을 여는 역할을 합니다.
// 이 컴포넌트는 특정 조원의 정보를 표시하고, 클릭 시 추가 액션을 발생시키기 위해 필요한 컴포넌트입니다.
const MemberInfo: React.FC<MemberInfoProps> = ({ info, onInfoClick }) => {
  return (
    <div
      className="flex flex-col justify-center w-[24rem] h-44 p-5 rounded-lg shadow-md text-gray-900 bg-gray-100 cursor-pointer"
      onClick={onInfoClick} // MemberCard에서 전달받은 onInfoClick 함수 실행
      // onInfoClick 함수가 클릭 시 실행되며, 상위 MemberCard 컴포넌트에서 이 함수를 통해 정보 수정 모달을 엽니다.
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