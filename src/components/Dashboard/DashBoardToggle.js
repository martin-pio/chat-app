import React, { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import { useMediaQuery, useModalState } from '../../misc/custom-hooks'
import DashBoard from '.'
import { auth } from '../../misc/firebase'

const DashBoardToggle = () => {
    const isMobile = useMediaQuery('(max-width: 992px)')
    const { isOpen, close, open } = useModalState()
    
    const onSignOut = useCallback(() => {
        
        auth.signOut()
        
        Alert.info('signed out',4000)
        
        close()
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
