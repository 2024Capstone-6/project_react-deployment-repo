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
