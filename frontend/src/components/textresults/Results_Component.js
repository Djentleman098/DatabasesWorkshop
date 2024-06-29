import React, {useState, useEffect} from 'react';
import Text_Component from './Text_Component';
import Words_Modal from './Words_Modal';
import utils from '../../Utils';
const util = utils();

const Results_Component = ({searchType, results, indexToSearch, searchLocation, searchValue}) => {

    // state to handle select all functionallity
    const [selectAll, setSelectAll] = useState(true);
    // state that saves the current selected texts
    const [selectedTexts, setSelectedTexts] = useState([]);
    // controlls the modal open state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // controlls the words list
    const [words, setWords] = useState([]);

    // sets all the results to the selected texts array initially and on change
    useEffect(() => {
        setSelectedTexts(results);
    }, [results]);

    // select or deselect all the texts that are available
    const handleSelectTexts = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedTexts(results);
        } else {
            setSelectedTexts([]);
        }
    };

    // add text if it was selected
    const handleAddTextId = (textId) => {
        setSelectedTexts(prevSelectedTexts => [...prevSelectedTexts, textId]);
    };

    // removes text if it was deselected
    const handleRemoveTextId = (textId) => {
        setSelectedTexts(prevSelectedTexts => prevSelectedTexts.filter(id => id !== textId));
    };

    // shows all the words of the selected texts
    const handleViewWords = async () => {
        // fetch the words from the selected texts
        const res = await util.getFullWordsDetail(selectedTexts);
        setWords(res);
        // open the modal window
        setIsModalOpen(true);
    };

    // stores the searched expression
    const handleStoreExpression = () => {
        util.addGroupElement('Expression', null, searchValue);
    };

    return (
        <div>
            <label>---------------------------------</label>
            <br />
            <button onClick={handleViewWords}>View Words</button>
            <Words_Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} words={words}/>
            <button onClick={handleSelectTexts}>{selectAll ? "Deselect All" : "Select All"}</button>
            {searchType === 'Text' && (searchLocation === 'All' || searchLocation === 'Texts') && 
                <div><br/><button onClick={handleStoreExpression}>Store Expression</button></div>}
            {results.map((result) => (
                <Text_Component 
                textId={result} 
                searchType={searchType}
                indexToSearch={indexToSearch}
                searchLocation={searchLocation} 
                searchValue={searchValue}
                selectAll={selectAll}
                onAddTextId={handleAddTextId}
                onRemoveTextId={handleRemoveTextId}/>))}
        </div>
    );
}
export default Results_Component;