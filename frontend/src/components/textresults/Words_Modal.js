import React, {useState, useEffect} from 'react';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Context_Modal from './Context_Modal';
import utils from '../../Utils';
const util = utils();

const Words_Modal = ({isModalOpen, setIsModalOpen, words}) => {

    // controlls the modal open state for the context modal
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    // saves the selected word
    const [selectedWord, setSelectedWord] = useState(null);
    // state to save the groups data
    const [groups, setGroups] = useState([]);
    // state to save the selected group
    const [selectedGroup, setSelectedGroup] = useState('');    

    // fetch all the word groups
    useEffect(() => {
        const fetchData = async () => {
            // get the groups
            const fetchGroups = await util.fetchGroups();
            setGroups(fetchGroups);
        };
        fetchData();
    }, []);

    // create the groups options to display
    let optionData = [];
    groups.length > 0 ? groups.map(group => optionData.push(group.NAME)) : optionData = [];
    const options = util.createOptions(optionData);

    // open the context of the word in the text
    const handleWordClick = (row) => {
        setSelectedWord(row);
        setIsContextModalOpen(true);
    }

    // add a word to a group
    const handleAddWordToGroup = (word) => {
        if (selectedGroup === ''){
            alert('Please select a group');
            return;
        }
        // get the group id from the group name
        const groupId = groups.find(group => group.NAME === selectedGroup);
        util.addGroupElement('Words', groupId.ID, word);
    };

    return (
        <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
            <Box sx={{height: '80%', width: '80%', position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', bgcolor: '#525659', color: 'white', overflowY: 'auto'}}>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                {words === undefined ? (<p>Nothing Selected</p>)
                : (<TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Text ID</TableCell>
                                <TableCell align="right">Word</TableCell>
                                <TableCell align="right">Row In Text</TableCell>
                                <TableCell align="right">Column In Row</TableCell>
                                <TableCell align="right">Paragraph In Text</TableCell>
                                <TableCell align="right">Line In Paragraph</TableCell>
                                <TableCell align="right">Position In Line</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
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
                                <TableCell align="right">{row.WORD_PARAGRAPH}</TableCell>
                                <TableCell align="right">{row.LINE_NUM}</TableCell>
                                <TableCell align="right">{row.WORD_LINE_POS}</TableCell>
                                <button onClick={() => handleWordClick(row)}>Context</button>
                                <select onChange={(e) => setSelectedGroup(e.target.value)}>
                                    <option value=''></option>
                                    {options}
                                </select>
                                <button onClick={() => handleAddWordToGroup(row.WORD)}>Add to Word Group</button>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)}
                {selectedWord && <Context_Modal isModalOpen={isContextModalOpen} setIsModalOpen={setIsContextModalOpen} textId={selectedWord.TEXT_ID} searchType={'Text'} indexToSearch={''} searchLocation={''} searchValue={selectedWord.WORD}/>}
            </Box>
        </Modal>
    );
}
export default Words_Modal;