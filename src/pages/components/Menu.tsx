import axios from 'axios';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface IMenuComponentProps { };

const MenuComponent: React.FunctionComponent<IMenuComponentProps> = props => {

    const navigation = useNavigate();

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );

    let location = useLocation();

    const doLogout = async () => {
        await axios.post("http://192.168.1.100/api/v1/logout", {
            // data
        },
            {
                headers: {
                    Authorization: `Bearer ` + JSON.parse(userToken)
                }
            })
            .then((res) => {
                sessionStorage.clear();
                navigation('/giris');
            })
            .catch((error) => {
                console.error(error)
            });
    }
    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-center text-center">
                <div className="container-fluid">
                    <div className="navbar-nav">
                        <a className="nav-link" href="./kullanici">Kullanıcı Paneli</a>
                        <a className="nav-link" href="./kategoriler">Kategoriler</a>
                        <a className="nav-link" href="./gelir-gider">Gelir Gider</a>
                        <a className="nav-link" href="./raporlama">Raporlama</a>
                    </div>
                    <div className='btn btn-danger float-right' onClick={() => doLogout()}>Çıkış Yap</div>
                </div>
            </nav>
        </div>
    );
};

export default MenuComponent;