import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../style/board.css";

interface Board {
  id: number;
  title: string;
  content: string;
  imgurl?: string;
  date: string;
}

const BoardPage: React.FC = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [board, setBoard] = useState<Board[]>([]); // 게시글 데이터
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [postsPerPage] = useState<number>(10); // 한 페이지에 표시할 게시글 수
  const [totalPosts, setTotalPosts] = useState<number>(0); // 전체 게시글 수

  // 데이터 가져오기
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/board?page=${currentPage}&pageSize=${postsPerPage}`);
        if (response.data.data) {
          setBoard(response.data.data); // 현재 페이지의 게시글 데이터
          setTotalPosts(response.data.meta.totalItems); // 전체 게시글 수
        }
      } catch (error) {
        console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
      }
    };
    fetchBoardList();
  }, [currentPage, postsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // 현재 페이지 주변의 버튼 계산 (1~7개)
  const getVisiblePages = (currentPage: number, totalPages: number): (number | string)[] => {
    const visiblePages: (number | string)[] = [];

    // 항상 첫 번째 페이지 추가
    visiblePages.push(1);

    // 시작과 끝 범위 계산 (현재 페이지 기준으로 -2 ~ +2)
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      visiblePages.push(page);
    }

    // 마지막 페이지 추가
    if (totalPages > 1) visiblePages.push(totalPages);

    // 앞쪽에 ... 추가 조건
    if (
      typeof visiblePages[1] === "number" &&
      (visiblePages[1] as number) > 2
    ) {
      visiblePages.splice(1, 0, '...');
    }

    // 뒤쪽에 ... 추가 조건
    if (
      typeof visiblePages[visiblePages.length - 2] === "number" &&
      totalPages - (visiblePages[visiblePages.length - 2] as number) > 1
    ) {
      visiblePages.splice(visiblePages.length - 1, 0, '...');
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <>
      <div className="mainpage">
        <div className="boardbox">
          {board.length === 0 ? (
            <p>게시글이 없습니다.</p> // 게시글이 없을 때 메시지 표시
          ) : (
            board.map((item) => (
              <div key={item.id} className="boardlist" onClick={() => navigate(`/board/in/${item.id}`)}>
                <h2 className="board1">번호: {item.id}</h2>
                <h2 className="board2">{item.title}</h2>
                <div className="clear">
                </div>
                <p className="board3">작성시간: {item.date}</p>
                {item.imgurl && (
                <img src={item.imgurl} alt="게시글 이미지" className="imgbox" />
                
              )}
                <p>{item.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="createBoard" onClick={() => navigate('/board/create')}>
          글쓰기
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          {/* 이전 버튼 */}
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            이전
          </button>

          {/* 페이지 번호 버튼 */}
          {visiblePages.map((page, index) =>
            typeof page === 'number' ? (
              <button 
                key={index} 
                onClick={() => setCurrentPage(page)} 
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="ellipsis">...</span> // Ellipsis 표시
            )
          )}

          {/* 다음 버튼 */}
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        {/* 현재 페이지 표시 */}
        <p>현재 페이지: {currentPage}</p>
      </div>
    </>
  );
};

export default BoardPage;

