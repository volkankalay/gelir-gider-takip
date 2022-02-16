import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CategoryPage from './pages/user/Category';
import ExpensePage from './pages/user/Expense';
import UserMainPage from './pages/user/UserMain';


export interface IAppProps { };

const App: React.FunctionComponent<IAppProps> = props => {

  const [userToken, setUserToken] = React.useState(
    sessionStorage.getItem('userToken') || ''
  );

  return <BrowserRouter>
    <Routes>

      <Route path='/' element={<HomePage />} />
      <Route path='/giris' element={<LoginPage />} />
      <Route path='/kayit-ol' element={<RegisterPage />} />


      <Route path='/kullanici' element={<UserMainPage />} />

      <Route path='/kategoriler' element={<CategoryPage />} />

      <Route path='/gelir-gider' element={<ExpensePage />} />


    </Routes>
  </BrowserRouter >;
};
export default App;