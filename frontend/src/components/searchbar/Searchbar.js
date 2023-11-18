import React, {useState} from 'react';
import Advancedsearch from './Advancedsearch';
import Lastsearch from './Lastsearch';

const Searchbar = ({onSearch, onAdvancedSearch, onLastSearch}) => {

    const [query, setQuery] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showLastSearch, setShowLastSearch] = useState(false);

    // handle search button click
    const handleSearch = () => {
        onSearch(query);
    };
    // handle advanced search button click -> show the advanced search menu
    const handleToggleAdvancedSearch = () => {
        setShowAdvancedSearch(!showAdvancedSearch);
    };
    // handle the last search button click -> show the last searches (saved on the DB)
    const handleToggleLastSearch = () => {
        setShowLastSearch(!showLastSearch);
    };

    return (
        <div>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleToggleAdvancedSearch}>Advanced Search</button>
            <button onClick={handleToggleLastSearch}>Last Search</button>
            {showAdvancedSearch && <Advancedsearch onAdvancedSearch={onAdvancedSearch} />}
            {showLastSearch && <Lastsearch onLastSearch={onLastSearch} />}
        </div>
    );
};

export default Searchbar;