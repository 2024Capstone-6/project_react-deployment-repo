import React, { useState, useEffect } from 'react';
import MemberCard from '../components/Member/MemberCard';

// 멤버 데이터 타입 정의
interface Member {
  id: number;
  name: string;
  role: string;
  comment: string;
  email: string;
  techStack: string[];
  profileImage: string | null;
}

// Member 페이지 컴포넌트: 멤버 리스트를 관리하고 화면에 표시
const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // 멤버 데이터 상태

  // 데이터 가져오기: 백엔드에서 멤버 데이터를 가져옴
  useEffect(() => {
    fetch('http://localhost:3001/members')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched members:', data);
        setMembers(data); // 가져온 데이터를 상태에 저장
      })
      .catch((err) => console.error('Error fetching members:', err));
  }, []);

  // 새로운 멤버 추가
  const addMember = async () => {
    const newMember = {
      name: '',
      role: '',
      comment: '',
      email: '',
      techStack: [],
      profileImage: 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png',
    };

    try {
      const response = await fetch('http://localhost:3001/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        console.error('Failed to add member');
        return;
      }

      const addedMember = await response.json();

      // 상태 업데이트 (추가된 멤버를 리스트에 추가)
      setMembers((prevMembers) => [...prevMembers, addedMember]);
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  // 멤버 업데이트
  const updateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  // 화면 렌더링
  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            memberData={member}
            onDelete={() => {
              setMembers(members.filter((m) => m.id !== member.id));
              fetch(`http://localhost:3001/members/${member.id}`, {
                method: 'DELETE',
              }).catch((err) => console.error('Error deleting member:', err));
            }}
            onUpdate={updateMember}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={addMember}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default Member;


/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 리다이렉트용
import MemberCard from '../components/Member/MemberCard';

// 멤버 데이터 타입 정의
interface Member {
  id: number; // 멤버의 고유 ID
  name: string; // 멤버 이름
  role: string; // 멤버 역할
  comment: string; // 멤버 코멘트
  email: string; // 멤버 이메일
  techStack: string[]; // 멤버의 기술 스택 목록
  profileImage: string | null; // 프로필 이미지 URL (없을 경우 null)
}

// Member 페이지 컴포넌트: 멤버 관리 및 표시
const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // 멤버 리스트 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태 확인
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 세션 스토리지에서 토큰 확인
  useEffect(() => {
    const token = sessionStorage.getItem('access_token'); // 세션 스토리지에서 access_token 조회
    if (token) {
      setIsAuthenticated(true); // 토큰이 있으면 인증 상태 true
    } else {
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 이동
    }
  }, [navigate]);

  // 인증된 상태에서만 멤버 데이터를 가져옴
  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:3001/members') // 백엔드에서 멤버 데이터 요청
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched members:', data); // 가져온 데이터 콘솔 출력
          setMembers(data); // 멤버 리스트 상태에 저장
        })
        .catch((err) => console.error('Error fetching members:', err)); // 에러 처리
    }
  }, [isAuthenticated]);

  // 새로운 멤버 추가
  const addMember = async () => {
    const newMember = {
      name: '', // 기본값: 빈 이름
      role: '', // 기본값: 빈 역할
      comment: '', // 기본값: 빈 코멘트
      email: '', // 기본값: 빈 이메일
      techStack: [], // 기본값: 빈 기술 스택
      profileImage: 'https://www.yju.ac.kr/sites/kr/images/img_symbol_mark.png', // 기본 프로필 이미지
    };

    try {
      const response = await fetch('http://localhost:3001/members', {
        method: 'POST', // POST 요청
        headers: {
          'Content-Type': 'application/json', // 요청 본문 타입 JSON
        },
        body: JSON.stringify(newMember), // 새로운 멤버 데이터를 JSON 문자열로 전송
      });

      if (!response.ok) {
        console.error('Failed to add member'); // 응답이 실패한 경우 콘솔에 에러 출력
        return;
      }

      const addedMember = await response.json(); // 추가된 멤버 데이터 응답 받음
      setMembers((prevMembers) => [...prevMembers, addedMember]); // 멤버 리스트 업데이트
    } catch (err) {
      console.error('Error adding member:', err); // 요청 실패 시 에러 출력
    }
  };

  // 멤버 정보 업데이트
  const updateMember = (updatedMember: Member) => {
    // 업데이트된 멤버 정보를 기존 리스트에 반영
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member // ID가 일치하면 업데이트된 멤버로 대체
      )
    );
  };

  // 인증되지 않은 상태에서는 화면에 아무것도 표시하지 않음
  if (!isAuthenticated) {
    return null; // 인증되지 않은 경우 렌더링 중단
  }

  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id} // 멤버 ID를 키로 사용
            memberData={member} // 멤버 데이터를 MemberCard 컴포넌트로 전달
            onDelete={() => {
              // 멤버 삭제 로직
              setMembers(members.filter((m) => m.id !== member.id)); // 삭제된 멤버를 리스트에서 제거
              fetch(`http://localhost:3001/members/${member.id}`, {
                method: 'DELETE', // DELETE 요청
              }).catch((err) => console.error('Error deleting member:', err)); // 에러 처리
            }}
            onUpdate={updateMember} // 업데이트 함수 전달
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={addMember} // Add Member 버튼 클릭 시 새로운 멤버 추가
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default Member; */