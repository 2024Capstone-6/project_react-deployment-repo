import { useNavigate } from "react-router-dom";
import "../style/board.css"

const Board: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className="mainpage">
      글목록~
      <div className="createPost" onClick={()=> navigate('/createPost')}>글쓰기</div>
      <div className="boardbox">임마는 글박스 디자인
        
      </div>
    </div>
    <div className="bestpage">
      베스트글~
    </div>
    </>
  );
};

export default Board;
