import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBell,
  faBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.modules.css";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary navbarClass">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <h2 className="navbarTitle">ProjectConnect</h2>
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link navbarComponent" aria-current="page" href="/">
                  <FontAwesomeIcon icon={faPlus} />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link navbarComponent" href="/">
                  <FontAwesomeIcon icon={faBell} />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link navbarComponent" href="/">
                  <FontAwesomeIcon icon={faBookmark} />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link navbarComponent" href="/account">
                  <FontAwesomeIcon icon={faUser} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
