import React, { useState, useEffect } from 'react';
import MemberCard from '../components/Member/MemberCard';

// Member 타입 정의
interface Member {
  id: number;
  name: string;
  role: string;
  comment: string;
  email: string;
  techStack: string[];
  userId: number; // 소유자 ID 추가
}

const Member: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]); // members 배열의 타입을 명시적으로 설정
  const loggedInUserId = parseInt(localStorage.getItem('userId') || '0', 10); // 로컬 스토리지에서 사용자 ID 가져오기

  // 데이터 초기 로드
  useEffect(() => {
    fetch('/api/members', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data: Member[]) => setMembers(data))
      .catch((err) => console.error('Error fetching members:', err));
  }, []);

  // Add new member
  const addMember = () => {
    const newMember: Omit<Member, 'id'> = {
      name: '',
      role: '',
      comment: '',
      email: '',
      techStack: [],
      userId: loggedInUserId, // 현재 로그인한 사용자를 소유자로 설정
    };
    fetch('/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newMember),
    })
      .then((res) => res.json())
      .then((data: Member) => setMembers([...members, data])) // 새로 추가된 Member 객체 업데이트
      .catch((err) => console.error('Error adding member:', err));
  };

  // Delete member by id
  const deleteMember = (id: number) => {
    fetch(`/api/members/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setMembers(members.filter((member) => member.id !== id)); // 삭제된 멤버 필터링
        } else {
          console.error('Error deleting member');
        }
      })
      .catch((err) => console.error('Error deleting member:', err));
  };

  return (
    <div className="p-12 -mt-10">
      <div className="flex flex-col gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            onDelete={() => deleteMember(member.id)}
            memberOwnerId={member.userId} // 소유자 ID 전달
            loggedInUserId={loggedInUserId} // 현재 로그인한 사용자 ID 전달
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