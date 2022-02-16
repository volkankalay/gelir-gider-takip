import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from './components/Header';

export interface IHomePageProps { };

const HomePage: React.FunctionComponent<IHomePageProps> = props => {

    const navigate = useNavigate();

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );

    let location = useLocation();

    if (userToken) {
        return <Navigate to="/kullanici" state={{ from: location }} replace />;
    }
    return (
        <div className='body'>
            <HeaderComponent title='Gelir Gider Takip Uygulaması' />
            <div className='container'>

                <div className='row justify-content-around text-center'>
                    <div className='col-lg-4'>
                        <div className='btn btn-primary px-5 my-5 btn-lg' onClick={() => navigate('/giris')}>Giriş Yap</div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='btn btn-secondary px-5 my-5 btn-lg' onClick={() => navigate('/kayit-ol')}>Kayıt Ol</div>
                    </div>
                </div>
            </div>

            <div className='fixed-bottom text-center'>
                Volkan Kalay
            </div>

        </div>
    );
};

export default HomePage;