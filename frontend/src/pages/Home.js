import React from 'react';
import Search_Bar from '../components/searchbar/Search_Bar';

const Home = ({searchType, setSearchType, searchInText, setSearchInText, textToSearch, setTextToSearch, search, setSearch, updateSearch}) => {


    return (
        <div>
            <h1>Welcome Aboard!</h1>
            <Search_Bar searchType={searchType} setSearchType={setSearchType} searchInText={searchInText} setSearchInText={setSearchInText} textToSearch={textToSearch} setTextToSearch={setTextToSearch} search={search} setSearch={setSearch} updateSearch={updateSearch}/>
        </div>
    );
};

export default Home;