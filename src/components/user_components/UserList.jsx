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

const UserList = () => {
    const {user} =useSelector((state)=>state.auth)
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [users,setUsers]=useState([]);
    const [roles,setRoles]=useState([])


    useEffect(()=>{
        getUsers();
        setLoading(false);
        initFilters();
    },[]);
    ///REQUEST USERS FROM SERVER AND SET CONST
    const getUsers = async() =>{
        try {
            const response = await axios.get(`${apiBaseUrl}/users`, {timeout: 5000});
            const userData=response.data;
            setUsers(response.data);
            const uniqueRole=[...new Set(userData.map(item=>item.role))];
            setRoles(uniqueRole);
            // console.log("roles2",uniqueRole)
            // console.log(response.data)

            
        } catch (error) {
            console.log("Custom error message: Failed to fetch users");

            if (error.response && error.response.status === 403) {
                console.log("You are not authorized to view this resource.");
                alert("Access denied! Please contact an administrator.");
            } else {
                console.log("An error occurred:", error.message);
            }
        }
        
    }

    ///DELETE USER SESSION FROM SERVER  
    const deleteUser = async(userId)=>{
        await axios.delete(`${apiBaseUrl}/users/${userId}`);
        getUsers();
    }

    ///CLEAR ALL FILTERS FUNCTION
    const clearFilter = () => {
        initFilters();
    };
    ///GLOBAL FILTER FUNCTION
    const onGlobalFilterChange = (e) => {
        
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    //INITIAL FILTERS
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.IN },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            role: {  value: null, matchMode: FilterMatchMode.IN  },

            
        });
        setGlobalFilterValue('');
    };

    ///GLOBAL FILTER  CLEAR FILTER & SEARCH-BAR
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between flex-wrap">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };
    const header = renderHeader();

    ///ACTION BUTTONS FUNCTION
    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.uuid
        return(

            <div className=" flex flex-wrap justify-content-center gap-3">
               
                {user && user.role!=="admin" &&(
                    <div>
                    </div>
                )}
                {user && user.role ==="admin" && (
                <span className='flex gap-1'>
                
                    <Link to={`/users/edit/${id}`}><Button className='action-button' outlined  icon="pi pi-pen-to-square" aria-label="Εdit" /></Link>
                    <Button className='action-button' outlined icon="pi pi-trash" severity="danger" aria-label="delete" onClick={()=>deleteUser(id)} />
                </span>
            
                )}

            </div>
 
        );
    }

    ///BODY OF ROLES COLUMN
    const rolesBodyTemplate = (rowData) => {
        const role = rowData.role;
        // console.log("rep body template: ",role)
        return (
            <div key="roles" className="flex align-items-center gap-2">
                <span>{role}</span>
            </div>
        );
    };

  
    ///FILTER OF ROLES COLUMN
    const rolesFilterTemplate = (options) => {
        // console.log('Current projectmanager filter value:', options);
        // console.log("roles filter",roles)
        return (<MultiSelect value={options.value} options={roles} itemTemplate={rolesItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);

    };
    ///MULTISELCT DROPDOWN OF ROLES COLUMN
    const rolesItemTemplate = (option) => {
        // console.log("rep Item template: ",option)

        return (
            <div className="flex align-items-center gap-2">
                <span>{option}</span>
            </div>
        );
    };
    

  return (


    <div className="card" >
        <h1 className='title'>Διαχείριση Χρηστών</h1>
        {user && user.role ==="admin" && (
            <Link to={"/users/add"} className='button is-primary mb-2'>
                <Button label="Προσθήκη Νέου Χρήστη" outlined icon="pi pi-plus-circle"/>
            </Link>
        )}

        <DataTable value={users} 
            paginator 
            stripedRows
            rows={20} 
            scrollable 
            scrollHeight="600px" 
            loading={loading} 
            dataKey="uuid" 
            filters={filters} 
            globalFilterFields={[ 'name', 'email','role',]} 
            header={header} 
            emptyMessage="No user found.">
            <Column field="name" header="Ονομα Χρηστη"  filter filterPlaceholder="Search by name"  style={{ minWidth: '12rem' }}></Column>
            <Column field="email" header="email"  filter filterPlaceholder="Search by email"  style={{ minWidth: '12rem' }}></Column>
            <Column header="Ρόλος" filterField="role" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={rolesBodyTemplate} filter filterElement={rolesFilterTemplate} />
            <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen/>

        </DataTable>


    </div>
  )
}

export default UserList