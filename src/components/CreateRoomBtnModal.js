import React, { useCallback, useRef, useState } from 'react'
import {Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema} from 'rsuite'
import firebase from 'firebase/app'
import {useModalState} from '../misc/custom-hooks'
import { auth, database } from '../misc/firebase'

const INITIAL_VALUE = {
    name: '',
    descryption : ''
}
const {StringType} = Schema.Types
const model = Schema.Model({
    name : StringType().isRequired('Chat Name is Required'),
    descryption : StringType().isRequired('description is Required')
})

const CreateRoomBtnModal = () => {
    // eslint-disable-next-line no-unused-vars
    const {isOpen,open,close} = useModalState()
    const [formValue,setFormValue] = useState(INITIAL_VALUE)
    const [isLoading,setIsLoading] = useState(false)
    const formRef = useRef()

    const onFormChange = useCallback((value) => {
        setFormValue(value)
    },[])
    const onSubmit = async () => {
        if(!formRef.current.check()){
            return
        }
        setIsLoading(true)

        const newRoomData = {
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admins: {
                [auth.currentUser.uid] : true,
            }
        }
        try{
            await database.ref('rooms').push(newRoomData)
            Alert.info(`${formValue.name} has been created`,3000)
            setIsLoading(false)
            setFormValue(INITIAL_VALUE)
            close()
        }
        catch(err){
            setIsLoading(false)
            Alert.error(err.message,3000)
        }
    }
    
    return (
        <div className='mt-1'>
            <Button block color='green' onClick={open}>
                <Icon icon='creative' /> Create new chat room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>New chat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Room name</ControlLabel>
                            <FormControl name='name' placeholder='Enter chat room name ....'/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Descryption</ControlLabel>
                            <FormControl 
                                componentClass='textarea' 
                                rows={5} 
                                name='descryption' 
                                placeholder='Enter room descryption ....'
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance='primary' onClick={onSubmit} disabled={isLoading}>
                        create new chat room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal
