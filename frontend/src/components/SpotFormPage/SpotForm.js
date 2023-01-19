import React, { useEffect, useState } from "react";
import { submitSpot } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './spotForm.css'

/*
address
city
state
country
lat
lng
name
description
price
*/


export default function SpotCreation() {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [errors, setErrors] = useState([]);


    useEffect(() => {

        const detected = [];

        if (!sessionUser) {
            detected.push('must be logged in')
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

    }, [lat, lng, price, name, sessionUser])

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(submitSpot({
            ownerId: sessionUser.id,
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


        setAddress('');
        setCity('');
        setState('');
        setCountry('');
        setLat(0);
        setLng(0);
        setName('');
        setDescription('');
        setPrice(1);

        history.push('/')
    }

    return (
        <form
            className="spot-form"
            onSubmit={submitHandler}
        >
            <ul>
                {errors.map(el => (
                    <li>
                        {el}
                    </li>
                ))}
            </ul>

            <div id='spot-form-entry-divs'>
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


            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
                <label>
                    {'lng: '}
                </label>
                <input
                    type="number"
                    onChange={(e) => setLng(e.target.value)}
                    value={lng}
                    required
                />
            </div>

            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
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

            <div id='spot-form-entry-divs'>
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
                type='submit'
                disabled={!!errors.length}
            >
                Submit
            </button>

        </form>
    );
};