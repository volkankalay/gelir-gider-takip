import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ExpenseType } from '../../../types';
import FooterComponent from '../components/Footer';
import HeaderComponent from '../components/Header';
import MenuComponent from '../components/Menu';
import * as AuthService from '../../services/AuthService';
import moment from 'moment';
import * as xml2js from 'xml2js';

export interface IExpensePageProps { };

const ExpensePage: React.FunctionComponent<IExpensePageProps> = props => {

    const [expenses, setExpenses] = React.useState([]);
    const [recoverExpenses, setRecoverExpenses] = React.useState([]);


    const [refresh, setRefresh] = React.useState(true);

    const [date, setDate] = useState(moment(Date.now()).format('YYYY-MM-DD'));
    const [amount, setAmount] = useState('0.00');
    const [currency, setCurrency] = useState('1');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const [USD_TCMB, setUSD] = useState(10.27);
    const [EURO_TCMB, setEURO] = useState(11.64);


    const [showUpdateBtn, setshowUpdateBtn] = useState(false);
    const [UpdateId, setUpdateId] = useState(0);

    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');

    const [showTotal, setShowTotal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);


    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = React.useState([]);

    const addExpense = async (date: string, amount: string, currency: string, category: string, description: string) => {
        try {
            console.log('date', date,)
            console.log('amount', amount,)
            console.log('currency', currency,)
            console.log('category', category,)
            console.log('description', description,)
            
            if (date && currency != null && amount != null && (parseFloat(amount) > 0) && (category != '')) {

                const { data } = await axios.post(AuthService.API_URL + "expense", {
                    transaction_date: date,
                    amount: amount,
                    currency_id: currency,
                    category_id: category,
                    description: description,
                },
                    {
                        headers: {
                            Authorization: `Bearer ` + AuthService.getCurrentToken()
                        }
                    });
            } else {
                alert('Hatalı Veri.');
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    const getCurrencies = async () => {
        try {
            await axios.get(AuthService.API_URL + "currencies",
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken()
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
            const data = await axios.get(AuthService.API_URL + 'category',
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken()
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    setCategories(res.data);
                    if(res.data.length > 0){
                        setCategory(res.data[0].id);
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
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (UpdateId != 0) {
            updateExpense(UpdateId, date, amount, currency, category, description);
        } else {
            addExpense(date, amount, currency, category, description);
        }
        setAmount('0');
        setDescription('');
        setDate('');
        setRefresh(true);
        setUpdateId(0);
        setshowUpdateBtn(false);
    }

    React.useEffect(() => {
        getCurrencies();
        getCategories();
    }, []);


    React.useEffect(() => {
        if (refresh) {
            getExpenses();
            setTimeout(() => {
                setRefresh(false);
            }, 200);
        }
    });

    const getExpenses = async () => {
        try {
            const data = await axios.get(AuthService.API_URL + 'expense',
                {
                    headers: {
                        Authorization: `Bearer ` + AuthService.getCurrentToken()
                    }
                })
                .then((res) => {
                    setExpenses(res.data);
                    setRecoverExpenses(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const updateExpense = async (id: number, date: string, amount: string, currency: string, category: string, description: string) => {

        try {

            if (date && currency != null && amount != null && (parseFloat(amount) > 0)) {
                const { data } = await axios.put(AuthService.API_URL + "expense/" + id, {
                    transaction_date: date,
                    amount: amount,
                    currency_id: currency,
                    category_id: category,
                    description: description,
                },
                    {
                        headers: {
                            Authorization: `Bearer ` + AuthService.getCurrentToken()
                        }
                    }).then(res => res.data);

            } else {
                alert('Hatalı Veri.');
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    const updateExpenseBtn = (id: number) => {
        let updatingRecord = JSON.parse(JSON.stringify(recoverExpenses.filter((a: ExpenseType) => a.id == id)));
        setshowUpdateBtn(true);
        setUpdateId(updatingRecord[0].id);
        setCategory(updatingRecord[0].category_id);
        setCurrency(updatingRecord[0].currency_id);
        setAmount(updatingRecord[0].amount);
        setDescription(updatingRecord[0].description);
        setDate(moment(updatingRecord[0].transaction_date).format('YYYY-MM-DD'));
    }

    const cancelUpdate = () => {
        setshowUpdateBtn(false);
        setUpdateId(0);
        setAmount('0');
        setDescription('');
        setDate('');
    }
    const deleteExpense = async (id: number) => {
        try {
            const data = await axios.delete(AuthService.API_URL + 'expense/' + id,
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
    const [sortType, setSortType] = useState(1);

    const sortByAmount = () => {
        const tempExpenses = expenses;
        if (sortType) {
            const sorting = tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (parseFloat(a.amount) > parseFloat(b.amount)) ? 1 : -1);
            setExpenses(sorting);
            setSortType(0);
        } else {
            const sorting = tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (parseFloat(a.amount) < parseFloat(b.amount)) ? 1 : -1);
            setExpenses(sorting);
            setSortType(1);
        }
    }

    const sortByDate = () => {
        const tempExpenses = expenses;
        if (sortType) {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.transaction_date > b.transaction_date) ? 1 : -1));
            setSortType(0);
        } else {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.transaction_date < b.transaction_date) ? 1 : -1));
            setSortType(1);
        }
    }

    const sortByCurrency = () => {
        const tempExpenses = expenses;
        if (sortType) {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.currency.code > b.currency.code) ? 1 : -1));
            setSortType(0);
        } else {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.currency.code < b.currency.code) ? 1 : -1));
            setSortType(1);
        }
    }

    const sortByCategory = () => {
        const tempExpenses = expenses;
        if (sortType) {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.category.name > b.category.name) ? 1 : -1));
            setSortType(0);
        } else {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.category.name < b.category.name) ? 1 : -1));
            setSortType(1);
        }
    }

    const sortByCategoryType = () => {
        const tempExpenses = expenses;
        if (sortType) {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.category.is_income > b.category.is_income) ? 1 : -1));
            setSortType(0);
        } else {
            setExpenses(tempExpenses.sort((a: ExpenseType, b: ExpenseType) => (a.category.is_income < b.category.is_income) ? 1 : -1));
            setSortType(1);
        }
    }

    const CategoryFilter = (text: string) => {
        setExpenses(recoverExpenses);
        setExpenses(recoverExpenses.filter((a: ExpenseType) => a.category.name.toLowerCase().includes(text.toLowerCase())));
    }

    const AmountFilter = (text: string) => {
        setExpenses(recoverExpenses);
        setExpenses(recoverExpenses.filter((a: ExpenseType) => a.amount.toLowerCase().includes(text.toLowerCase())));
    }

    const DateFilter = () => {
        if (StartDate && EndDate) {

            setExpenses(recoverExpenses);
            let endDateFix = moment(EndDate).add(1, 'days').subtract(1, 'milliseconds').format('YYYY-MM-DD H:m:s');
            setExpenses(recoverExpenses.filter((a: ExpenseType) => a.transaction_date >= StartDate && a.transaction_date <= endDateFix));

            var TRYTotalRevenue = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'TRY' && y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var TRYTotalExpense = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'TRY' && !y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var TRYTotal = TRYTotalRevenue - TRYTotalExpense;

            var USDTotalRevenue = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'USD' && y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var USDTotalExpense = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'USD' && !y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var USDTotal = USDTotalRevenue - USDTotalExpense;

            var EURTotalRevenue = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'EUR' && y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var EURTotalExpense = expenses.reduce((x: number, y: ExpenseType) => (y.currency.code == 'EUR' && !y.category.is_income) ? x + parseFloat(y.amount) : x, 0);
            var EURTotal = EURTotalRevenue - EURTotalExpense;

            setTotalAmount(TRYTotal + USDTotal * USD_TCMB + EURTotal * EURO_TCMB);
            setShowTotal(true);
        }
    }


    const CurrencyFilter = (text: string) => {
        setExpenses(recoverExpenses);
        setExpenses(recoverExpenses.filter((a: ExpenseType) => a.currency.code.toLowerCase().includes(text.toLowerCase()) || a.currency.name.toLowerCase().includes(text.toLowerCase())));
    }

    const DescriptionFilter = (text: string) => {
        setExpenses(recoverExpenses);
        setExpenses(recoverExpenses.filter((a: ExpenseType) => a.description != null && a.description.toLowerCase().includes(text.toLowerCase())));
    }


    const CategoryTypeFilter = (text: string) => {
        setExpenses(recoverExpenses);
        if (text == '1') {
            setExpenses(recoverExpenses.filter((a: ExpenseType) => (a.category.is_income) == true));
        } else if (text == '0') {
            setExpenses(recoverExpenses.filter((a: ExpenseType) => (a.category.is_income) == false));
        } else {
            setExpenses(recoverExpenses);
        }
    }


    let location = useLocation();
    const navigation = useNavigate();

    if (!AuthService.getCurrentToken()) {
        alert('Giriş Yapınız.');
        return <Navigate to="/giris" state={{ from: location }} replace />;
    }




    return (
        <div>
            <HeaderComponent title='Gelir Gider' />
            <MenuComponent />
            <form onSubmit={submitForm} className='container mt-5'>
                <div className='form-group row justify-content-center'>


                    <div className="mb-3 col-4">
                        <label htmlFor="kategori" className="form-label">Kategori</label>
                        <select className='form-control' id='kategori'
                            value={category}
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
                            placeholder='0.00'
                            value={amount}
                            required
                            onChange={(e) => setAmount(e.target.value)} />
                    </div>

                    <div className="mb-3 col-4">
                        <label htmlFor="islemTarihi" className="form-label">İşlem Tarihi</label>
                        <input type="date" id='islemTarihi' className='form-control'
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="mb-3 col-4">
                        <label htmlFor="aciklama" className="form-label">Açıklama</label>
                        <input type="text" id='aciklama' className='form-control'
                            placeholder='Açıklama'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>


                    <div className="mb-3 col-4">
                        <label htmlFor="btn-submit" className="form-label">Gelir/Gider</label><br />
                        {showUpdateBtn ? (
                            <>
                                <button type='submit' id='btn-submit-update' className='btn btn-secondary'>Güncelleştir</button>
                                <button type='button' id='btn-submit-cancel' className='btn btn-danger' onClick={() => cancelUpdate()}>İptal Et</button>
                            </>
                        ) : (
                            <button type='submit' id='btn-submit' className='btn btn-primary'>Yeni Ekle</button>
                        )}
                    </div>
                </div>
            </form>

            {showTotal ? (
                <div className='text-center bg-light py-4'>
                    <h4>{moment(StartDate).format('DD/MM/YYYY')} - {moment(EndDate).format('DD/MM/YYYY')} Tarihleri arasında Toplam : <span className='text-primary'>{totalAmount.toFixed(2)} TRY</span></h4>
                    <div className='text-primary fw-bold'>USD: {USD_TCMB} - EUR: {EURO_TCMB}</div>
                </div>
            ) : (
                null
            )}
            <div className='mx-3'>
                <div>
                    <table className='table table-hover mt-4 table-bordered'>
                        <thead className=' table-dark bg-dark'>
                            <tr className='text-center'>
                                <th onClick={() => { sortByCategory() }}>Kategori</th>
                                <th onClick={() => { sortByCategoryType() }}>Türü</th>
                                <th onClick={() => { sortByDate() }}>Tarih</th>
                                <th onClick={() => { sortByAmount() }}>Tutar</th>
                                <th onClick={() => { sortByCurrency() }}>Para Birimi</th>
                                <th>Açıklama</th>
                                <th colSpan={2} rowSpan={2} className='text-center align-middle'>İşlem</th>
                            </tr>
                            <tr>
                                <th>
                                    <input placeholder='Kategori Arama' className='form-control' type={'text'} onChange={(e) => CategoryFilter(e.target.value)} />
                                </th>
                                <th>
                                    <select onChange={(e) => CategoryTypeFilter(e.target.value)} className='form-control'>
                                        <option value={-1}>Tümü</option>
                                        <option value={1}>Gelir</option>
                                        <option value={0}>Gider</option>
                                    </select>
                                </th>
                                <th>
                                    <div className='input-group'>

                                        <input className='form-control my-1' type={'date'} value={StartDate} onChange={(event) => {
                                            setStartDate(event.target.value)
                                        }} />

                                        <input className='form-control my-1' type={'date'} value={EndDate} onChange={(event) => {
                                            setEndDate(event.target.value)
                                        }} />

                                        <button type={'button'} className='btn btn-secondary my-1' onClick={() => {
                                            setStartDate('');
                                            setEndDate('');
                                            setExpenses(recoverExpenses);
                                            setShowTotal(false);
                                        }}>Temizle</button>

                                        <button type={'button'} className='btn btn-primary my-1' onClick={() => DateFilter()}>Ara</button>

                                    </div>
                                </th>
                                <th>
                                    <input placeholder='Miktar Arama' className='form-control' type={'text'} onChange={(e) => AmountFilter(e.target.value)} />
                                </th>
                                <th>
                                    <input placeholder='Kur Arama' className='form-control' type={'text'} onChange={(e) => CurrencyFilter(e.target.value)} />
                                </th>
                                <th>
                                    <input placeholder='Açıklama Arama' className='form-control' type={'text'} onChange={(e) => DescriptionFilter(e.target.value)} />
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {expenses
                                .map(({ id, transaction_date, amount, currency_id, category_id, description, category, currency }: ExpenseType) => <tr key={id}>
                                    <td>{category.name}</td>
                                    {category.is_income ? (
                                        <td className='bg-success text-light font-weight-bolder'>Gelir</td>) : (
                                        <td className='bg-danger text-light font-weight-bolder'>Gider</td>
                                    )}

                                    <td>{moment(transaction_date).format('DD/MM/YYYY')}</td>
                                    <td>{amount}</td>
                                    <td><span className='fw-bold'>[{currency.code}]</span> {currency.name}</td>
                                    <td>{description}</td>

                                    <td className='text-center'>
                                        <div className='btn btn-primary' onClick={() => updateExpenseBtn(id)}>Düzenle</div>
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

            </div>
            <FooterComponent />
        </div >
    );
};

export default ExpensePage;