import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <div>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </div>
        );
    }

    return (
        <div className='top-nav-bar'>
            <div
                className='BnB-title'
                onClick={() => history.push('/')}
            >
                <img className='eagle-icon' src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Albanian_Eagle.svg/1200px-Albanian_Eagle.svg.png' />
                <h2>
                    ArdianBnB
                </h2>
            </div>
            {isLoaded && sessionLinks}
        </div>
    );
}

export default Navigation;

// const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
// };