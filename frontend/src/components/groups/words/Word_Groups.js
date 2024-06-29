import React, {useState, useEffect} from 'react';
import Word_Group_Modal from './Word_Group_Modal';
import './Word_Groups.css';
import utils from '../../../Utils';
const util = utils();

const Word_Groups = ({listUpdate}) => {

    // state to save the groups data
    const [groups, setGroups] = useState([]);
    // controlls the modal open state for the context modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // new name for the group
    const [newName, setNewName] = useState('');
    // set selected group
    const [selectedGroup, setSelectedGroup] = useState(null);
    // update state after edit
    const [update, setUpdate] = useState(false);

    // use effect hook to retrieve the groups
    useEffect(() => {
        const fetchData = async () => {
            // get the groups
            const fetchGroups = await util.fetchGroups();
            setGroups(fetchGroups);
        };
        fetchData();
    }, [listUpdate, update]);

    // handles select a group and opens the modal
    const handleSelectGroup = (id) => {
        setSelectedGroup(id);
        setIsModalOpen(true);
    };

    // handles update new name
    const handleNewName = (e) => {
        setNewName(e.target.value);
    };

    // handles edit / delete action
    const handleEditGroup = (action, id) => {
        if (action === 'edit' && newName === ''){
            alert('Please Enter a new name');
            return;
        }
        util.editGroup(id, action, newName);
        setNewName('');
        setUpdate(!update);
    };

    return (
        <div>
            <h2>Word Groups:</h2>
            {groups.length === 0 && <p>No Groups!</p>}
            {groups.length > 0 && groups.map((group) => (
                <div className="group-container">
                    <p>{group.ID + ') ' + group.NAME}</p>
                    <p>{'Words Count: ' + group.COUNT}</p>
                    <div className="group-actions">
                        <button onClick={() => handleSelectGroup(group.ID)}>View Words</button>
                        <br/>
                        <input type="text" placeholder="New Name" cols="10" onChange={handleNewName}/>
                        <button onClick={() => handleEditGroup('edit', group.ID, newName)}>Edit Name</button>
                        <br/>
                        <button onClick={() => handleEditGroup('delete', group.ID)}>Delete Group</button>
                    </div>
                </div>
            ))}
            <Word_Group_Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} group={selectedGroup} groupUpdate={update} groupSetUpdate={setUpdate}/>
        </div>
    );
}
export default Word_Groups;