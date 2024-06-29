import React, {useState, useEffect} from 'react';
import { Modal, Box } from '@mui/material';
import utils from '../../Utils';
const util = utils();

const Context_Modal = ({isModalOpen, setIsModalOpen, textId, searchType, indexToSearch, searchLocation, searchValue}) => {

    // state that saves the full text
    const [fullText, setFullText] = useState({});

    // fetch the full text from the id
    useEffect(() => {
        const fetchData = async () => {
            // get the text
            if (searchType === 'Text'){
                const fetchText = await util.getFullText(textId);
                setFullText(fetchText);
            } else {
                const fetchText = await util.getTextIndex(textId, searchType, indexToSearch.x, indexToSearch.y);
                setFullText(fetchText);
            }
        };
        fetchData();
    }, [textId]);

    const dataToDisplay = () => {
        if (searchType === 'Text') {
            if (searchLocation === 'Metadata'){
                return(<p style={{ whiteSpace: 'pre-wrap' }}>{fullText.TEXT_DATA}</p>);
            } else {
                const regex = new RegExp(`(${searchValue})`, 'gi');
                const highlightedText = (fullText.TEXT_DATA || '').replace(regex, '<span style="background-color: orange;">$1</span>');
                return(<p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: highlightedText }}></p>);
            }
        } else {
            const regex = new RegExp(`<<([^>]+)>>`, 'g');
            const highlightedText = (fullText.TEXT_DATA || '').replace(regex, '<span style="background-color: orange;">$1</span>');       
            return(<p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: highlightedText }}></p>);
        }
    };

    return (
        <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
            <Box sx={{height: '80%', width: '80%', position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', bgcolor: '#525659', color: 'white', overflowY: 'auto'}}>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                {dataToDisplay()}
            </Box>
        </Modal>
    );
}
export default Context_Modal;