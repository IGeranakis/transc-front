import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store,persistor} from "./app/store.jsx"
import axios from 'axios'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'


axios.defaults.withCredentials=true;
// 2. Extend the theme to include custom colors, fonts, etc
// const colors = {
//   brand: {
//     900: '#1a365d',
//     800: '#153e75',
//     700: '#2a69ac',
//   },
// }

//const theme = extendTheme({ colors })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ChakraProvider >

          <App />
        </ChakraProvider>

      </PersistGate>
    </Provider> 
  </StrictMode>,
)
