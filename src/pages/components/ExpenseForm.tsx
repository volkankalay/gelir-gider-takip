import axios from 'axios';
import React, { useState } from 'react';

export interface IExpenseFormComponentProps { };

const ExpenseFormComponent: React.FunctionComponent = () => {

    const [input, setInput] = useState("");


    const onInputChange = (event: { target: { value: string; }; }) => {
        setInput(event.target.value);
    }

    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('1');
    const [userToken, setUserToken] = React.useState(
        sessionStorage.getItem('userToken') || ''
    );
    const [currencies, setCurrencies] = useState([]);

    const addExpense = async (name: string, currency: string) => {
        try {

            if (name != '' && currency != null) {

                const { data } = await axios.post("http://192.168.1.100/api/v1/Expense", {
                    name: name,
                    is_income: currency
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
            await axios.get("http://192.168.1.100/api/v1/currencies",
                {
                    headers: {
                        Authorization: `Bearer ` + JSON.parse(userToken)
                    }
                }).then((res) => {
                    setCurrencies(res.data);
                    console.log(currencies);
                });
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addExpense(name, currency);
        setName("");
    }

    React.useEffect(() => {
        getCurrencies();
    }, []);

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
                    <label htmlFor="gelirGider" className="form-label">Para Birimi</label>
                    <select className='form-control' id='gelirGider'
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)} >
                        {currencies.map(({ id, name, code }: any) => <option key={id} value={id}>
                            [{code}] - {name}
                        </option>
                        )
                        }

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

export default ExpenseFormComponent;
