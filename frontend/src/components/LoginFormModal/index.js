import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { demoUserLogin } from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <div className="log-in-modal-div">
            <div className='modal-title-div'>
                <h1>Log In</h1>
                {/* <FontAwesomeIcon icon="fa-solid fa-x" /> */}
                <i
                    className="fa-solid fa-x"
                    onClick={closeModal}
                ></i>
                {/* <span
                    className="material-symbols-outlined"
                    onClick={closeModal}
                >
                    close
                </span> */}
            </div>
            <form
                onSubmit={handleSubmit}
                className='log-in-form'
            >

                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>

                <div className="spot-form-modal-info userName log-in">
                    <label>
                        Username or Email
                    </label>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </div>

                <div className="spot-form-modal-info password log-in">
                    <label>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="log-in-button"
                >
                    Log In
                </button>
                <button
                    onClick={() => {
                        dispatch(demoUserLogin());
                        closeModal()
                    }}
                    className="demo-user-button"
                >
                    Demo User
                </button>
            </form>
            <div
                onClick={() => window.location.replace('https://github.com/Ardian-Kovanxhi')}
                className="github-redirect"
            >
                <i className="fa fa-github"></i>
                <a
                    href="https://github.com/Ardian-Kovanxhi"
                    className="github-redirect-link"
                >
                    Github
                </a>
            </div>
        </div >
    );
}

export default LoginFormModal;