import { setId } from '@material-tailwind/react/components/Tabs/TabsContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { children } from 'solid-js'
import Add_Modal from '../components/Add_Modal'
import Delete_Modal from '../components/Delete_Modal'
import Update_Modal from '../components/Update_Modal'
import Fail_Modal_Screen from '../components/Fail_Modal'
import Ok_Modal_Screen from '../components/Ok_Modal'

const Special = () => {
  const [add_Modal,setAdd_Modal] = useState(false)
  const [up_Modal,setUp_Modal] = useState(false)
  const [delete_Modal,setDeleteModal] = useState(false)
  const [Ok_Modal,setOk_Modal]=useState(false)
  const [Fail_Modal,setFail_Modal] = useState(false)
  const [Question,setQuestion] = useState('')
  const [id,setId] = useState('')
  const [answer,setAnswer] = useState('')
  const [author,setAuthor] = useState('')
  const [accessor,setAccesor ] = useState('')
  const [toggle,setToggle ] = useState(true)

  useEffect(()=>{
    rand() 
  },[toggle])

  const rand = async ()=>{ // 랜덤으로 문제 받아오기
    const accessToken  = sessionStorage.getItem('access_token')
    const testarr = await axios.get('http://localhost:3001/special')
    const accessor = (await axios.get("http://localhost:3001/special/gettoken",{headers:{access_token:`${accessToken}`}})).data.nickname
    const len:number = await testarr.data.length // 안에있는 데이터의 길이
    const randomNum = Math.floor(Math.random()*len)
    setQuestion(testarr.data[randomNum].Question)
    setAnswer(testarr.data[randomNum].answer)
    setAuthor(testarr.data[randomNum].author)
    setId(testarr.data[randomNum].id)
    setAccesor(accessor)

  }

  
  const checkAnswer = (c:any)=>{
    if(answer===c){
      setOkModal()
    }
    else{
      setFailModal()
    }
  }
  
  const settoggle = () =>{
    setToggle(!toggle)
  }

  const addModal = ()=>{
    return setAdd_Modal(!add_Modal)
  }

  const updateModal=()=>{
    return setUp_Modal(!up_Modal)
  }

  const delModal=()=>{
    return setDeleteModal(!delete_Modal)
  }
  
  const setOkModal=()=>{
    return setOk_Modal(!Ok_Modal)
  }
  
  const setFailModal=()=>{
    return setFail_Modal(!Fail_Modal)
  }

  
  return (


    <div className="flex h-[80vh]">
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
          
          {accessor  == author ?
          /* 오른쪽 하단의 파란색과 빨간색 버튼 */
          <div className="absolute bottom-4 right-4 flex space-x-4">
            <button
              onClick={()=>{updateModal()}}
              className="w-[72px] h-[40.5px] bg-blue-500 rounded-md "
            > 수정 </button>
            <button
              onClick={()=>{delModal()}}
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
            e.currentTarget.answer.value = ''
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



      {/* 추가 모달창 */}
      {add_Modal ? 
        <Add_Modal setModal={addModal} accessor={accessor}/>
        :''}
      {/* 업데이트 모달창 */}
      {up_Modal ? 
      <Update_Modal answer={answer} question={Question} setModal={updateModal} settoggle={settoggle} accessor={accessor} qid={id}/>
      :''}
      {/* 삭제 모달창 */}
      {delete_Modal ? 
      <Delete_Modal setModal={delModal} settoggle={settoggle} qid={id}/>
      :''}
      {/* 성공 모달창 */}
      {Ok_Modal ? 
      <Ok_Modal_Screen setModal={setOkModal} settoggle={settoggle} qid={id}/>
      :''}
      {/* 실패 모달창 */}
      {Fail_Modal ? 
        <Fail_Modal_Screen setModal={setFailModal} settoggle={settoggle} qid={id}/>
      :''}
    </div>

  )
}

export default Special