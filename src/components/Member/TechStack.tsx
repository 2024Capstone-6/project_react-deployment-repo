import React, { MouseEvent } from 'react';

interface TechStackProps {
  techStack: string[]; // 기술 스택 배열
  onStackClick?: (e: MouseEvent<HTMLDivElement>) => void; // 선택적 클릭 이벤트
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void; // 우클릭 방지 이벤트 핸들러 (선택적)
}

const TechStack: React.FC<TechStackProps> = ({ techStack, onStackClick, onContextMenu }) => {
  return (
    <div
      className={`flex flex-wrap gap-3 w-[28rem] h-44 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-md ${
        onStackClick ? 'cursor-pointer' : ''
      }`} // 클릭 가능 여부에 따라 커서 스타일 변경
      onClick={onStackClick} // 부모 컴포넌트에서 전달받은 클릭 핸들러 실행
      onContextMenu={onContextMenu} // 우클릭 방지 핸들러 실행
    >
      {techStack.length > 0 ? (
        techStack.map((stack, index) => (
          <img
            key={index}
            src={`/images/Member/${stack}.png`}
            alt={stack}
            className="w-10 h-10 rounded-full shadow-md object-cover"
          />
        ))
      ) : (
        <span className="text-gray-400">No Tech Stack Added</span>
      )}
    </div>
  );
};

export default TechStack;