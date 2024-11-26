import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router의 useNavigate 사용

// 게시글 데이터 타입 정의
interface Board {
  title: string;
  content: string;
}

const CreateBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate 훅

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
      // Axios POST 요청
      await axios.post("http://localhost:3001/board", board);
      alert("게시글이 성공적으로 제출되었습니다!");
      navigate("/board"); // 제출 후 /board로 리디렉션
    } catch (error) {
      console.error("게시글 제출 중 오류 발생:", error);
      alert("게시글 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>글쓰기</h1>
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
          {isSubmitting ? "제출 중..." : "제출하기"}
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;