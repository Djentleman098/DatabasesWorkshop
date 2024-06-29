import React, {useState, useEffect} from 'react';
import Add_Group from '../components/groups/Add_Group';
import Word_Groups from '../components/groups/words/Word_Groups';
import Expression_Groups from '../components/groups/expressions/Expression_Groups';

const Groups = ({setSearchType, setSearchInText, setTextToSearch, setSearch, setUpdateSearch, updateSearch}) => {

    // used to update the lists when new group is added
    const [update, setUpdate] = useState(false);

    const refreshGroups = () => {
        setUpdate(!update);
    };
    return (
        <div>
            <Add_Group refreshGroups={refreshGroups}/>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                <Word_Groups listUpdate={update}/>
                <Expression_Groups setSearchType={setSearchType} setSearchInText={setSearchInText} setTextToSearch={setTextToSearch} setSearch={setSearch} setUpdateSearch={setUpdateSearch} updateSearch={updateSearch}/>
            </div>
        </div>
    );
};

export default Groups;