import React from 'react';

// TechStack 컴포넌트가 받을 props의 구조와 타입 정의
interface TechStackProps {
  techStack: string[]; // 기술 스택 목록, 문자열 배열
  // 기술 스택 클릭 시 실행할 클릭 이벤트 핸들러
  // <HTMLDivElement>: HTML<div> 요소에서 발생한 마우스 이벤트를 나타냄
  onStackClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // 클릭 이벤트 (선택적)
}

const TechStack: React.FC<TechStackProps> = ({ techStack, onStackClick }) => {
  return (
    <div
      className={`flex flex-wrap gap-3 w-[28rem] h-44 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-md ${
        onStackClick ? 'cursor-pointer' : ''
      }`}
      onClick={onStackClick} // 클릭 이벤트 핸들러 실행
    >
      {techStack.length > 0 ? (
        // 기술 스택이 있는 경우
        techStack.map((stack, index) => (
          <img
            key={index}
            src={`/images/Member/${stack}.png`} // 기술 스택 이미지 경로
            alt={stack} // 대체 텍스트
            className="w-10 h-10 rounded-full shadow-md object-cover" // 기술 스택 이미지 스타일
          />
        ))
      ) : (
        // 기술 스택이 없는 경우
        <span className="text-gray-400">No Tech Stack Added</span>
      )}
    </div>
  );
};

export default TechStack;