import React, {useState, useEffect} from 'react';
import utils from '../../Utils';
const util = utils();

const DataBackup = () => {

    const handleRun = async () => {
        const xml = await util.dataBackup();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'oracle_db_export.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h2>XML</h2>
            <button onClick={handleRun}>Get Full XML Data Backup</button>
        </div>
    );
}
export default DataBackup;