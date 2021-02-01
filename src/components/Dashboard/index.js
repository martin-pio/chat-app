import React from 'react'
import { Alert, Button, Divider, Drawer } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import { database } from '../../misc/firebase'
import EditableInput from '../EditableInput'
import ProviderBlock from './ProviderBlock'

const DashBoard = ({ onSignOut }) => {
    const { profile } = useProfile()
    // eslint-disable-next-line no-unused-vars
    const onSave = async newData => {
        const userNickRef = database.ref(`/profiles/${profile.uid}`).child('name')
        try{
            await userNickRef.set(newData)
            Alert.success('NickName has been updated',3000)
        }
        catch(err){
            Alert.error(err.message,3000)
        }
    }

    return (
        <>
            <Drawer.Header>
                <Drawer.Title>DashBoard</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                <h3> Hey, {profile.name}</h3>
                <ProviderBlock />
                <Divider/>
                <EditableInput
                    name = 'nickname'
                    initialValue = {profile.name}
                    onSave = {onSave}
                    label = {<h6 className='mb-2'>Nickname</h6>}                    
                />
            </Drawer.Body>

            <Drawer.Footer>
                <Button block color='red' onClick={onSignOut}>
                    Sign out 
                </Button>
            </Drawer.Footer>
        </>
    )
}

export default DashBoard
