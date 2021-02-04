import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'rsuite'
import CreateRoomBtnModal from './CreateRoomBtnModal'
import DashBoardToggle from './Dashboard/DashBoardToggle'
import ChatRoomList from './rooms/ChatRoomList'

const Sidebar = () => {
    const topSideBarRef = useRef()
    const [height,setHeight] = useState(0)
    useEffect(()=> {
        if(topSideBarRef.current){
            setHeight(topSideBarRef.current.scrollHeight)
        }
    },[topSideBarRef])

    return(
        <div className='h-100 pt-2'>  
            <div ref={topSideBarRef}>
                <DashBoardToggle />
                <CreateRoomBtnModal/>
                <Divider>Join Conversation</Divider>
            </div>
            <ChatRoomList height={height}/>
        </div>
    )}

export default Sidebar
