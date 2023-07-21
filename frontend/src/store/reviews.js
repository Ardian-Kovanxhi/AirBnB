import Cookies from "js-cookie";
import { csrfFetch } from "./csrf";


const READ_REVIEWS = 'reviews/READ_REVIEWS'
const DELETE_REVIEW = 'review/DELETE_REVIEW'

const readReviews = (reviews) => {
    return {
        type: READ_REVIEWS,
        reviews
    }
}
const deleteReview = (review) => {
    return {
        type: DELETE_REVIEW,
        review
    }
}

export const getReviewsBySpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const reviews = await response.json();
        dispatch(readReviews(reviews))
        return reviews
    }
}

export const getReviewsByUser = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')

    if (response.ok) {
        const reviews = await response.json();
        dispatch(readReviews(reviews))
        return reviews
    }
}

export const createReview = (spotId, data) => async dispatch => {

    const { review, stars } = data

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'XSRF-Token': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify({
            review,
            stars
        })
    })

    if (response.ok) {
        const spotRefresh = await csrfFetch(`/api/spots/${spotId}/reviews`)

        if (spotRefresh.ok) {
            const reviews = await spotRefresh.json();
            dispatch(readReviews(reviews))
            return reviews
        }
    }
}

export const removeReview = (reviewId, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        const newRev = await csrfFetch(`/api/spots/${spotId}/reviews`)
        const reviews = await newRev.json();
        dispatch(readReviews(reviews))
        return reviews
    }
    // if (response.ok) {
    // }
}

const initialState = { allReviews: {} }

export default function reviewsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case READ_REVIEWS: {
            newState = { allReviews: {} }
            action.reviews.Reviews.forEach(review => newState.allReviews[review.id] = review);
            return newState
        }
        case DELETE_REVIEW: {
            newState = { ...state }
            delete newState.allReviews[action.reviewId]
            return newState
        }
        default:
            newState = { ...state }
            newState.allReviews = {}
            return state
    }
}