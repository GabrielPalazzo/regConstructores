import useSelection from 'antd/lib/table/hooks/useSelection';
import React,{useState} from 'react'
import Lottie from 'react-lottie';

export interface LoadingProps {
  message: string
  type: 'sync' | 'waiting'
}

export const Loading: React.FC<LoadingProps> = ({
  message = '',
  type='sync'
}) => {

  const [isStopped, setIsStopped] = useState(false)
  const [isPaused,setIsPaused ] = useState(false)

  const animationData = require(`../public/lotties/${type}.json`)

  const buttonStyle = {
    display: 'block',
    margin: '10px auto'
  }

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return <div className="">
    <div className=" mtop">
    <Lottie options={defaultOptions}
              height={200}
              width={200}
              isStopped={isStopped}
              isPaused={isPaused}/>
    </div>
    <style>
    {` 
      .mtop{
        margin-top:20%;
      }
      `}
  </style>
    </div>
    
}