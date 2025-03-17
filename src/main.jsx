import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store,persistor} from "./app/store.jsx"
import axios from 'axios'
import { PersistGate } from 'redux-persist/integration/react'
axios.defaults.withCredentials=true;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider> 
  </StrictMode>,
)
