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

    // const deleteHandler = async (butt) => {
    //     console.log(butt)
    //     history.push('/user-reviews')
    // }

    return (
        <div className="filler-span">
            {
                reviews.map(el => {
                    return (
                        <div>
                            <div className="test">
                                {el.review}
                            </div>
                            <button
                            // onClick={deleteHandler(el.id)}
                            >
                                Delete
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )
}