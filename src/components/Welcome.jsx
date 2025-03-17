import React from 'react'
// import { UseSelector, useSelector } from 'react-redux'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMe } from '../features/auth_slice';
const Welcome = () => {
  const dispatch=useDispatch();
//   useEffect(() => {
//     dispatch(getMe());
// }, [dispatch]);

  const {user} =useSelector((state)=>state.auth);
  // console.log(user)

  return (
    <div >
        <h1 className='title'>Επισκόπηση</h1>
        <h2 className='subtitle'>Καλώς ορίσατε <strong>{user && user.name}</strong></h2>
        <br></br>
    </div>
  )
}

export default Welcome