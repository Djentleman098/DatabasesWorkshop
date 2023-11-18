import React from 'react';
import Searchbar from '../components/searchbar/Searchbar';

const Home = () => {

    // basic search logic
    const basicSearch = () => {
        console.log('Basic search');
    };
    // advanced search logic
    const advancedSearch = () => {
        console.log('Advanced search');
    };
    // last searches logic
    const lastSearch = () => {
        console.log('Last search');
    };

    return (
        <div>
            <Searchbar onSearch={basicSearch} onAdvancedSearch={advancedSearch} onLastSearch={lastSearch}/>
        </div>
    );
};

export default Home;