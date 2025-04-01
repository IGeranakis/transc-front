import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Welcome from '../components/Welcome';
import '../../css/dashboard.css';
import { LogOut,reset } from '../features/auth_slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import AudioTranscriber from '../components/ai_transciption/AudioTranscriber';
import { createContext } from 'react';
import TranscriberSummary from '../components/ai_transciption/TranscriberSummary';
import Navbar from '../components/navbar';

export const TranscriptionContext = createContext();

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(LogOut()).then(() => {
        navigate("/"); // ✅ Redirect after logout
    });
  };

  const [transc,setTransc]=useState("");
  const [transcriptionId,setTranscriptionId] = useState("")

  return (
    <>
    <Navbar/>
    <Layout>
      {/* <Button onClick={handleLogout}>LOG OUT</Button> */}
      <Welcome />
    </Layout>
      <TranscriptionContext.Provider value={{transc,setTransc,transcriptionId,setTranscriptionId}}>
        <Layout>
          <AudioTranscriber/>
        </Layout>
        {transc!=="" &&
          <Layout>
            <TranscriberSummary/>
          </Layout>
        }
        
      </TranscriptionContext.Provider>
    </>
    
  );
  
};

export default Dashboard;
