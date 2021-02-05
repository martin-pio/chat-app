import React, { createContext, useContext, useEffect, useState } from 'react'
import { database } from '../misc/firebase'
import {transformToArrayWithId} from '../misc/helper'

const RoomsContext = createContext()

export const RoomsProvider = ({ children }) => {
    // eslint-disable-next-line no-unused-vars
    const [rooms,setRooms] = useState(null)
    useEffect(()=>{
        const roomListRef = database.ref('rooms')

        roomListRef.on('value', (snap) =>{
            const data = transformToArrayWithId(snap.val())
            setRooms(data)
        })

        return () =>{
            roomListRef.off()
        }
    },[])

    return (
        <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
    )
}

export const useRooms = () => useContext(RoomsContext)
