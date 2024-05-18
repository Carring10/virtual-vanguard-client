import { useContext } from "react";
import { useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import "./login.css";

export const Login = ({ open, onClose }) => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const modalRef = useRef(null);

  const { current: modal } = modalRef;

  if (open && modal) modal.showModal();

  const handleChange = (event) => {
    // Update the key-value object on each change, merging it with the previous input state
    setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(input);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setErr(err.response.data.message);
    }
  };

  const closeModal = () => {
    modal.close();
    onClose();
  };

  return (
    <dialog ref={modalRef}>
      <button onClick={() => closeModal()} type="button" className="close-button">
        X
      </button>
      <p className="sign-in">Sign In</p>
      <form className="login-form">
        <div className="login-input">
          <i className="bx bx-user-circle" id="login-icon"></i>
          <input
            type="text"
            placeholder="Username"
            name="username"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>
        <div className="login-input">
          <i className="bx bx-lock-alt" id="login-icon"></i>
          <input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleLogin} className="login-button">
          Sign In
        </button>
        <p>
          Don't have an account? {" "}
          <Link to="/register" className="create-account-link">
            Create one
          </Link>
        </p>
        {/* If err is not null, render err message */}
        {err && err}
      </form>
    </dialog>
  );
};
