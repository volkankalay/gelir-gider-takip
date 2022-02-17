import axios from 'axios';
import React, { useState } from 'react';
import * as AuthService from '../../services/AuthService';

export interface IExpenseFormComponentProps { };

const ExpenseFormComponent: React.FunctionComponent = () => {

    const API_URL = "http://192.168.1.100/api/v1/"

    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('0');
    const [currency, setCurrency] = useState('1');
    const [category, setCategory] = useState('1');
    const [description, setDescription] = useState('');


    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );
    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = React.useState([]);

    const addExpense = async (date: string, amount: string, currency: string, category: string, description: string) => {
        try {

            if (date && currency != null && amount != null) {

                const { data } = await axios.post(API_URL + "expense", {
                    transaction_date: date,
                    amount: amount,
                    currency_id: currency,
                    category_id: category,
                    description: description,
                },
                    {
                        headers: {
                            Authorization: `Bearer ` + JSON.parse(userToken)
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
    const getCurrencies = async () => {
        try {
            await axios.get(API_URL + "currencies",
                {
                    headers: {
                        Authorization: `Bearer ` + JSON.parse(userToken)
                    }
                }).then((res) => {
                    setCurrencies(res.data);
                });
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const getCategories = async () => {
        try {
            const data = await axios.get(API_URL + 'category',
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
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addExpense(date, amount, currency, category, description);
        setAmount('0');
        setDescription('');
    }

    React.useEffect(() => {
        getCurrencies();
        getCategories();
    }, []);

    return (
        <form onSubmit={submitForm} className='container mt-5'>
            <div className='form-group row justify-content-center'>


                <div className="mb-3 col-4">
                    <label htmlFor="kategori" className="form-label">Kategori</label>
                    <select className='form-control' id='kategori'
                        value={currency}
                        onChange={(e) => setCategory(e.target.value)} >

                        {
                            categories.map(({ id, name, is_income }: any) =>
                                <option key={id} value={id} >
                                    {name}
                                </option>

                            )}

                    </select>
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="paraBirimi" className="form-label">Para Birimi</label>
                    <select className='form-control' id='paraBirimi'
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)} >
                        {
                            currencies.map(({ id, name, code }: any) => <option key={id} value={id}>
                                [{code}] - {name}
                            </option>
                            )}
                    </select>
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="miktar" className="form-label">Miktar</label>
                    <input type="number" id='miktar' className='form-control'
                        placeholder='Yeni Kategori'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="islemTarihi" className="form-label">İşlem Tarihi</label>
                    <input type="datetime-local" id='islemTarihi' className='form-control'
                        placeholder='Yeni Kategori'
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="mb-3 col-4">
                    <label htmlFor="aciklama" className="form-label">Açıklama</label>
                    <input type="text" id='aciklama' className='form-control'
                        placeholder='Yeni Kategori'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </div>


                <div className="mb-3 col-4">
                    <label htmlFor="btn-submit" className="form-label">Gelir/Gider</label><br />
                    <button type='submit' id='btn-submit' className='btn btn-primary'>Yeni Ekle</button>
                </div>
            </div>
        </form>
    );
};

export default ExpenseFormComponent;
