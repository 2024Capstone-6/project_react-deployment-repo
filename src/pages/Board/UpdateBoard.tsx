import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // React Router의 useNavigate와 useParams 사용

// 게시글 데이터 타입 정의
interface Board {
  title: string;
  content: string;
}

const UpdateBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate 훅
  const { idx } = useParams<{ idx: string }>(); // URL에서 게시글 ID를 가져옴

  // 기존 게시글 데이터 가져오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/board/${idx}`);
        setBoard(response.data); // 기존 게시글 데이터를 상태에 설정
      } catch (error) {
        console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
        alert("게시글 데이터를 불러오지 못했습니다.");
      }
    };

    fetchBoard();
  }, [idx]);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Axios PATCH 요청
      await axios.patch(`http://localhost:3001/board/${idx}`, board);
      alert("게시글이 성공적으로 수정되었습니다!");
      navigate("/board"); // 수정 후 /board로 리디렉션
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title" style={{ display: "block", marginBottom: "5px" }}>
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={board.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="content" style={{ display: "block", marginBottom: "5px" }}>
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={board.content}
            onChange={handleChange}
            required
            rows={10}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
            backgroundColor: isSubmitting ? "#ccc" : "#007BFF",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "수정 중..." : "수정하기"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBoard;