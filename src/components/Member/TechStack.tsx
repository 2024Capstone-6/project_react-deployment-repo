import React, { MouseEvent } from 'react';

interface TechStackProps {
  techStack: string[]; // 조원이 추가한 기술 스택 목록 (string 배열), 부모 컴포넌트인 MemberCard에서 전달받음
  onStackClick: (e: MouseEvent<HTMLDivElement>) => void; // 클릭 시 모달을 여는 함수, 부모 컴포넌트인 MemberCard에서 전달받음
  onContextMenu: (e: MouseEvent<HTMLDivElement>) => void; // 우클릭 방지용 함수, MemberCard에서 전달받음
}

// TechStack 컴포넌트는 조원의 기술 스택을 보여주며 클릭 시 추가/수정을 위한 모달을 엽니다.
const TechStack: React.FC<TechStackProps> = ({ techStack, onStackClick, onContextMenu }) => {
  return (
    <div
      className="flex flex-wrap gap-3 w-[28rem] h-44 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-md cursor-pointer"
      onClick={onStackClick} // MemberCard에서 전달받은 onStackClick 함수 실행
      // onStackClick 이벤트 발생 시, 기술 스택 수정을 위한 모달이 열리며, 해당 모달에서 onStackClick 함수가 실행됩니다.
      onContextMenu={onContextMenu} // 우클릭 방지, MemberCard에서 전달받음
    >
      {techStack.length > 0 ? (
        techStack.map((stack, index) => (
          <img key={index} src={`/images/${stack}.png`} alt={stack} className="w-10 h-10 rounded-full shadow-md" />
        ))
      ) : (
        <span className="text-gray-400">No Tech Stack Added</span> // 기술 스택이 비어있을 때 표시되는 문구
      )}
    </div>
  );
};

export default TechStack;