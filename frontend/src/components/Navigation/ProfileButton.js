import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { demoUserLogin } from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import SpotFormModal from "../SpotFormModal";

function ProfileButton({ user }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className="profile-button-div">
            <button
                className="profile-button-actual"
                onClick={openMenu}
            >
                <i className="fa-solid fa-bars"></i>
                <i class="fa-sharp fa-solid fa-circle-user"></i>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div className="dropdown-info">{user.username}</div>
                        <div className="dropdown-info">{user.firstName} {user.lastName}</div>
                        <div className="dropdown-info">{user.email}</div>
                        <OpenModalMenuItem
                            itemText="Create Spot"
                            onItemClick={closeMenu}
                            modalComponent={<SpotFormModal />}
                        />
                        {/* {/* <div className="dropdown-info">
                            {/* <button onClick={() => history.push('/create-spot')}>Create Spot</button> 


                    </div> * /} */}
                        {/* < div
                            className="dropdown-info"
                            onClick={() => {
                                history.push('/user-reviews')
                                closeMenu();
                            }}
                        >
                            Reviews
                        </div> */}

                        <div className="dropdown-info"
                            onClick={logout}
                        >
                            Log Out
                            {/* <button onClick={logout}>Log Out</button> */}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            className="dropdown-info profile-button-actual"
                        >
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </button>
                        <button
                            className="dropdown-info profile-button-actual"
                        >
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />

                        </button>
                        <button
                            onClick={() => { dispatch(demoUserLogin()); closeMenu() }}
                            className="dropdown-info profile-button-actual"
                        >
                            Demo User
                        </button>
                    </>
                )
                }
            </div >
        </div >
    );
}

export default ProfileButton;

// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch } from 'react-redux';
// import * as sessionActions from '../../store/session';

// function ProfileButton({ user }) {
//     const dispatch = useDispatch();
//     const [showMenu, setShowMenu] = useState(false);
//     const ulRef = useRef();

//     const openMenu = () => {
//         if (showMenu) return;
//         setShowMenu(true);
//     };

//     useEffect(() => {
//         if (!showMenu) return;

//         const closeMenu = (e) => {
//             if (!ulRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//         };

//         document.addEventListener('click', closeMenu);

//         return () => document.removeEventListener("click", closeMenu);
//     }, [showMenu]);

//     const logout = (e) => {
//         e.preventDefault();
//         dispatch(sessionActions.logout());
//     };

//     const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

//     return (
//         <>
//             <button onClick={openMenu}>
//                 <i className="fas fa-user-circle" />
//             </button>
//             <ul className={ulClassName} ref={ulRef}>
//                 <li>{user.username}</li>
//                 <li>{user.firstName} {user.lastName}</li>
//                 <li>{user.email}</li>
//                 <li>
//                     <button onClick={logout}>Log Out</button>
//                 </li>
//             </ul>
//         </>
//     );
// }

// export default ProfileButton;