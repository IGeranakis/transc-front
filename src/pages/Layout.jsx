import React from 'react';
//import Navbar from '../components/Navbar';
//import { SidebarNew } from '../components/SidebarNew';
//import HeadlessDemo from '../components/HeadlessDemo';
import '../../css/layout.css'
import Navbar from '../components/navbar.jsx';
const Layout = ({children}) => {
  return (
    <React.Fragment>
      <Navbar/>
      <div className='parent'>
        <div className="column has-background-light child">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Layout