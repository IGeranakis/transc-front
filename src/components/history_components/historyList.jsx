import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../api_config.jsx'
import { useSelector } from 'react-redux'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

const HistoryList = () => {
    const {user} =useSelector((state)=>state.auth)
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState(null);

    const [history,setHistory]=useState([]);
 
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const [dialogField, setDialogField] = useState(null); // 'corrected_text' or 'summary'



    useEffect(()=>{
        getHistory();
        setLoading(false);
        // initFilters();
    },[]);
    ///REQUEST USERS FROM SERVER AND SET CONST
    const getHistory = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/history/user/${user?.uuid}`, {timeout: 5000});
            const userData=response.data;
            setHistory(response.data);
            // const uniqueRole=[...new Set(userData.map(item=>item.role))];
            // setRoles(uniqueRole);
            // console.log("roles2",uniqueRole)
            // console.log(response.data)

            
        } catch (error) {
            console.log("Custom error message: Failed to fetch user history");

            if (error.response && error.response.status === 403) {
                console.log("You are not authorized to view this resource.");
                alert("Access denied! Please contact an administrator.");
            } else {
                console.log("An error occurred:", error.message);
            }
        }
        
    }

    const handleView = (rowData) => {
        setSelectedRow(rowData);
        setShowDialog(true);
    };

    const handleFieldView = (rowData, field) => {
        setSelectedRow(rowData);
        setDialogField(field);
        setShowDialog(true);
      };

    
    

  return (


    <div className="card" >
        <h1 className='title'>Διαχείριση Χρηστών</h1>
        {user && user.role ==="admin" && (
            <Link to={"/users/add"} className='button is-primary mb-2'>
                <Button label="Προσθήκη Νέου Χρήστη" outlined icon="pi pi-plus-circle"/>
            </Link>
        )}

        <DataTable value={history} 
            paginator 
            stripedRows
            rows={20} 
            scrollable 
            scrollHeight="600px" 
            loading={loading} 
            dataKey="uuid" 
            //filters={filters} 
            // globalFilterFields={[ 'name', 'email','role',]} 
            // header={header} 
            emptyMessage="No user found.">
            {/* <Column field="corrected_text" header="corrected_text"  ></Column>
            <Column field="summary" header="summary"></Column> */}
            {/* <Column header="Ρόλος" /> */}
            {/* <Column header="Ενέργειες" field="id"/> */}
            <Column
                header="name"
                field='name'
                />
            <Column
                header="Corrected Text"
                body={(rowData) => (
                    <Button
                    icon="pi pi-eye"
                    label="Προβολή"
                    severity="info"
                    onClick={() => handleFieldView(rowData, 'corrected_text')}
                    />
                )}
                />

                <Column
                header="Summary"
                body={(rowData) => (
                    <Button
                    icon="pi pi-eye"
                    label="Προβολή"
                    severity="help"
                    onClick={() => handleFieldView(rowData, 'summary')}
                    />
                )}
                />

            {/* <Column
                header="Ενέργειες"
                body={(rowData) => (
                    <Button
                    icon="pi pi-eye"
                    label="View"
                    severity="info"
                    onClick={() => handleView(rowData)}
                    />
                )}
                /> */}

        </DataTable>


        {/* <Dialog
        header="Transcription Details"
        visible={showDialog}
        style={{ width: '50vw' }}
        onHide={() => setShowDialog(false)}
        >
        <div className="p-fluid">
            <label htmlFor="correctedText">Corrected Text</label>
            <InputTextarea
            id="correctedText"
            value={selectedRow?.corrected_text || ''}
            rows={6}
            readOnly
            />

            <label htmlFor="summary" className="mt-3">Summary</label>
            <InputTextarea
            id="summary"
            value={selectedRow?.summary || ''}
            rows={4}
            readOnly
            />
        </div>
        </Dialog> */}

        <Dialog
            header={dialogField === 'corrected_text' ? "Corrected Text" : "Summary"}
            visible={showDialog}
            style={{ width: '50vw' }}
            onHide={() => setShowDialog(false)}
            >
            <div className="p-fluid">
                <InputTextarea
                value={selectedRow?.[dialogField] || ''}
                rows={6}
                readOnly
                autoResize
                />
            </div>
        </Dialog>


    </div>
  )
}

export default HistoryList