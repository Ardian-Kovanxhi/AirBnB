import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getReviewsByUser, removeReview } from "../../store/reviews";
import './userReviews.css'

export default function UserReviews() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);

    let reviews;

    if (user) {
        reviews = true
    }
    else {
        history.push('/')
    }
    useEffect(() => {
        dispatch(getReviewsByUser())
    }, [])

    reviews = Object.values(useSelector(state => state.reviews.allReviews))

    const spots = {};

    for (let rev of reviews) {
        spots[rev.spotId] = rev.Spot
    }

    const deleteHandler = (reviewId) => {
        dispatch(removeReview(reviewId))
        // console.log(reviewId)
    }

    return (
        <div className="user-review-master-div">
            {
                reviews.length ?
                    reviews.map(el => {
                        return (
                            <div>
                                <div>
                                    Spot: {spots[el.spotId].name}
                                </div>
                                <div>
                                    Stars: {el.stars}
                                </div>
                                <div>
                                    Review: {el.review}
                                </div>
                                <button
                                    onClick={() => deleteHandler(el.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    }) :
                    <h2>You have no reviews</h2>
            }
        </div>
    )
}