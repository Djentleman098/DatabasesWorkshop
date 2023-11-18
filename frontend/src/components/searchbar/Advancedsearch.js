import React, {useState} from 'react';

const Advancedsearch = ({onAdvancedSearch}) => {

    const [advancedQuery, setAdvancedQuery] = useState('');

    // handle advanced search button click
    const handleAdvancedSearch = () => {
        onAdvancedSearch(advancedQuery);
    }

    return (
        <div>
            <p>Advanced Search</p>
        </div>
    );
};

export default Advancedsearch;