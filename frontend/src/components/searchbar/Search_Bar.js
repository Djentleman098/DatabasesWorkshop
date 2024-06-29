import React, {useState, useEffect} from 'react';
import Results_Component from '../textresults/Results_Component';
import utils from '../../Utils';
const util = utils();

const Search_Bar = ({searchType, setSearchType, searchInText, setSearchInText, textToSearch, setTextToSearch, search, setSearch, updateSearch}) => {

    // state that saves the index to search
    const [indexToSearch, setIndexToSearch] = useState({
        x: '',
        y: ''
    });
    // state that saves the search results
    const [results, setResults] = useState(null);

    // handles the type of search
    const handleSelectSearchType = (e) => {
        setSearchType(e.target.value);
        setTextToSearch('');
        setIndexToSearch({x: '', y: ''});
        setSearch(false);
    };

    // sets the text that needs to be searched for
    const handleTextToSearch = (e) => {
        setTextToSearch(e.target.value);
    };

    // sets the index to search
    const handleIndexSearch = (e) => {
        const { name, value } = e.target;
        setIndexToSearch(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // sets where to look in text search - all/metadata/text
    const handleSelectTextSearch = (e) => {
        setSearchInText(e.target.value);
        setSearch(false);
    };

    // activate the search when update is changed - from the expression view
    useEffect(() => {
        handleSearch(false);
    }, [updateSearch]);

    // handles the search action
    const handleSearch = async (all) => {
        let res;
        if (searchType === "Text"){
            if (all) {
                res = await util.searchText('Full', '');
            } else {
                res = await util.searchText(searchInText, textToSearch);
            }
        } else if (searchType === "R&C"){
            res = await util.searchText('R&C', indexToSearch);
        } else {
            res = await util.searchText('P&L', indexToSearch);
        }
        // save the results
        if (res.TEXT_ID.length === 0)
            setResults(null);
        else
            setResults(res.TEXT_ID);
        setSearch(true);
    };

    // resets the search
    const handleClearSearch = () => {
        setSearchType('Text');
        setSearchInText('All');
        setTextToSearch('');
        setSearch(false);
    };

    return (
        <div>
            <label>
                How to Search? 
                <select id=""
                onChange={handleSelectSearchType}>
                <option value="Text">Text</option>
                <option value="R&C">Rows and Columns</option>
                <option value="P&L">Paragraphs and Rows</option>
                </select>
            </label>
            {searchType === "Text" && <p>You can search with free text.</p>}
            {searchType === "R&C" && <p>You can search a word in a specific row in the text and position in that row.</p>}
            {searchType === "P&L" && <p>You can search a line of words in a specific paragraph in the text and line in that paragraph.</p>}
            {searchType === "Text" && 
            <textarea value={textToSearch} placeholder="Search!" cols="40" onChange={handleTextToSearch}></textarea>}
            {searchType === "R&C" && 
            <div>
            <input name="x" type="number" min="0" placeholder="Row" onChange={handleIndexSearch}></input>
            <input name="y" type="number" min="0" placeholder="Column" onChange={handleIndexSearch}></input>
            </div>}
            {searchType === "P&L" && 
            <div>
            <input name="x" type="number" min="0" placeholder="Paragraph" onChange={handleIndexSearch}></input>
            <input name="y" type="number" min="0" placeholder="Line" onChange={handleIndexSearch}></input>                
            </div>}
            {searchType === "Text" && 
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
            </div>}
            {searchType === 'Text' && searchInText === 'Texts' && <p>In Only Texts, the search will be in the content of the texts. </p>}
            {searchType === 'Text' && searchInText === 'Metadata' && <p>In Only Metadata, the search will be in all the metadata values. The search will find metadata value with the exact value as the search.</p>}
            {searchType === 'Text' && searchInText === 'All' && <p>In All, the search will be in Texts content or the Metadata exact value.</p>}
            {searchType !== 'Text' && <br/>}
            <button onClick={() => handleSearch(false)}>Search</button>
            <button onClick={() => handleSearch(true)}>View Full Texts List</button>
            <button onClick={handleClearSearch}>Clear</button>
            {search && results === null && <p>No Results!</p>}
            {search && results !== null && <Results_Component searchType={searchType} results={results} indexToSearch={indexToSearch} searchLocation={searchInText} searchValue={textToSearch}/>}
        </div>
    );
}
export default Search_Bar;