import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import HeaderComponent from '../components/Header';
import MenuComponent from '../components/Menu';
import * as AuthService from '../../services/AuthService';
import { User } from '../../../types';

export interface IUserMainPageProps { };

const UserMainPage: React.FunctionComponent<IUserMainPageProps> = props => {

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

    let location = useLocation();
    const navigation = useNavigate();

    useEffect(() => {        
            //const user = AuthService.getCurrentUser();
            //setCurrentUser(user);
    });

    if (!userToken) {
        alert('Giriş Yapınız.');
        return <Navigate to="/giris" state={{ from: location }} replace />;
    }



    return <div>
        <HeaderComponent title='Kullanıcı Paneli' />
        <MenuComponent />
        <div className='bg-light my-5'>{userToken}</div>
    </div >
        ;
};

export default UserMainPage;