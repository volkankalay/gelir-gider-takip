import React from 'react';

export interface IFooterComponentProps { };

const FooterComponent: React.FunctionComponent<IFooterComponentProps> = props => {
    const user = JSON.parse(`${sessionStorage.getItem("user")}`)
    return <footer className="footer mt-auto py-4 bg-light">
        <div className="container">
            <div className='text-center'> {user.email} kullanıcısı ile işlem yapıyorsunuz.</div>
        </div>
    </footer>
};

export default FooterComponent;