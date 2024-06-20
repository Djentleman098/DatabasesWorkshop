import React from 'react';
import axios from "axios";

const connectionString = 'http://localhost:3001';


const Utils = () => {

   // create options object and returns it
    const createOptions = (data) => {
        if (data === undefined)
            return null;
        const options = data.map((option, index) => (
            <option key={index} value={option}>
                {option}
            </option>
        ));
        return options;
    }

    // retrieve an array with a table from a sql query in the backend based on the table param
    const retrieveTable = async (tableName, variable) => {
        try {
            const response = await axios.post(connectionString+'/api/retrieveTable', {tableName: tableName, variable: variable});
            return response.data;
        } catch (error){
            console.error('Error retrieving form data:', error);
        }
    }

    // insert a new upload to the data base
    const insertFile = async (textType, metadata, file) => {
        // Create FormData object
        const formData = new FormData();
        formData.append('textType', textType);
        formData.append('metadata', JSON.stringify(metadata));
        formData.append('file', file);

        try {
            const response = await axios.post(connectionString+'/api/insertFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Uploaded file successfully!');
            return response.data;
        } catch (error){
            console.error('Error uploading file:', error);
        } 
    }

    // search data in the db
    const searchText = async (variable, text) => {
        try {
            const response = await axios.post(connectionString+'/api/searchText', {variable: variable, text: text});
            return response.data;
        } catch (error){
            console.error('Error searching text:', error);
        }
    }

    // retrieve the full data of a text by its ID
    const getTextData = async (textId) => {
        try {
            const response = await axios.post(connectionString+'/api/getText', {textId: textId});
            return response.data;
        } catch (error){
            console.error('Error getting text:', error);
        }
    }

    // retrieve all the words of texts
    const getFullWordsDetail = async (textIds) => {
        try {
            const response = await axios.post(connectionString+'/api/getWords', {textIds: textIds});
            return response.data;
        } catch (error){
            console.error('Error getting words:', error);
        }
    }


    return {
        createOptions,
        retrieveTable,
        insertFile,
        searchText,
        getTextData,
        getFullWordsDetail,
    };
}

export default Utils;