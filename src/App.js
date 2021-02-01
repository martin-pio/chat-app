import React from 'react'
import './styles/main.scss'
import 'rsuite/dist/styles/rsuite-default.css'
import { Switch } from 'react-router'
import SignIn from './pages/SignIn'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import PublicRouter from './components/PublicRouter'
import { ProfileProvider } from './context/profile.context'

const App = () => (
    <ProfileProvider>
        <Switch>
            <PublicRouter path='/signin'>
                <SignIn/>
            </PublicRouter>
            <PrivateRoute path ='/'>
                <Home/>
            </PrivateRoute>
        </Switch>
    </ProfileProvider>
    )

export default App
