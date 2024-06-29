import React, {useState, useEffect} from 'react';
import './Text_Component.css';
import Context_Modal from './Context_Modal';
import utils from '../../Utils';
const util = utils();

const Text_Component = ({textId, searchType, indexToSearch, searchLocation, searchValue, selectAll, onAddTextId, onRemoveTextId, words}) => {

    // state that saves the current text data
    const [textData, setTextData] = useState(null);
    // state that saves the stats for texts
    const [textStats, setTextStats] = useState(null);
    // state that saves if the selector to view words is checked
    const [viewWords, setViewWords] = useState(true);
    // controlls the modal open state for the context modal
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);

    // use effect hook to retrieve the text data from the db
    useEffect(() => {
        const fetchData = async () => {
            // get the text
            const fetchText = await util.getTextMetaData(textId);
            setTextData(fetchText);
            // get the stats
            const fetchStats = await util.getStatistics(textId);
            setTextStats(fetchStats);
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
    
    return (
        <div>
            <p>Results:</p>
            {textData !== null &&
            <div className="text-container">
                <input type="checkbox" id={textId} checked={viewWords} onChange={() => handleCheckboxChange(textId)} />
                <label for={textId}>Select to view words</label>
                <br/>
                <p>ID: {textData.TEXT_ID[0]}</p>
                <p>Type: {textData.TYPE[0]}</p>
                {textData.METADATA_OPTION_NAME &&
                <div className="text-metadata">
                    <p>Metadata</p>
                    {textData.METADATA_OPTION_NAME.map((metadata, index) => (
                        <p key={index}>
                            {metadata}: {(searchLocation === 'Metadata' || searchLocation === 'All') && textData.METADATA_VALUE[index] === searchValue
                                ? <label style={{backgroundColor: "orange"}}>{textData.METADATA_VALUE[index]}</label>
                                : <label>{textData.METADATA_VALUE[index]}</label>}
                        </p>
                    ))}
                </div>}
                {textStats && 
                <div>
                    <p>{'Total Words In Text: ' + textStats.WORD_COUNT}</p>
                    <p>{'Average Amount of words in Row: ' + textStats.AVG_ROW}</p>
                    <p>{'Most Popular Word In Text: ' + textStats.TOP_WORD}</p>
                </div>}
                <br/>
                <button onClick={() => setIsContextModalOpen(true)}>View Result in Text Context</button>
                <Context_Modal isModalOpen={isContextModalOpen} setIsModalOpen={setIsContextModalOpen} textId={textId} searchType={searchType} indexToSearch={indexToSearch} searchLocation={searchLocation} searchValue={searchValue}/>
            </div>}
        </div>
    );
}
export default Text_Component;