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
const deleteReview = () => {
    return {
        type: DELETE_REVIEW
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

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        const deleted = await dispatch(deleteReview)
        return response
    }
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
        default:
            newState = { ...state }
            newState.allReviews = {}
            return state
    }
}