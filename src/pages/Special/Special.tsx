import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { children } from 'solid-js'


const Special = () => {
  const [Question,setQuestion] = useState('')
  const [answer,setAnswer] = useState('')
  useEffect(()=>{
    test() 
  },[])

  const  test = async ()=>{
    const testarr=await axios.get("http://localhost:3001/special")
    const len:number = testarr.data.length // 안에있는 데이터의 길이
    const randomNum = Math.floor(Math.random()*len+testarr.data[0].id)
    setQuestion(testarr.data[randomNum-1].Question)
    setAnswer(testarr.data[randomNum-1].answer)
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
    <div>
      <div className='Question'>{Question}</div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        const answer = e.currentTarget.answer.value // input창의 값 읽어옴.
        checkAnswer(answer)

      }}
      >
        <input style={{
          border:'solid 1px black',
          borderRadius:'10px',
          paddingLeft:'1%'
        }}
        name='answer'
        />
        <button type='submit' style={{border:'solid 1px black', marginLeft:'.5%' }}>제출</button>
      </form>
      <button onClick={test}>test</button>
    </div>
  )
}

export default Special