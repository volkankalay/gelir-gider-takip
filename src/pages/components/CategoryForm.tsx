import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as AuthService from '../../services/AuthService';

export interface ICategoryFormComponentProps { };

const CategoryFormComponent: React.FunctionComponent = () => {

    const [input, setInput] = useState("");


    const onInputChange = (event: { target: { value: string; }; }) => {
        setInput(event.target.value);
    }

    const [name, setName] = useState('');
    const [type, setType] = useState('1');
    const addCategory = async (name: string, type: string) => {
        try {

            if (name != '' && type != null) {

                const { data } = await axios.post("http://192.168.1.100/api/v1/category", {
                    name: name,
                    is_income: type
                },
                    {
                        headers: {
                            Authorization: `Bearer ` + AuthService.getCurrentToken()
                        }
                    });

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
        setName("");
    }

    return (
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
    );
};

export default CategoryFormComponent;
