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
  const test=`Months There are twelve months in the year. January is the first month of the year. 
  It is usually cold in January. 
  February is the second month of the year. It is still winter when February comes. 
  They say that March comes in like a lion and goes out like a lamb. 
  That means that it is still usually cold and sometimes stormy when March begins. 
  By the time that March ends, the weather is starting to get a little better. 
  April is the rainy month. April showers bring May flowers. Many of the spring flowers bloom in May. 
  The weather can be quite mild in May. June is usually a nice warm month. Many people get married in June. 
  July can be hot. People have vacations in July. It is a month to do summer things. 
  It is still summer in August, but the summer is winding down. August is the time to have last-minute vacations. 
  In September we go back to school. The autumn winds begin to blow. October really feels like autumn. October is Halloween time. 
  November is when we really start to feel the chill. December is the Christmas month. 
  Most people do a lot of Christmas shopping in December. 
  They spend quite a bit of time getting ready for Christmas. 
  All of the months are different. Which month were you born in?`
  const [transc,setTransc]=useState("");
  return (
    <>
    <Navbar/>
    <Layout>
      <Button onClick={handleLogout}>LOG OUT</Button>
      <Welcome />
    </Layout>
      <TranscriptionContext.Provider value={{transc,setTransc}}>
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
