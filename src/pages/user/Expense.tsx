import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ExpenseType } from '../../../types';
import ExpenseFormComponent from '../components/ExpenseForm';
import ExpenseListComponent from '../components/ExpenseList';
import FooterComponent from '../components/Footer';
import HeaderComponent from '../components/Header';
import MenuComponent from '../components/Menu';

export interface IExpensePageProps { };

const ExpensePage: React.FunctionComponent<IExpensePageProps> = props => {

    const [input, setInput] = useState("");
    const [categories, setCategories] = useState([]);

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );


    let location = useLocation();
    const navigation = useNavigate();

    if (!userToken) {
        alert('Giriş Yapınız.');
        return <Navigate to="/giris" state={{ from: location }} replace />;
    }


    return (
        <div>
            <HeaderComponent title='Gelir Gider' />
            <MenuComponent />
            <ExpenseFormComponent />
            <div className='container'>
                <ExpenseListComponent />

            </div>
            <FooterComponent/>
        </div >
    );
};

export default ExpensePage;