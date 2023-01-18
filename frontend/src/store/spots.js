import Cookies from "js-cookie";
import { csrfFetch } from "./csrf";


const READ_SPOTS = 'spots/READ_SPOTS'
const READ_SPOT = 'spot/READ_SPOT'
const CREATE_SPOT = 'spot/CREATE_SPOT'


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

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
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
    const response = await csrfFetch(
        '/api/spots',
        {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'XSRF-Token': Cookies.get('XSRF-TOKEN')
            },
            body: JSON.stringify(data)
        }
    )

    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpot(spot))
        return spot
    }
}



const initialState = { allSpots: {}, singleSpot: {} }

export default function spotsReducer(state = initialState, action) {
    switch (action.type) {
        case READ_SPOTS: {
            const newState = { allSpots: {}, singleSpot: {} }
            action.spots.forEach(spot => newState.allSpots[spot.id] = spot);
            return newState
        }
        case READ_SPOT: {
            const newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.spot
            return newState
        }
        case CREATE_SPOT: {
            const newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.spot
            return newState
        }
        default:
            return state;
    }
}
