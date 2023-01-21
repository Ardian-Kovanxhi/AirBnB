import Cookies from "js-cookie";
import { csrfFetch } from "./csrf";


const READ_SPOTS = 'spots/READ_SPOTS'
const READ_SPOT = 'spot/READ_SPOT'
const DELETE_SPOT = 'spot/DELETE_SPOT'


const readSpots = (spots) => {
    return {
        type: READ_SPOTS,
        spots
    }
}
const readSpot = (spot) => {
    return {
        type: READ_SPOT,
        spot
    }
}

const deleteSpot = () => {
    return {
        type: DELETE_SPOT
    }
}





export const getSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spots = await response.json();
        dispatch(readSpots(spots))
        return spots
    }
}
export const getSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(readSpot(spot))
        return spot
    }
}

export const submitSpot = (data) => async dispatch => {

    const { ownerId, address, city, state, country, lat, lng, name, description, price, url } = data

    const response = await csrfFetch(
        '/api/spots',
        {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'XSRF-Token': Cookies.get('XSRF-TOKEN')
            },
            body: JSON.stringify({ ownerId, address, city, state, country, lat, lng, name, description, price })
        }
    )

    if (response.ok) {

        const spot = await response.json();

        const images = await csrfFetch(
            `/api/spots/${spot.id}/images`,
            {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    'XSRF-Token': Cookies.get('XSRF-TOKEN')
                },
                body: JSON.stringify({
                    spotId: spot.id,
                    url,
                    preview: true
                })
            }
        )

        // console.log(spot)

        dispatch(readSpot(spot))
        return spot
    }
}

export const editSpot = (spotId, data) => async dispatch => {

    const {

        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price

    } = data

    const response = await csrfFetch(
        `/api/spots/${spotId}`,
        {
            method: 'PUT',
            header: {
                'Content-Type': 'application/json',
                'XSRF-Token': Cookies.get('XSRF-TOKEN')
            },
            body: JSON.stringify({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            })
        }
    )


    const spot = await response.json();
    dispatch(readSpot(spot))
    return spot
}

export const removeSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        const deleted = await dispatch(deleteSpot());
        return response;
    }
};



const initialState = { allSpots: {}, singleSpot: {} }

export default function spotsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case READ_SPOTS: {
            newState = { allSpots: {}, singleSpot: {} }
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot);
            return newState
        }
        case READ_SPOT: {
            newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.spot
            return newState
        }
        case DELETE_SPOT: {
            newState = { ...state }
            newState.singleSpot = {};
            // if (newState.allSpots[action.spot.id]) {
            //     delete newState.allSpots[action.spot.id]
            // }
            return newState
        }
        default:
            return state;
    }
}
