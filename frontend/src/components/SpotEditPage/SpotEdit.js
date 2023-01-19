import React, { useEffect, useState } from "react";
import { getSpot, editSpot } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import './spotEdit.css'

export default function SpotEditor() {

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
        dispatch(editSpot(spotId, {
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

        history.push(`/${spotId}`)
    }

    return (
        <form
            className="spot-edit-from"
        >

            <ul>
                {errors.map(el => (
                    <li>
                        {el}
                    </li>
                ))}
            </ul>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Address: '}
                </label>
                <input
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'City: '}
                </label>
                <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'State: '}
                </label>
                <input
                    type="text"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Country: '}
                </label>
                <input
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Lat: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setLat(e.target.value)}
                    value={lat}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Lng: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setLng(e.target.value)}
                    value={lng}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Name: '}
                </label>
                <input
                    type="text"
                    maxLength='50'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Description: '}
                </label>
                <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                />
            </div>

            <div id='spot-edit-form-entry-divs'>
                <label>
                    {'Price: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                />
            </div>

            <button
                type="Submit"
                disabled={!!errors.length}
                onClick={submitHandler}
            >
                Submit
            </button>

            <button
                onClick={() => history.push(`/${sessionSpot.id}`)}
            >
                Cancel
            </button>

        </form>
    )
}