import React, { memo } from 'react'
import { Alert, Button, Drawer } from 'rsuite'
import {useParams} from 'react-router'
import { useCurrentRoom } from '../../../context/current-room.context'
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks'
import { database } from '../../../misc/firebase'
import EditableInput from '../../EditableInput'

const EditRoomBtnHandler = () => {
    const { isOpen , open, close} = useModalState()
    const {chatId} = useParams()
    const isMobile = useMediaQuery('(max-width: 992px)')
    const name = useCurrentRoom(v => v.name)
    const description = useCurrentRoom(v => v.description)
    
    const updateData = (key,value) => {
        database.ref(`rooms/${chatId}`).child(key).set(value).then(()=>{
            Alert.success('Sucessfully Updated',3000)
        }).catch(err => {
            Alert.error(err.message,3000)
        })
    }

    const onDescriptionSave = (newDesc) =>{
        updateData('descryption',newDesc)
    }
    const onNameSave = (newName) =>{
        updateData('name',newName)
    }


    return (
        <div>
            <Button className='br-circle' size='sm' color='red' onClick={open}>
                a
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement='right'> 
                <Drawer.Header>
                    <Drawer.Title>Edit room</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <EditableInput 
                        initialValue={name}
                        onSave={onNameSave}
                        label={<h6 className='mb-2'>Name</h6>}
                        emptyMsg='Name cannot be Empty'
                    />
                    <EditableInput
                        wrapperClassName = 'mt-3'
                        component = 'textarea'
                        rows={5}
                        initialValue={description}
                        onSave={onDescriptionSave}
                        emptyMsg='Description cannot be Empty'
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <Button onClick={close}>
                        Close
                    </Button>
                </Drawer.Footer>
            </Drawer>
        </div>
    )
}

export default memo(EditRoomBtnHandler)
