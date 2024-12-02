import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // React Router의 useNavigate와 useParams 사용

// 게시글 데이터 타입 정의
interface Board {
  title: string;
  content: string;
  imgurl?: File;
}

const UpdateBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { idx } = useParams<{ idx: string }>();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/board/${idx}`);
        setBoard(response.data);
      } catch (error) {
        console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
        alert("게시글 데이터를 불러오지 못했습니다.");
      }
    };

    fetchBoard();
  }, [idx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBoard({ ...board, imgurl: e.target.files[0] }); // 이미지 파일을 상태에 저장
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("title", board.title);
      formData.append("content", board.content);
      if (board.imgurl) {
        formData.append("file", board.imgurl); // 이미지 파일 추가
      }
  
      await axios.patch(`http://localhost:3001/board/${idx}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("게시글이 성공적으로 수정되었습니다!");
      navigate("/board");
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
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="file" style={{ display: "block", marginBottom: "5px" }}>
            이미지 업로드
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: "100%",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
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