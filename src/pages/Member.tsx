import React, { useState, useEffect } from 'react';
import MemberCard from '../components/Member/MemberCard';

// 멤버 데이터를 표현하는 타입 정의
interface Member {
  id: number; // 멤버 고유 ID
  name: string; // 이름
  role: string; // 역할
  comment: string; // 코멘트
  email: string; // 이메일
  techStack: string[]; // 기술 스택 배열
  profileImage: string | null; // 프로필 이미지 URL
}

const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // 멤버 데이터 상태

  // 컴포넌트가 처음 렌더링될 때 멤버 데이터를 가져옴
  useEffect(() => {
    fetch('http://localhost:3001/members')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched members:', data); // 디버깅용 로그
        setMembers(data); // 상태 업데이트
      })
      .catch((err) => console.error('Error fetching members:', err));
  }, []);

  // 새로운 멤버 추가
  const addMember = () => {
    const newMember = {
      name: 'New Member',
      role: 'New Role',
      comment: 'Default comment',
      email: 'example@example.com',
      techStack: [],
      profileImage: null,
    };

    fetch('http://localhost:3001/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMember),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Added member:', data); // 디버깅용 로그
        setMembers([...members, data]); // 상태 업데이트
      })
      .catch((err) => console.error('Error adding member:', err));
  };

  // 멤버 업데이트
  const updateMember = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            memberData={member}
            onDelete={() => {
              setMembers(members.filter((m) => m.id !== member.id)); // 로컬 상태 업데이트
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