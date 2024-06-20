import React, {useState, useEffect} from 'react';
import Results_Component from '../textresults/Results_Component';
import utils from '../../Utils';
const util = utils();

const Search_Bar = () => {

    // state that saves where to search in the text
    const [searchInText, setSearchInText] = useState('All');
    // state that saves the text to serch
    const [textToSearch, setTextToSearch] = useState('');
    // state to save if a search was activated
    const [search, setSearch] = useState(false);
    // state that saves the search results
    const [results, setResults] = useState(null);

    // handle the text needed to be searched
    const handleTextToSearch = (e) => {
        setTextToSearch(e.target.value);
    };

    // handle the select text search selector
    const handleSelectTextSearch = (e) => {
        setSearchInText(e.target.value);
    };

    // handles the search action
    const handleSearch = async (all) => {
        let res;
        if (all) {
            res = await util.searchText('Full', '');
        } else {
            res = await util.searchText(searchInText, textToSearch);
        }
        // save the results
        if (res.TEXT_ID.length === 0)
            setResults(null);
        else
            setResults(res.TEXT_ID);
        setSearch(true);
    };

    return (
        <div>
            <textarea placeholder="Search!" cols="40" onChange={handleTextToSearch}></textarea>
            <div>
                <label>
                    Where to search? 
                    <select id=""
                    onChange={handleSelectTextSearch}>
                    <option value="All">All</option>
                    <option value="Texts">Only Texts</option>
                    <option value="Metadata">Only Metadata</option>
                    </select>
                </label>
            </div>
            {searchInText === 'Texts' && <p>In Only Texts, the search will be in the content of the texts. </p>}
            {searchInText === 'Metadata' && <p>In Only Metadata, the search will be in all the metadata values. The search will find metadata value with the exact value as the search.</p>}
            {searchInText === 'All' && <p>In All, the search will be in Texts content or the Metadata exact value.</p>}
            <button onClick={() => handleSearch(false)}>Search</button>
            <button onClick={() => handleSearch(true)}>View All Texts</button>
            {search && results === null && <p>No Results!</p>}
            {search && results !== null && <Results_Component results={results} searchLocation={searchInText} searchValue={textToSearch}/>}
        </div>
    );
}
export default Search_Bar;