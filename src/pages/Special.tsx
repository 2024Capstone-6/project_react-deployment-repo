import { setId } from '@material-tailwind/react/components/Tabs/TabsContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { children } from 'solid-js'

const Special = () => {
  const [add_Modal,setAdd_Modal] = useState(false)
  const [Question,setQuestion] = useState('')
  const [answer,setAnswer] = useState('')
  const [uid,setUid] = useState('')
  useEffect(()=>{
    rand() 
  },[])

/*   const add_Question = () =>{
    const auth = axios.get("http://localhost:3001/special/auth")
    axios.post("http://localhost:3001/",
      {
        Qusetin :'' ,
      })
    
  } */

  const  rand = async ()=>{ // 랜덤으로 문제 받아오기
    const accessToken  = sessionStorage.getItem('access_token')
    const testarr=await axios.get("http://localhost:3001/special",{params: {accessToken}})
    const len:number = testarr.data.length // 안에있는 데이터의 길이
    const randomNum = Math.floor(Math.random()*len+testarr.data[0].id)
    setQuestion(testarr.data[randomNum-1].Question)
    setAnswer(testarr.data[randomNum-1].answer)
    setUid(//testarr.data[randomNum-1].uid
      ''
      )
  }

  const checkAnswer = (c:any)=>{
    if(answer===c){
      console.log('정답.')
    }
    else{
      console.log(`틀림 ${c} 병신아`)
    }
  }

  return (
/*     <div>
      <div className='Question'>
        <div style={{alignContent:'center'}}>{Question}</div>
        <button>수정</button>
      </div>
      <button onClick={test}>test</button>
    </div> */

    <div className="flex h-[80vh]">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 text-white flex flex-col items-center justify-start pt-8 font-bold text-lg">
        일본어 퀴즈
      </div>

      <div className="flex flex-col justify-center items-center flex-1 bg-gray-100 space-y-6 relative">
        <button
          className="absolute top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          onClick={()=>{setAdd_Modal(!add_Modal)}} 
        >글쓰기</button>
        <div className="w-full text-center text-xl font-semibold">
          아래 일본어의 한국어 해석을 작성하시오.
        </div>

        <div className="relative w-[90%] h-[450px] bg-gray-300 rounded-md p-6 flex items-center justify-center">
          <p className="text-center text-lg font-semibold leading-relaxed break-words">
            {Question}
          </p>
          
          { uid == '' ?
          /* 오른쪽 하단의 파란색과 빨간색 버튼 */
          <div className="absolute bottom-4 right-4 flex space-x-4">
            <button
              className="w-[72px] h-[40.5px] bg-blue-500 rounded-md "
            > 수정 </button>
            <button
              className="w-[72px] h-[40.5px] bg-red-500 rounded-md "
              aria-label="빨간 버튼"
            >삭제</button>
          </div>:<></>}
        </div>

        <form onSubmit={
          (e)=>{
            e.preventDefault()
            const answer = e.currentTarget.answer.value // input창의 값 읽어옴.
            checkAnswer(answer)
          }}
          className="w-[90%] space-y-4"
        >
          <input
            type="text"
            placeholder="입력창."
            name='answer'
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
          >
            enter
          </button>
        </form>
        
      </div>
      {add_Modal ?     
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={()=>{setAdd_Modal(!add_Modal)}}
      >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-[1000px] h-auto max-w-full"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 설정
      >
      <h3 className="text-2xl font-bold mb-6">문제 작성</h3>
      <form
        onSubmit={
          (e)=>{
            e.preventDefault()
            const add_q = e.currentTarget.Q.value
            const add_a = e.currentTarget.A.value
            console.log(add_q, add_a)
            setAdd_Modal(!add_Modal)
            axios.post("http://localhost/3001/special",
              {
                Question:add_q,
                answer:add_a
              })
          }}
      >
          <input
            type="text"
            className="w-full p-3 border rounded mb-6"
            placeholder="문제를 입력하세요" 
            name='Q'
          />

          <h3 className="text-2xl font-bold mb-6">답 작성</h3>
          <input
            type="text"
            className="w-full p-3 border rounded mb-6"
            placeholder="답을 입력하세요"
            name='A'
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
          onClick={()=>{setAdd_Modal(!add_Modal)}}
        >
          닫기
        </button>
      </div>
    </div>
        :''}
    </div>

  )
}

export default Special