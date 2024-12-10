import axios from 'axios'
import { info } from 'console'
import React, { useState } from 'react'

const Add_Modal = (props: { 
  answer : string,
  question : string,
  setModal: () => void,
  qid : string
  accessor : string
  settoggle : ()=>void
}) => {
  const [defaultQuestion,setDefaltQuestion] = useState(`${props.question}`)
  const [defaultAnswer,setDefaltAnswer] = useState(`${props.answer}`)
  return (
    <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={()=>{props.setModal}}
      >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-[1000px] h-auto max-w-full"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 설정
      >
      <h3 className="text-2xl font-bold mb-6">문제 작성</h3>
      <form
        onSubmit={
          async (e)=>{
            e.preventDefault()
            const add_q:string = e.currentTarget.Q.value
            const add_a:string = e.currentTarget.A.value
            props.setModal()
            await axios.put(`http://localhost:3001/special/${props.qid}`,
              {
                "Question":add_q,
                "answer":add_a,
                "author": props.accessor
              })
            props.settoggle()
            alert('수정완료')
          }}
      >
          <input
            type="text"
            className="w-full p-3 border rounded mb-6"
            placeholder="문제를 입력하세요" 
            name='Q'
            value={defaultQuestion}
            onChange={(e)=>{setDefaltQuestion(e.target.value)}}
          />

          <h3 className="text-2xl font-bold mb-6">답 작성</h3>
          <input
            type="text"
            className="w-full p-3 border rounded mb-6"
            placeholder="답을 입력하세요"
            name='A'
            value={defaultAnswer}
            onChange={(e)=>{setDefaltAnswer(e.target.value)}}
          />

          <button
            className="w-full bg-green-500 text-white py-3 rounded mb-4 hover:bg-green-600 transition"
            type='submit'
          >
            업로드
          </button>
        </form>
        <button
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
          onClick={()=>{
            props.setModal()
            props.settoggle()
          }}
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default Add_Modal
