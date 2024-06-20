import React, {useState, useEffect} from 'react';
import utils from '../../Utils';
const util = utils();

const Upload_Component = () => {

    // state to save the text types fetch from the db
    const [textTypes, setTextTypes] = useState([]);
    // state to save the selected text type
    const [selectedType, setSelectedType] = useState(null);
    // state to save the metadata options fetch from the db
    const [metadataOptions, setMetadataOptions] = useState([]);
    // state to save the metadata options values input
    const [metadataInput, setMetadataInput] = useState({});
    // state to save the uploaded file
    const [selectedFile, setSelectedFile] = useState(null);

    // use effect hook to retrieve data from data base
    useEffect(() => {
        const fetchData = async () => {
          // get the text types
          const fetchTextTypes = await util.retrieveTable('TextTypes');
          setTextTypes(fetchTextTypes);
        };
        fetchData();
      }, []);

    // use effect hook to get the metadata options after type selection
    useEffect(() => {
        const fetchData = async () => {
          // get the metadata options
          const fetchMetadataOptions = await util.retrieveTable('MetadataOptions', selectedType);
          setMetadataOptions(fetchMetadataOptions);
        };
        if (selectedType !== null)
            fetchData();
      }, [selectedType]);

    // create the options filed for text types. put empty array if there is no data
    let textTypesOptions;
    textTypes.TYPE ? textTypesOptions = util.createOptions(textTypes.TYPE) : textTypesOptions = [];
      
    // function to handle the text type selection
    const handleTextTypeSelection = (e) => {
        // Reset metadata input when type changes
        setMetadataInput({});
        // set the text type to null
        if (e.target.value === ''){
            setSelectedType(null);
            return;
        }
        // save the id of the selected type
        let position;
        for (let i = 0; i < textTypes.TYPE.length; i++) {
            if (e.target.value === textTypes.TYPE[i])
                position = i;
        }
        setSelectedType(parseInt(textTypes.ID[position]));
    };

    // handles the input change of a metadata value
    const handleMetadataInputChange = (e) => {
        const { name, value } = e.target;
        setMetadataInput(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // function to handle file selection. activated by the input
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const fileContent = fileReader.result;
                setSelectedFile(new Blob([fileContent], { type: file.type }));
            };
            fileReader.readAsArrayBuffer(file);
        } else {
            alert('Please select a .txt file');
        }
    };

    // function to save the selected file to the db
    const handleSaveFile = () => {
        if (selectedFile){
            util.insertFile(selectedType, metadataInput, selectedFile);
            // deselect the type
            setSelectedType(null);
            // empty the values in the metadata
            setMetadataInput({});
            // remove the selected file
            setSelectedFile(null);
            // reset the select element
            const selectElement = document.getElementById("textTypeSelect");
            selectElement.value = "";
        } else {
            alert('Please select a file before saving');
        }
    };

    return (
        <div>
            <h2>Upload Data!</h2>
            <div className='text-type'>
                <p>Please Select the Text type</p>
                <select id="textTypeSelect"
                onChange={handleTextTypeSelection}>
                <option value="">Select Text Type</option>
                    {textTypesOptions}
                </select>
            </div>
            {selectedType !== null && 
            <div>
                {metadataOptions.METADATA_OPTION_NAME && metadataOptions.METADATA_OPTION_NAME.map((option, index) => (
                    <div key={index}>
                        <label>{option}</label>
                        <textarea name={option} rows="1" cols="50" value={metadataInput[option] || ''} onChange={handleMetadataInputChange}></textarea>
                    </div>
                ))}
                <input className='file-input' type="file" accept=".txt" onChange={handleFileSelect} />
                <button className="save-file-button" onClick={handleSaveFile}>Save</button>                
            </div>}
        </div>
    );
}
export default Upload_Component;