import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalMenuItem from './OpenModalMenuItem';
import ProfileButton from './ProfileButton';
import SpotFormModal from '../SpotFormModal';
import LoginFormModal from '../LoginFormModal';
import logo from '../../images/mogusBnB.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    return (

        <div className='top-nav-bar'>
            <div
                className='BnB-title'
                onClick={() => history.push('/')}
            >
                <img className='mogus-icon' src={logo} />
                <h2>
                    ArdianBnB
                </h2>
            </div>

            {isLoaded && (
                <div
                    className='nav-options-div'
                >
                    <div className='bnb-your-home'>
                        {
                            sessionUser ?
                                <OpenModalMenuItem
                                    itemText="ArdianBnB your home"
                                    // onItemClick={closeMenu}
                                    modalComponent={<SpotFormModal />}
                                />
                                :
                                <OpenModalMenuItem
                                    itemText="ArdianBnB your home"
                                    // onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                        }
                    </div>
                    <div className='profile-button'>
                        <ProfileButton user={sessionUser} />
                    </div>
                </div>
            )}
        </div>

    );
}

export default Navigation;

// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
// import { demoUserLogin } from '../../store/session';
// import logo from '../../images/mogusBnB.png'
// import './Navigation.css';

// function Navigation({ isLoaded }) {
//     const sessionUser = useSelector(state => state.session.user);
//     const history = useHistory();
//     const dispatch = useDispatch();

//     let sessionLinks;
//     if (sessionUser) {
//         sessionLinks = (
//             <div>
//                 <button onClick={() => history.push('/create-spot')}>Create Spot</button>
//                 <li>
//                     <ProfileButton user={sessionUser} />
//                 </li>
//             </div>
//         );
//     } else {
//         sessionLinks = (
//             <div>
//                 <OpenModalButton
//                     buttonText="Log In"
//                     modalComponent={<LoginFormModal />}
//                 />
//                 <OpenModalButton
//                     buttonText="Sign Up"
//                     modalComponent={<SignupFormModal />}
//                 />
//                 <button
//                     onClick={() => dispatch(demoUserLogin())}
//                 >
//                     Demo User
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className='top-nav-bar'>
//             <div
//                 className='BnB-title'
//                 onClick={() => history.push('/')}
//             >
//                 <img className='mogus-icon' src={logo} />
//                 <h2>
//                     ArdianBnB
//                 </h2>
//             </div>
//             {isLoaded && sessionLinks}
//         </div>
//     );
// }

// export default Navigation;

// // const logout = (e) => {
// //     e.preventDefault();
// //     dispatch(sessionActions.logout());
// // };