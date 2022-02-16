import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../../types';
import CategoryFormComponent from '../components/CategoryForm';
import CategoryListComponent from '../components/CategoryList';
import FooterComponent from '../components/Footer';
import HeaderComponent from '../components/Header';
import MenuComponent from '../components/Menu';

export interface ICategoryPageProps { };

const CategoryPage: React.FunctionComponent<ICategoryPageProps> = props => {

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
            <HeaderComponent title='Kategoriler' />
            <MenuComponent />
            <CategoryFormComponent />
            <div className='container'>
                <CategoryListComponent categories={categories} />

            </div>
            <FooterComponent/>
        </div >
    );
};

export default CategoryPage;