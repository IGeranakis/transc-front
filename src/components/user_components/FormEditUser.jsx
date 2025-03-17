import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import apiBaseUrl from '../../api_config.jsx'
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormEditUser = () => {
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[confPassword,setConfPassword]=useState("");
    const[role,setRole]=useState("");

    const[msg,setMsg]=useState("");
    const navigate = useNavigate();
    const{id} = useParams();

    //DROPDOWN OPTIONS FOR USER-ROLES
    const roleOptions = [
        { name: 'Διαχειριστής', code: 'admin' },
        { name: 'Χρήστης', code: 'user' },
    ];

    useEffect(()=>{
        getUserById();
    },[id]);

    //REQUEST FROM SERVER USER DETAILS FOR EDITING
    const getUserById = async()=>{
        try {
            const response=await axios.get(`${apiBaseUrl}/users/${id}`, {timeout: 5000});
            setName(response.data.name);
            setEmail(response.data.email);
            const selectedRole = response.data.role === "admin" 
            ? { name: "Διαχειριστής", code: "admin" } 
            : { name: "Χρήστης", code: "user" };

            setRole(selectedRole);

        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }

    ///UPDATE USER
    const updateUser = async (e) =>{
        e.preventDefault();
        try{
            await axios.patch(`${apiBaseUrl}/users/${id}`, {
                name:name,
                email:email,
                password:password,
                confPassword:confPassword,
                role:role.code,
            }
        );
            navigate("/users");
        }catch(error){
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    }      
    return (
    <div>
        <h1 className='title'>Διαχείριση Χρηστών</h1>
        <h2 className='subtitle'>Ενημέρωση Χρήστη</h2>
        <form onSubmit={updateUser}>
            <p className='has-text-centered'>{msg}</p>

            <div className="field">
                <label  className="label">Όνομα</label>
                <div className="control">
                    <InputText type="text" className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Name'/>
                </div>
            </div>
            <div className="field">
                <label  className="label">Email</label>
                <div className="control">
                    <InputText type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email'/>
                </div>
            </div>
            <div className="field">
                <label  className="label">Κωδικός</label>
                <div className="control">
                    <InputText type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='*********'/>
                </div>
            </div>
            <div className="field">
                <label  className="label">Επαλήθευση Κωδικού</label>
                <div className="control">
                    <InputText type="password" className="input" value={confPassword} onChange={(e)=>setConfPassword(e.target.value)} placeholder='*********'/>
                </div>
            </div>
            <div className="field">
                <label  className="label">Ρόλος</label>
                <div className="control">
                    <div className="select is-fullwidth">
                        <Dropdown value={role} onChange={(e) => setRole(e.value)} options={roleOptions} placeholder='Επιλέξτε Ρόλο' optionLabel="name"/>    
                    </div>
                </div>
            </div>
            
            <div className="field">
                <div className="control">
                    <Button type='submit' outlined className="button is-success is-fullwidth">Ενημέρωση</Button>
                </div>
            </div>
        </form>
    </div>
    )
}

export default FormEditUser