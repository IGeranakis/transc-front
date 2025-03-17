import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LoginUser,reset} from "../features/auth_slice.jsx"
// import logo from "../logocmt.png";
import '../../css/login.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
        

const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword] =useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user,isError,isSuccess,isLoading,message} = useSelector((state)=>state.auth);
    const Auth =(e)=>{
        e.preventDefault();
        dispatch(LoginUser({email,password}));
    }

    useEffect(()=>{
        if(user && isSuccess){
            navigate("/dashboard");
        } else if (!user && !isSuccess) {
            console.log("Resetting state...");
            dispatch(reset());  // Only reset if there's no user AND no success
        }
        
    },[user,isSuccess,dispatch,navigate]);
    
    return (
    <div className='login'>
        <Card title="Login" className="w-full max-w-md p-6 shadow-lg child" style={{textAlign:'center'}}>
            <div>

            </div>
            <form onSubmit={Auth} className="space-y-4">
                <div>
                    <div className='input_block'>
                        <label htmlFor="email"  className="block text-lg font-medium mb-2">email</label>
                        <InputText className="w-full p-3 text-lg border border-gray-300 rounded-md" id="email" name='email' autocomplete="on" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'/>
                    </div>
                    <div className='input_block'>
                        <label htmlFor="email"  className="block text-lg font-medium mb-2">password</label>
                        <InputText className="w-full p-3 text-lg border border-gray-300 rounded-md" id="password" name='password' autoComplete="current-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='password'/>
                    </div>
                    <Button className="w-full p-3 text-lg login_button"  type="submit"  label={isLoading ?"Loading..." : "Είσοδος"}  icon="pi pi-user" ></Button>
                    {isError && <p className='has-text-centered alert alert-danger'>{message}</p>}
                </div>
            </form>
        </Card>
    </div>
    );
};

export default Login;