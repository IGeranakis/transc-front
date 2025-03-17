import { Menubar } from "primereact/menubar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut } from "../features/auth_slice";
import { Button } from "primereact/button";
import apiBaseFrontUrl from "../api_front_config";
const Navbar=()=>{
    const {user} = useSelector((state=>state.auth));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(LogOut()).then(() => {
            navigate("/"); // ✅ Redirect after logout
        });
    };
    const items = [
        { key:"home", label: "Home", icon: "pi pi-home",url:'/dashboard' },
        { key:"users", label: "Users", icon: "pi pi-users",url:'/users' },
    ];
    const end=[
        <div key="right-side-btns" className="flex gap-1">
            <span  className="p-text-secondary p-text-bold">
                {user? (
                    <Link  to={`${apiBaseFrontUrl}/users/edit/${user.uuid}`}>
                        <Button className="p-button-sm" outlined icon="pi pi-user ">{user.name}</Button>
                    </Link>):('')}
            </span>
            <Button 
            outlined
            //label="Logout" 
            icon="pi pi-sign-out" 
            className="p-button-danger p-button-sm" 
            onClick={handleLogout} 
            />
        </div>
    ]
    return(
    <Menubar model={items} end={end}/>
    );
}
export default Navbar;
