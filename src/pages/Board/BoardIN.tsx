import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './board.css'; // CSS 파일 임포트

// 게시글 데이터 타입 정의
interface Board {
   title: string;
   content: string;
   imgurl?: string;
}

interface Chat {
   id: number;
   content: string;
   imgurl?: string;
}

const BoardIN: React.FC = () => {
   const { idx } = useParams(); // URL에서 게시글 ID를 가져옴
   const [board, setBoard] = useState<Board | null>(null); // 게시글 데이터를 저장
   const [chats, setChats] = useState<Chat[]>([]); // 댓글 데이터를 저장
   const [newChatContent, setNewChatContent] = useState<string>(""); // 새로운 댓글 내용
   const [newChatImage, setNewChatImage] = useState<File | null>(null); // 새로운 댓글 이미지 파일
   const [editingChatId, setEditingChatId] = useState<number | null>(null); // 현재 편집 중인 댓글 ID
   const [editingContent, setEditingContent] = useState<string>(""); // 편집 중인 댓글 내용
   const [editingImage, setEditingImage] = useState<File | null>(null); // 편집 중인 댓글 이미지 파일
   const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

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

   // 댓글 데이터 가져오기 함수
   const getChats = async () => {
      try {
         const response = await axios.get(`http://localhost:3001/board/${idx}/chats`);
         setChats(response.data);
      } catch (error) {
         console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
      }
   };

   // 새로운 댓글 생성 함수
   const createChat = async () => {
      try {
         const formData = new FormData();
         formData.append("content", newChatContent);
         if (newChatImage) {
            formData.append("file", newChatImage); // 서버에서 'file'로 받도록 설정
         }

         await axios.post(`http://localhost:3001/board/${idx}/chats`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         setNewChatContent(""); // 입력 필드 초기화
         setNewChatImage(null); // 이미지 파일 초기화
         getChats(); // 댓글 목록 갱신
      } catch (error) {
         console.error("댓글 생성 중 오류 발생:", error);
         alert("댓글을 생성하지 못했습니다.");
      }
   };

   // 댓글 수정 함수
   const updateChat = async (chatId: number) => {
      try {
         const formData = new FormData();
         formData.append("content", editingContent);
         if (editingImage) {
            formData.append("file", editingImage); // 서버에서 'file'로 받도록 설정
         }

         await axios.patch(`http://localhost:3001/board/${idx}/chats/${chatId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });

         setEditingChatId(null); // 편집 모드 종료
         getChats(); // 댓글 목록 갱신
      } catch (error) {
         console.error("댓글 수정 중 오류 발생:", error);
      }
   };

   // 댓글 삭제 함수
   const deleteChat = async (chatId: number) => {
      try {
         await axios.delete(`http://localhost:3001/board/${idx}/chats/${chatId}`);
         getChats(); // 댓글 목록 갱신
      } catch (error) {
         console.error("댓글 삭제 중 오류 발생:", error);
         alert("댓글을 삭제하지 못했습니다.");
      }
   };

   // 컴포넌트가 렌더링될 때 데이터 가져오기
   useEffect(() => {
      getBoard();
      getChats();
   }, []);

   if (!board) {
      return <p>게시글을 불러오는 중입니다...</p>; // 로딩 상태 표시
   }

   return (
      <div className="container">
         <h1>{board.title}</h1> {/* 게시글 제목 */}
         <div className="board-title">
            {board.content} {/* 게시글 내용 */}
         </div>
         {board.imgurl && (
            <img src={board.imgurl} alt="게시글 이미지" className="board-image" />
         )}
         <button onClick={() => navigate(`/updateBoard/${idx}`)} className="edit-button">수정하기</button> {/* 수정하기 버튼 */}
         <button onClick={async () => {
            try {
               await axios.delete(`http://localhost:3001/board/${idx}`);
               navigate('/board');
               alert("삭제되었습니다!");
            } catch (error) {
               console.error("게시글 데이터를 삭제하는 중 오류 발생:", error);
               alert("게시글 데이터를 삭제하지 못했습니다.");
            }
         }} className="delete-button">삭제하기</button>

         {/* 댓글 목록 */}
         <div className="comment-section">
            <h2>댓글</h2>
            {chats.map(chat => (
               <div key={chat.id} className="comment-box">
                  {editingChatId === chat.id ? (
                     <>
                        <textarea 
                           value={editingContent}
                           onChange={(e) => setEditingContent(e.target.value)}
                           className="textarea"
                        />
                        {/* 이미지 파일 업로드 입력 */}
                        <input 
                           type="file"
                           accept="image/*"
                           onChange={(e) => e.target.files && setEditingImage(e.target.files[0])}
                           className="file-input"
                        />
                        <button onClick={() => updateChat(chat.id)} className="save-button">저장</button>
                        <button onClick={() => setEditingChatId(null)} className="cancel-button">취소</button>
                     </>
                  ) : (
                     <>
                        <p>{chat.content}</p>
                        {chat.imgurl && <img src={chat.imgurl} alt="댓글 이미지" style={{ width: "100%" }} />}
                        <button onClick={() => { 
                           setEditingChatId(chat.id); 
                           setEditingContent(chat.content); 
                           setEditingImage(null); 
                        }} className="edit-button">수정</button>
                        <button onClick={() => deleteChat(chat.id)} className="delete-button">삭제</button>
                     </>
                  )}
               </div>
            ))}
            {/* 새로운 댓글 입력 */}
            <textarea 
               value={newChatContent}
               onChange={(e) => setNewChatContent(e.target.value)}
               placeholder="댓글을 입력하세요"
               className="textarea"
            />
            {/* 이미지 파일 업로드 입력 */}
            <input 
               type="file"
               accept="image/*"
               onChange={(e) => e.target.files && setNewChatImage(e.target.files[0])}
               className="file-input"
            />
            <button onClick={createChat} className="submit-button">댓글 작성</button>
         </div>
      </div>
   );
};

export default BoardIN;