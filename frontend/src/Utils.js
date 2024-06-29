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
    const getTextMetaData = async (textId) => {
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

    // get a full text as is
    const getFullText = async (textId) => {
        try {
            const response = await axios.post(connectionString+'/api/getFullText', {textId: textId});
            return response.data;
        } catch (error){
            console.error('Error getting text:', error);
        }
    }

    // get full text with highlights in the index positions
    const getTextIndex = async (textId, type, x, y) => {
        try {
            const response = await axios.post(connectionString+'/api/getTextIndex', {textId: textId, type: type, x: x, y: y});
            return response.data;
        } catch (error){
            console.error('Error getting text:', error);
        }
    }    

    // create a new group
    const createGroup = async (name) => {
        try {
            const response = await axios.post(connectionString+'/api/createGroup', {name: name});
            return response.data;
        } catch (error){
            console.error('Error creating group:', error);
        }
    }

    // fetch groups data
    const fetchGroups = async (type) => {
        try {
            const response = await axios.post(connectionString+'/api/fetchGroups', {type: type});
            return response.data;
        } catch (error){
            console.error('Error fetching groups:', error);
        }
    }   
    
    // handle action on the group - edit name or delete
    const editGroup = async (id, action, name) => {
        try {
            const response = await axios.post(connectionString+'/api/editGroup', {id: id, action: action, name: name});
            return response.data;
        } catch (error){
            console.error('Error editing group:', error);
        }
    }    

    // fetches all the group elements as a list by the group id
    const fetchGroupElements = async (id) => {
        try {
            const response = await axios.post(connectionString+'/api/fetchGroupElements', {id: id});
            return response.data;
        } catch (error){
            console.error('Error fetching group data:', error);
        }
    }    

    // add a new element to a group
    const addGroupElement = async (type, id, element) => {
        try {
            const response = await axios.post(connectionString+'/api/addGroupElement', {type: type, id: id, element: element});
            return response.data;
        } catch (error){
            console.error('Error adding to group:', error);
        }
    }

    // remove an element from a group
    const removeGroupElement = async (type, id, element) => {
        try {
            const response = await axios.post(connectionString+'/api/removeGroupElement', {type: type, id: id, element: element});
            return response.data;
        } catch (error){
            console.error('Error removing from group:', error);
        }
    }

    // fetch data from apriori algorithm
    const dataBackup = async () => {
        try {
            const response = await axios.post(connectionString+'/api/dataBackup');
            return response.data;
        } catch (error){
            console.error('Error doing backup:', error);
        }
    }

    // get texts interesting data
    const getStatistics = async (id) => {
        try {
            const response = await axios.post(connectionString+'/api/getStatistics', {id: id});
            return response.data;
        } catch (error){
            console.error('Error getting statistics:', error);
        }
    }

    return {
        createOptions,
        retrieveTable,
        insertFile,
        searchText,
        getTextMetaData,
        getFullWordsDetail,
        getFullText,
        getTextIndex,
        createGroup,
        fetchGroups,
        editGroup,
        fetchGroupElements,
        addGroupElement,
        removeGroupElement,
        dataBackup,
        getStatistics,
    };
}

export default Utils;