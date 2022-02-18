import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Navigate, Outlet } from 'react-router-dom';
import { UserType } from '../../types';
import { API_URL } from '../services/AuthService';
import HeaderComponent from './components/Header';

export interface IRegisterPageProps {
};

const RegisterPage: React.FunctionComponent<IRegisterPageProps> = props => {

    const navigation = useNavigate();
    const [user, setUser] = useState<UserType[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );

    let location = useLocation();

    if (userToken) {
        return <Navigate to="/kullanici" state={{ from: location }} replace />;
    }

    const doRegister = async (email: string, password: string) => {
        try {

            if (email != '' && password != '') {

                const { data } = await axios.post(API_URL + "register", {
                    email: email,
                    password: password
                });

                if (data != null) {
                    setUser(data);
                    setUserToken(data.token);
                    sessionStorage.setItem('userToken', JSON.stringify(data.token));
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    navigation('/kullanici');
                }

            } else {
                alert('Boş alan bırakmayınız.');
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }


    return (
        <div className='body'>
            <HeaderComponent title='Kayıt Ol' />
            <div className='container w-50 text-center'>

                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">E-Posta</label>
                        <input type="email" value={email} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(event) => setEmail(event.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Şifre</label>
                        <input type="password" value={password} className="form-control" id="exampleInputPassword1" onChange={(event) => setPassword(event.target.value)} />
                    </div>

                    <button type="button" className="btn btn-primary btn-block" onClick={() => { doRegister(email, password); }}>Kayıt Ol</button>
                </form>
                <div className='text-center mt-5'>
                    Zaten kayıtlı mısınız?
                </div>
                <div className='btn btn-secondary' onClick={() => navigation('/giris')}>Giriş Yap</div>
            </div>


        </div>
    );
};

export default RegisterPage;