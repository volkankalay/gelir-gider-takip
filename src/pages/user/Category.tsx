import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../../types';
import FooterComponent from '../components/Footer';
import HeaderComponent from '../components/Header';
import MenuComponent from '../components/Menu';
import * as AuthService from '../../services/AuthService';

export interface ICategoryPageProps { };

const CategoryPage: React.FunctionComponent<ICategoryPageProps> = props => {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState('');
    const [type, setType] = useState('1');

    const [refresh, setRefresh] = React.useState(true);

    const addCategory = async (name: string, type: string) => {
        try {

            if (name != '' && type != null) {

                const { data } = await axios.post(AuthService.API_URL + 'category/', {
                    name: name,
                    is_income: type
                },
                    {
                        headers: {
                            Authorization: `Bearer ` + AuthService.getCurrentToken()
                        }
                    });
                setRefresh(true);
            } else {
                alert('Boş alan bırakmayınız.');
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addCategory(name, type);
        setRefresh(true);
        setName("");
    }

    const getCategories = async () => {
        try {
            const data = await axios.get(AuthService.API_URL + 'category/',
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
            const data = await axios.delete(AuthService.API_URL + 'category/' + id,
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken(),
                        method: 'DELETE'
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            setRefresh(true);
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    React.useEffect(() => {
        if (refresh) {
            getCategories();
            setTimeout(() => {
                setRefresh(false);
            }, 200);
        }
    });

    let location = useLocation();
    const navigation = useNavigate();

    if (!AuthService.getCurrentToken()) {
        alert('Giriş Yapınız.');
        return <Navigate to="/giris" state={{ from: location }} replace />;
    }


    return (
        <div>
            <HeaderComponent title='Kategoriler' />
            <MenuComponent />
            <form onSubmit={submitForm} className='container mt-5'>
                <div className='form-group row justify-content-center'>

                    <div className="mb-3 col-4">
                        <label htmlFor="categoryName" className="form-label">Kategori Adı</label>
                        <input type="text" id='categoryName' className='form-control'
                            placeholder='Yeni Kategori'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="mb-3 col-4">
                        <label htmlFor="gelirGider" className="form-label">Gelir/Gider</label>
                        <select className='form-control' id='gelirGider'
                            value={type}
                            onChange={(e) => setType(e.target.value)} >
                            <option value="1" className='bg-success'>Gelir</option>
                            <option value="0" className='bg-danger'>Gider</option>
                        </select>
                    </div>

                    <div className="mb-3 col-4">
                        <label htmlFor="btn-submit" className="form-label">Gelir/Gider</label><br />
                        <button type='submit' id='btn-submit' className='btn btn-primary'>Yeni Ekle</button>
                    </div>
                </div>
            </form>
            <div className='container'>
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
            </div>
            <FooterComponent />
        </div >
    );
};

export default CategoryPage;