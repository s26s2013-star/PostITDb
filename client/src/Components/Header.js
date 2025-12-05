import { Navbar, Nav, NavItem } from "reactstrap";
import logo from "../Images/logo-t.png";
import { Link  , useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Features/UserSlice";

const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
     new Promise((resolve) => setTimeout(resolve, 100)); // wait for 500ms
    navigate("/login")
  }
 
  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <Link>
              <img src={logo} className="logo" alt=""/>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/profile">Profile</Link>
          </NavItem>
          <NavItem>
            <Link onClick={handleLogout}>Logout</Link>
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
