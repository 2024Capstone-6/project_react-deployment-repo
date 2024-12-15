import React, { MouseEvent } from 'react';

// MemberInfo 컴포넌트가 받을 props의 구조와 타입 정의
interface MemberInfoProps {
  info: { // 조원 정보를 담은 객체
    name: string; // 조원의 이름
    role: string; // 조원의 역할
    comment: string; // 조원의 코멘트
    email: string; // 조원의 이메일
  };
  // 클릭 시 정보 수정 모달 열림, MemberCard.tsx에서 정의함
  // <HTMLDivElement>: HTML<div> 요소에서 발생한 마우스 이벤트를 나타냄
  onInfoClick?: (e: MouseEvent<HTMLDivElement>) => void; // 클릭 이벤트 (선택적)
}

// MemberInfo 컴포넌트: 조원의 주요 정보를 표시하고 클릭 이벤트를 처리
const MemberInfo: React.FC<MemberInfoProps> = ({ info, onInfoClick }) => {
  return (
    <div
      className={`flex flex-col justify-center w-[24rem] h-44 p-5 rounded-lg shadow-md text-gray-900 bg-gray-100 ${
        // onInfoClick이 정의 되어있다면 cursor-pointer 반환, false라면 '' 반환
        // cursor-pointer: CSS 클래스, 커서를 포인터로 바꿔 클릭 가능하다는 것을 알림
        onInfoClick ? 'cursor-pointer' : ''
      }`}
      onClick={onInfoClick} // 클릭 이벤트 실행
    >
      <h2 className="text-md font-semibold">NAME: {info.name}</h2>
      <h2 className="text-sm">ROLE: {info.role}</h2>
      <p>COMMENT: {info.comment}</p>
      <p>EMAIL: {info.email}</p>
    </div>
  );
};

export default MemberInfo;