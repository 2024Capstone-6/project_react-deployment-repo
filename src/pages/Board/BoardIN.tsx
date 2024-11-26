import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// 게시글 데이터 타입 정의
interface Board {
  title: string;
  content: string;
}

const BoardIN: React.FC = () => {
  const { idx } = useParams(); // URL에서 게시글 ID를 가져옴
  const [board, setBoard] = useState<Board | null>(null); // 게시글 데이터를 저장

  // 게시글 데이터 가져오기 함수
  const getBoard = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/board/${idx}`);
      setBoard(response.data); // API 응답 데이터를 상태에 저장
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      alert("게시글 데이터를 불러오지 못했습니다.");
    }
  };

  // 컴포넌트가 렌더링될 때 데이터 가져오기
  useEffect(() => {
    getBoard();
  }, []);

  if (!board) {
    return <p>게시글을 불러오는 중입니다...</p>; // 로딩 상태 표시
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{board.title}</h1> {/* 게시글 제목 */}
      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {board.content} {/* 게시글 내용 */}
      </div>
    </div>
  );
};

export default BoardIN;