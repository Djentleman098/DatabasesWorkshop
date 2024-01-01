import React , {useEffect, useState} from 'react';
import axios from 'axios';

const Upload = ({onFileUpload}) => {

    const [selectedFile, setSelectedFile] = useState(null); // the file that is selected from the file explorer
    const prevSelectedFile = React.useRef(selectedFile);
    const [uploadedFile, setUploadedFile] = useState(null); // the file that is uploaded to the db

    const [queryTextType, setQueryTextType] = useState(null);
    const [queryMetadata, setQueryMetadata] = useState(null);
    const [selectedTextType, setSelectedTextType] = useState('');
    const prevSelectedTextType = React.useRef(selectedTextType);


    useEffect(() => {
        // Call the checkfile function to check if the file is .txt and open the text types - after a file is chosen
        if (selectedFile && selectedFile !== prevSelectedFile.current){
            checkFile();
            prevSelectedFile.current = selectedFile;
        }

        // Update the metadata fields based on the selected text type - after a type is chosen
        if (selectedTextType && selectedTextType !== prevSelectedTextType.current){        
            getMetadataValues();
            prevSelectedTextType.current = selectedTextType;
        }
    });


    // Opens a new file from directory
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setQueryTextType(null);
        setSelectedTextType(null);
        setQueryMetadata(null);
        setUploadedFile(null);
    }

    // Makes sure the file is .txt before metadata, and calls the text types function from db
    const checkFile = () => {
        // Check if the file is .txt
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.txt')){
                alert('Invalid type. Please select .txt file');
                return;
            }
        }
        // Returns the text types from the database
        getTextTypes();
    }

    // Gets the text types from the backend api
    const getTextTypes = async () => {
        let query = 'SELECT * FROM TEXT_TYPE';
        let connectionString = 'http://localhost:3001/api/query?query=' + query;
        try {
            axios.get(connectionString).then(response => {
                setQueryTextType(response.data);
            }).catch(error => {
                console.error('Error getting text types', error);
            });
        } catch (error) {
            console.error('Error executing query: ' + error.massage);
        }
    };

    // Saves the choice of text type and calls a function to get the metadata values from the db
    const handleRadioChange = (value) => {
        setSelectedTextType(value);
    };

    // Gets the metadata fields based on the text type from the backend api
    const getMetadataValues = async () => {
        let typeNameLength = selectedTextType.length;
        let query = "SELECT COLUMN_NAME FROM ALL_TAB_COLUMNS WHERE TABLE_NAME = 'METADATA' AND SUBSTR(COLUMN_NAME, 1, " + typeNameLength + ") = '" + selectedTextType + "'";
        let connectionString = 'http://localhost:3001/api/query?query=' + query;
        try {
            axios.get(connectionString).then(response => {
                setQueryMetadata(response.data);
            }).catch(error => {
                console.error('Error getting text types', error);
            });
        } catch (error) {
            console.error('Error executing query: ' + error.massage);
        }
    };

    // Send the file and metadata to the api endpoint, to save in the database
    const handleUpload = () => {
        
    };

    return (
        <div>
            <h1>This is the Upload Page</h1>
            <input type="file" onChange={handleFileChange}/>

            {queryTextType && (
                <div>
                    {queryTextType.map((row, index) => (
                        <div key={index}>
                            <input type="radio" name="radioGroup" onChange={() => handleRadioChange(Object.values(row)[0])}/>
                            <label>{Object.values(row)[0]}</label>
                        </div>
                    ))}
                </div>
            )}

            {queryMetadata && (
                <div>
                    {queryMetadata.map((row, index) => (
                        <div key={index}>
                            <label>{Object.values(row)[0]}</label>
                            <textarea></textarea>
                        </div>
                    ))}
                </div>
            )}

            {selectedTextType &&
            <button onClick={handleUpload}>Upload</button>
            }

            {uploadedFile && (
                <div>
                    <h2>Uploaded File:</h2>
                    <p>Name: {uploadedFile.name}</p>
                    <p>Size: {uploadedFile.size} bytes</p>
                </div>
            )}
        </div>
    );
};

export default Upload;