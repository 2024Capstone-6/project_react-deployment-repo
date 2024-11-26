import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../style/board.css"


interface Board {
  id: number;
  title: string;
  content: string;
}

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [board, setBoard] = useState<Board[]>([]);

  // 데이터 가져오기
  useEffect(() => {
    const boardlist = async () => {
      try {
        const response = await axios.get<Board[]>('http://localhost:3001/board');
        setBoard(response.data);
      } catch (error) {
        console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
      }
    };
    boardlist();
  }, []);

  return (
    <>
      <div className="mainpage">
        영딧게시판
        <div className="createBoard" onClick={() => navigate('/createBoard')}>
          글쓰기
        </div>
        <div className="boardbox">
          {board.map((board) => (
            <div key={board.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h2>제목:{board.title}</h2>
              <p>내용:{board.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bestpage">베스트글~</div>
    </>
  );
};

export default BoardPage;
