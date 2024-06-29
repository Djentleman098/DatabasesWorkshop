import React, {useState, useEffect} from 'react';
import utils from '../../Utils';
const util = utils();

const Add_Group = ({ refreshGroups }) => {

    // states that will be true if i want to add a group
    const [addGroup, setAddGroup] = useState(false);
    // states that saves the new group name
    const [groupName, setGroupName] = useState('');

    // handles the add group button action
    const handleNewGroup = () => {
        setAddGroup(true);
    };

    // handles the name set for the group
    const handleSetName = (e) => {
        setGroupName(e.target.value);
    };

    // handles add to the group
    const handleAddGroup = () => {
        if (groupName === ''){
            alert('Please Enter Group Name');
            return;
        }
        util.createGroup(groupName);
        setAddGroup(false);
        setGroupName('');
        refreshGroups();
    };

    return (
        <div>
            <br/>
            <button onClick={handleNewGroup}>New Word Group</button>
            {addGroup && 
            <div>
                <br/>
                <textarea placeholder="Name" cols="40" onChange={handleSetName}></textarea>
                <br/>
                <button onClick={handleAddGroup}>Add Group</button>
            </div>}
        </div>
    );
}
export default Add_Group;