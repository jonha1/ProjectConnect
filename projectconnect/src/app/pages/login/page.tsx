import "../../styles/login.page.css";

export default function Login() {
  return (
    <>
      <div className="loginContainer">
        <div id="title">ProjectConnect</div>
        <div id="description">Login</div>
        <input id="search" type="text" placeholder="Username or Email"></input>
        <input id="search" type="password" placeholder="Password"></input>
        <div className="buttonContainer">
          <button type="button" className="btn registerButtons">
            <a aria-current="page" href="/">
              Sign In
            </a>
          </button>
          <button type="button" className="btn registerButtons">
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
