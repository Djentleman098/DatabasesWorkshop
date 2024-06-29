import React, {useState, useEffect} from 'react';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import utils from '../../../Utils';
const util = utils();

const Word_Group_Modal = ({isModalOpen, setIsModalOpen, group, groupUpdate, groupSetUpdate}) => {

    // state to save the group data
    const [groupData, setGroupData] = useState([]);
    // state to save the word to add
    const [newWord, setNewWord] = useState('');
    // update state after edit
    const [update, setUpdate] = useState(false);

    // use effect hook to retrieve the group data
    useEffect(() => {
        const fetchData = async () => {
            // get the data
            const fetchGroupData = await util.fetchGroupElements(group);
            setGroupData(fetchGroupData || []);
        };
        fetchData();
    }, [group, update]);

    // set the new word
    const handleSetWord = (e) => {
        setNewWord(e.target.value);
    };

    // add a new word to the group
    const handleAddWord = () => {
        if (newWord === ''){
            alert('Please Enter a word');
            return;
        }
        util.addGroupElement('Words', group, newWord);
        setNewWord('');
        setUpdate(!update);
        groupSetUpdate(!groupUpdate);
    };

    // download the group as excel
    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(groupData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Group Data');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `Group_${group}_Data.xlsx`);
    };

    // remove a word from the group
    const handleRemoveWord = (word) => {
        util.removeGroupElement('Words', group, word);
        setUpdate(!update);
        groupSetUpdate(!groupUpdate);
    };

    return (
        <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
            <Box sx={{height: '80%', width: '80%', position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', bgcolor: '#525659', color: 'white', overflowY: 'auto'}}>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                <br/>
                <input type="text" placeholder="Word" cols="10" value={newWord} onChange={handleSetWord}/>
                <button onClick={handleAddWord}>Add Word</button>
                <br/>
                <button onClick={handleDownload}>Download</button>
                {groupData.length === 0 ? (<p>No Words In This Group</p>)
                : (<TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Group Index</TableCell>
                                <TableCell>Word</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.INDEX}</TableCell>
                                <TableCell>{row.ELEMENT}</TableCell>
                                <button onClick={() => handleRemoveWord(row.ID)}>Remove Word</button>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)}
            </Box>
        </Modal>
    );
}
export default Word_Group_Modal;