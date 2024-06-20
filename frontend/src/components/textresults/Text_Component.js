import React, {useState, useEffect} from 'react';
import './Text_Component.css';
import utils from '../../Utils';
const util = utils();

const Text_Component = ({textId, searchLocation, searchValue, selectAll, onAddTextId, onRemoveTextId}) => {

    // state that saves the current text data
    const [textData, setTextData] = useState(null);

    // state that saves if the selector to view words is checked
    const [viewWords, setViewWords] = useState(true);

    // use effect hook to retrieve the text data from the db
    useEffect(() => {
        const fetchData = async () => {
            // get the text
            const fetchText = await util.getTextData(textId);
            setTextData(fetchText);
        };
        fetchData();
    }, [textId]);

    // use effect hook to update if all the texts are selected or deselected from the results component
    useEffect(() => {
        setViewWords(selectAll);
    }, [selectAll]);

    // function to handle checkbox change and pass the prop to the results component
    const handleCheckboxChange = () => {
        if (viewWords) {
            onRemoveTextId(textId);
        } else {
            onAddTextId(textId);
        }
        setViewWords(!viewWords);
    };

    // view the searched expression in the text
    const handleViewSearch = () => {
        
    };
    
    return (
        <div>
            {textData !== null &&
            <div className="text-container">
                <p>ID: {textData.TEXT_ID[0]}</p>
                <p>Type: {textData.TYPE[0]}</p>
                {textData.METADATA_OPTION_NAME &&
                <div className="text-metadata">
                    <p>Metadata:</p>
                    {textData.METADATA_OPTION_NAME.map((metadata, index) => (
                    <p key={index}>{metadata}: {textData.METADATA_VALUE[index]}</p>))}
                </div>}
                <button onClick={handleViewSearch}>View Searched value</button>
                <input type="checkbox" id={textId} checked={viewWords} onChange={() => handleCheckboxChange(textId)} />
                <label for={textId}>Select to view words</label>
            </div>}
        </div>
    );
}
export default Text_Component;