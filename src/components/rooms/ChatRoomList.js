import React from 'react'
import { Loader, Nav } from 'rsuite'
import {Link, useLocation} from 'react-router-dom'
import { useRooms } from '../../context/rooms.context'
import RoomItem from './RoomItem'
// eslint-disable-next-line arrow-body-style
const ChatRoomList = ( { height} ) => {
    const rooms = useRooms()
    const location = useLocation()

    return (
        <Nav
            appearance='subtle'
            vertical
            reversed
            className='overflow-y-scroll custom-scroll'
            style={{height: `calc(100% - ${height}px)`}}
            activeKey={location.pathname}
        > 
        {!rooms && (
            <Loader center vertical content='loading' speed='slow' size='md'/>
        )}  
        {rooms && rooms.length > 0 && 
            rooms.map(room => (
                <Nav.Item 
                    componentClass={Link} 
                    to={`/chat/${room.id}`} 
                    key={room.id}
                    eventKey={`/chat/${room.id}`} 
                    >
                    <RoomItem room = {room}/>
                </Nav.Item>
            ))
        } 
        </Nav>
    )
}

export default ChatRoomList
