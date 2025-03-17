import React,{useEffect} from 'react'
import Layout from '../Layout.jsx'
import FormAddUser from '../../components/user_components/FormAddUser.jsx'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/auth_slice.jsx'

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError,user} = useSelector((state=>state.auth));

  // useEffect(()=>{
  //     dispatch(getMe());
  // },[dispatch]);

  // useEffect(()=>{
  //     if(isError){
  //         navigate("/");
  //     }
  //     if(user && user.role !=="admin"){
  //       navigate("/dashboard");
  //     }
  // },[isError,user,navigate]);
  return (
    <Layout>
        <FormAddUser/>
    </Layout>
  )
}

export default AddUser