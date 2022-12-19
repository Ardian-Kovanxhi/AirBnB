import { csrfFetch } from "./csrf";

const READ_SPOTS = 'spots/READ_SPOTS'
const READ_SPOT = 'spot/READ_SPOT'

const readSpots = (spots) => {
    return {
        type: READ_SPOTS,
        spots
    }
}
const readSpot = spot => {
    return {
        type: READ_SPOT,
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
export const getSpot = () => async dispatch => {
    const response = await csrfFetch('/api/spots/9')

    if (response.ok) {
        const spot = await response.json();
        dispatch(readSpot(spot))
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
        default:
            return state;
    }
}
