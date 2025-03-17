import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../api_config.jsx';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormAddUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    //DROPDOWN OPTIONS FOR USER-ROLES
    const roleOptions = [
        { name: 'Διαχειριστής', code: 'admin' },
        { name: 'Χρήστης', code: 'user' },
    ];
    ///SAVE FUNC POST TO CREATE-USER
    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiBaseUrl}/users`, {
                name:name,
                email:email,
                password:password,
                confPassword:confPassword,
                role:role.code,
            });
            navigate("/users");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <h1 className='title'>Διαχείριση Χρηστών</h1>
            <h2 className='subtitle'>Προσθήκη νέου χρήστη</h2>
            <form onSubmit={saveUser}>
                <p className='has-text-centered'>{msg}</p>
                <div className="field">
                    <label className="label">Όνομα</label>
                    <div className="control">
                        <InputText type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder='Πληκτρολογήστε Όνομα' />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <InputText type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Πληκτρολογήστε Email' />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Κωδικός</label>
                    <div className="control">
                        <InputText type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='*********' />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Επαλήθευση Κωδικού</label>
                    <div className="control">
                        <InputText type="password" className="input" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder='*********' />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Ρόλος</label>
                    <div className="control">
            
                        <div className="select is-fullwidth">
                            <Dropdown value={role} onChange={(e) => setRole(e.value)} options={roleOptions} placeholder='Επιλέξτε Ρόλο' optionLabel="name"/>                            
                        </div>
                    </div>
                </div>
                
                <div className="field">
                    <div className="control">
                        <Button outlined type='submit' className="button is-success is-fullwidth">Αποθήκευση</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormAddUser;
