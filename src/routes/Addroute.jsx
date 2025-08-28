import { Route, Routes } from 'react-router-dom'
import NotFoundPage from '../pages/NotFoundPage'
import Home from '../pages/Home'
import Login from '../pages/Login'
// import Signup from '../pages/Signup'

import { Fragment } from 'react'
import PrivateRoutes from './Private_route'; // adjust the path if needed
import YoungBazerHealth from '../pages/YoungBazerHealth'
import Youngbazerfruntend from '../pages/Youngbazerfruntend'
import Perfect from '../pages/Perfect'
import AddServices from '../pages/AddServices'

const Addroute = () => {
    return (
        <Fragment>
            <Routes>
                <Route element={<PrivateRoutes />} >

                    {""}
                    <Route path='/' element={<Home />} />

                    <Route path='/youngBazer' element={<YoungBazerHealth />} />

                    <Route path='/fruntend_youngbazer' element={<Youngbazerfruntend />} />
                    <Route path='/test' element={<Perfect />} />
                    <Route path='/add_sevice' element={<AddServices />} />
                </Route>
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Fragment>


    )
}

export default Addroute



