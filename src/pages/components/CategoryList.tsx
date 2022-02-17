import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as AuthService from '../../services/AuthService';

export interface ICategoryListComponentProps { categories: Array<string> };



const CategoryListComponent: React.FunctionComponent<ICategoryListComponentProps> = props => {

    const API_URL = "http://192.168.1.100/api/v1/category/";

    const [categories, setCategories] = React.useState([]);


    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );


    React.useEffect(() => {
        setTimeout(() => {
            getCategories();
        }, 1000);
    });


    const getCategories = async () => {
        try {
            const data = await axios.get(API_URL,
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken()
                    }
                })
                .then((res) => {
                    setCategories(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const deleteCategory = async (id: number) => {
        try {
            const data = await axios.delete(API_URL + id,
                {
                    headers: {
                        Authorization: `Bearer ` + JSON.parse(userToken),
                        method: 'DELETE'
                    }
                })
                .then((res) => {
                    //getCategories();
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    return (
        <div>

            <table className='table table-hover mt-4'>
                <thead className=' table-dark bg-dark'>
                    <tr>
                        <th>Kategori Adı</th>
                        <th>Kategori Türü</th>
                        <th colSpan={2} className='text-center'>İşlem</th>
                    </tr>
                </thead>

                <tbody>

                    {categories.map(({ id, name, is_income }: any) => <tr key={id}>
                        <td>{name}</td>
                        {is_income ? (
                            <td className='bg-success text-light font-weight-bolder'>Gelir</td>) : (
                            <td className='bg-danger text-light font-weight-bolder'>Gider</td>
                        )}
                        <td className='text-center'>
                            <div className='btn btn-primary'>Düzenle</div>
                        </td>
                        <td className='text-center'>
                            <div className='btn btn-danger' onClick={() => deleteCategory(id)}>Sil</div>
                        </td>
                    </tr>
                    )
                    }

                </tbody>


            </table>
        </div>

    );
};

export default CategoryListComponent;