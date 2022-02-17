import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as AuthService from '../../services/AuthService';
import moment from 'moment';


export interface IExpenseListComponentProps { };



const ExpenseListComponent: React.FunctionComponent<IExpenseListComponentProps> = props => {

    const API_URL = "http://192.168.1.100/api/v1/expense/";

    const [expenses, setExpenses] = React.useState([]);

    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );

    useEffect(() => {
        //setTimeout(() => {
        const temp = getExpenses();
        //}, 2000);

        return () => {

        }
    }, [expenses]);

    const getExpenses = async () => {
        try {
            const data = await axios.get(API_URL,
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken()
                    }
                })
                .then((res) => {
                    setExpenses(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const updateExpense = (id: number) => {
        console.log(id);
    }

    const deleteExpense = async (id: number) => {
        try {
            const data = await axios.delete(API_URL + id,
                {
                    headers: {
                        Authorization: `Bearer ` + JSON.parse(userToken),
                        method: 'DELETE'
                    }
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
            <table className='table table-hover mt-4 table-bordered'>
                <thead className=' table-dark bg-dark'>
                    <tr>
                        <th>Kategori</th>
                        <th>Türü</th>
                        <th>Tarih</th>
                        <th>Tutar</th>
                        <th>Para Birimi</th>
                        <th>Açıklama</th>
                        <th colSpan={2} className='text-center'>İşlem</th>
                    </tr>
                </thead>

                <tbody>

                    {expenses.map(({ id, transaction_date, amount, currency_id, category_id, description, category, currency }: any) => <tr key={id}>

                        <td>{category.name}</td>
                        {category.is_income ? (
                            <td className='bg-success text-light font-weight-bolder'>Gelir</td>) : (
                            <td className='bg-danger text-light font-weight-bolder'>Gider</td>
                        )}

                        <td>{moment(transaction_date).format('YYYY/MM/DD HH:mm')}</td>
                        <td>{amount}</td>
                        <td><span className='fw-bold'>[{currency.code}]</span> {currency.name}</td>
                        <td>{description}</td>

                        <td className='text-center'>
                            <div className='btn btn-primary' onClick={() => updateExpense(id)}>Düzenle</div>
                        </td>
                        <td className='text-center'>
                            <div className='btn btn-danger' onClick={() => deleteExpense(id)}>Sil</div>
                        </td>
                    </tr>
                    )
                    }

                </tbody>


            </table>
        </div >

    );
};

export default ExpenseListComponent;