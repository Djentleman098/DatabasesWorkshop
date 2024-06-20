import React, {useState, useEffect} from 'react';
import Text_Component from './Text_Component';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import utils from '../../Utils';
const util = utils();

const Results_Component = ({results, searchLocation, searchValue}) => {

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

    return (
        <div>
            <button onClick={handleViewWords}>View Words</button>
            <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}>
                <Box sx={{height: '80%', width: '80%', position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', bgcolor: '#525659', color: 'white', overflowY: 'auto'}}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Text ID</TableCell>
                                    <TableCell align="right">Word</TableCell>
                                    <TableCell align="right">Word Row</TableCell>
                                    <TableCell align="right">Word Column</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {words.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                    {row.TEXT_ID}
                                    </TableCell>
                                    <TableCell align="right">{row.WORD}</TableCell>
                                    <TableCell align="right">{row.WORD_ROW}</TableCell>
                                    <TableCell align="right">{row.WORD_COLUMN}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
            <button onClick={handleSelectTexts}>{selectAll ? "Deselect All" : "Select All"}</button>
            {results.map((result) => (
                <Text_Component 
                textId={result} 
                searchLocation={searchLocation} 
                searchValue={searchValue} 
                selectAll={selectAll}
                onAddTextId={handleAddTextId}
                onRemoveTextId={handleRemoveTextId}/>))}
        </div>
    );
}
export default Results_Component;