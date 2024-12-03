import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './board.css'; // CSS 파일 임포트

// 게시글 데이터 타입 정의
interface Board {
   title: string;
   content: string;
   image?: File; // 이미지 파일 추가
}

const CreateBoard: React.FC = () => {
   const [board, setBoard] = useState<Board>({ title: "", content: "" });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();

   // 입력값 변경 핸들러
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setBoard({ ...board, [name]: value });
   };

   // 이미지 파일 변경 핸들러
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         setBoard({ ...board, image: e.target.files[0] });
      }
   };

   // 제출 핸들러
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const formData = new FormData();
         formData.append("title", board.title);
         formData.append("content", board.content);
         if (board.image) {
            formData.append("file", board.image); // 이미지 파일 추가
         }

         // Axios POST 요청
         await axios.post(`http://localhost:3001/board`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         alert("게시글이 성공적으로 제출되었습니다!");
         navigate("/board");
      } catch (error) {
         console.error("게시글 제출 중 오류 발생:", error);
         alert("게시글 제출에 실패했습니다. 다시 시도해주세요.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="container">
         <h1>글쓰기</h1>
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="title" className="label">
                  제목
               </label>
               <input
                  type="text"
                  id="title"
                  name="title"
                  value={board.title}
                  onChange={handleChange}
                  required
                  className="input"
               />
            </div>
            <div className="form-group">
               <label htmlFor="content" className="label">
                  내용
               </label>
               <textarea
                  id="content"
                  name="content"
                  value={board.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="textarea"
               />
            </div>
            <div className="form-group">
               <label htmlFor="file" className="label">
                  이미지 업로드
               </label>
               <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
               />
            </div>
            <button
               type="submit"
               disabled={isSubmitting}
               className={`submit-button ${isSubmitting ? 'disabled' : ''}`}
            >
               {isSubmitting ? "제출 중..." : "제출하기"}
            </button>
         </form>
      </div>
   );
};

export default CreateBoard;