import React, { useEffect, useState } from "react";
import { getSpot, editSpot } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";



export default function SpotEditModal() {

    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [])


    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionSpot = useSelector((state) => state.spots.singleSpot);
    const [address, setAddress] = useState(sessionSpot.address);
    const [city, setCity] = useState(sessionSpot.city);
    const [state, setState] = useState(sessionSpot.state);
    const [country, setCountry] = useState(sessionSpot.country);
    const [lat, setLat] = useState(sessionSpot.lat);
    const [lng, setLng] = useState(sessionSpot.lng);
    const [name, setName] = useState(sessionSpot.name);
    const [description, setDescription] = useState(sessionSpot.description);
    const [price, setPrice] = useState(sessionSpot.price);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();



    useEffect(() => {

        const detected = [];

        if (!sessionUser) {
            detected.push('must be logged in')
        }

        else if (sessionUser.id !== sessionSpot.ownerId) {
            detected.push('wrong user logged in')
        }

        if (lat < -90 || lat > 90) {
            detected.push('lat is out of range')
        }

        if (lng < -180 || lng > 180) {
            detected.push('lng is out of range')
        }

        if (price <= 0) {
            detected.push('price is out of range')
        }

        setErrors(detected)

    }, [lat, lng, price, name, sessionUser, sessionSpot])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(editSpot(sessionSpot.id, {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }))

        closeModal();

        dispatch(getSpot(spotId))


        history.push(`/${sessionSpot.id}`)
    }

    return (
        <form
            onSubmit={submitHandler}
            className='spot-form-modal'
        >

            <div className="modal-title-div">

                <h2 className="modal-title">Edit Spot</h2>

                <span
                    className="material-symbols-outlined"
                    onClick={closeModal}
                >
                    close
                </span>

            </div>
            <ul
                className="error-handling"
            >
                {errors.map(el => (
                    <li>
                        {el}
                    </li>
                ))}
            </ul>

            <div className="spot-form-modal-info">
                <label>
                    {'Address'}
                </label>
                <input
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    required
                />
            </div>


            <div className="spot-form-modal-info">
                <label>
                    {'City'}
                </label>
                <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    required
                />
            </div>

            <div className="spot-form-modal-info">
                <label>
                    {'State'}
                </label>
                <input
                    type="text"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    required
                />
            </div>

            <div className="spot-form-modal-info">
                <label>
                    {'Country'}
                </label>
                <input
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}
                    required
                />
            </div>

            {/* <div>
                <label>
                    {'lat: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setLat(e.target.value)}
                    value={lat}
                    required
                />
            </div>

            <div>
                <label>
                    {'lng: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setLng(e.target.value)}
                    value={lng}
                    required
                />
            </div> */}

            <div className="spot-form-modal-info">
                <label>
                    {'Name'}
                </label>
                <input
                    type="text"
                    maxLength='50'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
            </div>

            <div className="spot-form-modal-info">
                <label>
                    {'Description'}
                </label>
                <textarea
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                />
            </div>

            <div className="spot-form-modal-info">
                <label>
                    {'Price'}
                </label>
                <input
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                />
            </div>

            <div className="modal-buttons-div">
                <button
                    type='submit'
                    className={`spot-form-modal-buttons ${!!errors.length}`}
                    disabled={!!errors.length}
                >
                    Submit
                </button>

                <button
                    onClick={closeModal}
                    className='spot-form-modal-buttons'
                >
                    Cancel
                </button>
            </div>

        </form>
    )
}