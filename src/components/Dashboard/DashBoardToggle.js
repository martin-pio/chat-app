import React, { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import { useMediaQuery, useModalState } from '../../misc/custom-hooks'
import DashBoard from '.'
import { auth, database } from '../../misc/firebase'
import { isOfflineForDatabase } from '../../context/profile.context'

const DashBoardToggle = () => {
    const isMobile = useMediaQuery('(max-width: 992px)')
    const { isOpen, close, open } = useModalState()
    
    const onSignOut = useCallback(() => {
        database.ref(`/status/${auth.currentUser.uid}`)
        .set(isOfflineForDatabase)
        .then(()=>{
            auth.signOut()
            Alert.info('signed out',4000)
            close()
        })
        .catch(err => {
            Alert.error(err.message,4000)
        })
    }, [close])

    return(
        <>
            <Button block color='blue' onClick={open}>
                <Icon icon='dashboard'/>DashBoard
            </Button>
            <Drawer full = {isMobile} show={isOpen} onHide={close} placement='left'>
                <DashBoard onSignOut = {onSignOut}/>
            </Drawer>
        </>
    )
}

export default DashBoardToggle
