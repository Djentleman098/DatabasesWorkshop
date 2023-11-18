import React, {useState} from 'react';

const Lastsearch = ({onLastSearch}) => {

    const [lastSearchQuery, setLastSearchQuery] = useState('');

    // handle last search button click
    const handleAdvancedState = () => {
        onLastSearch(lastSearchQuery);
    }

    return (
        <div>
            <p>Latest Searches</p>
        </div>
    );
};

export default Lastsearch;