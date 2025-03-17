import React ,{useEffect} from 'react'
import Layout from '../Layout'
import UserList from '../../components/user_components/UserList.jsx'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/auth_slice.jsx'

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError,user} = useSelector((state=>state.auth));

  // useEffect(()=>{
  //     dispatch(getMe());
  // },[dispatch]);

  // useEffect(()=>{
  //     if(isError){
  //         //navigate("/");
  //         console.log(isError)
  //     }
  //     if(user && user.role !=="admin"){
  //       //navigate("/dashboard");
  //       console.log(user)

  //     }
  // },[isError,user,navigate]);
  return (
    <Layout>
        <UserList/>
    </Layout>
  )
}

export default Users