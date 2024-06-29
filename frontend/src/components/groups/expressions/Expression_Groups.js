import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import utils from '../../../Utils';
const util = utils();

const Expression_Groups = ({setSearchType, setSearchInText, setTextToSearch, setSearch, setUpdateSearch, updateSearch}) => {

    // state that saves the expressions
    const [expressions, setExpressions] = useState([]);
    // update state after edit
    const [update, setUpdate] = useState(false);

    const navigate = useNavigate();

    // use effect hook to retrieve data from data base
    useEffect(() => {
        const fetchData = async () => {
            // get the expressions
            const fetchExpressions = await util.retrieveTable('Expressions');
            setExpressions(fetchExpressions.EXPRESSION || []);
        };
        fetchData();
        }, [update]);

    // handle navigation and search activation
    const handleResults = async (element) => {
        // set state to trigger search with these values
        setSearchType('Text');
        setSearchInText('All');
        setTextToSearch(element);
        setSearch(true);
        setUpdateSearch(!updateSearch)

        // navigate to search page
        navigate("/");
    };

    //remove expression
    const handleRemoveExpression = (element) => {
        util.removeGroupElement('Expression', null, element);
        setUpdate(!update);
    };

    return (
        <div>
            <h2>Expressions:</h2>
            {expressions.length === 0 && <p>No Expressions!</p>}
            {expressions.length > 0 && expressions.map((exp) => (
                <div className="group-container">
                    <p>{exp}</p>
                    <button onClick={() => handleResults(exp)}>See full results</button>
                    <button onClick={() => handleRemoveExpression(exp)}>Remove Expression</button>
                </div>
            ))}
        </div>
    );
}
export default Expression_Groups;