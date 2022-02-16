import React from 'react';

export interface IHeaderComponentProps { title: string };

const HeaderComponent: React.FunctionComponent<IHeaderComponentProps> = props => {
    return <div className='bg-dark text-white p-5 text-center h2'>{props.title}</div>;
};

export default HeaderComponent;