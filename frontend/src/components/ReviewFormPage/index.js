import React, { useEffect, useState } from "react";
import { createReview } from "../../store/reviews";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import './reviewForm.css'

export default function ReviewCreation() {
    const history = useHistory();
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState();


    const submitHandler = async (e) => {
        e.preventDefault();

        const newSpot = await dispatch(createReview(spotId, {
            stars,
            review
        }))


        history.push(`/${spotId}`)
    }


    return (
        <form
            className="testing"
            onSubmit={submitHandler}
        >
            <ul>

            </ul>

            <div>
                <label>
                    {'Stars: '}
                </label>
                <input
                    type='number'
                    min='0'
                    max='5'
                    step='.5'
                    onChange={(e) => setStars(e.target.value)}
                    value={stars}
                    required
                />
            </div>

            <div>
                <label>
                    {'Review: '}
                </label>
                <textarea
                    onChange={(e) => setReview(e.target.value)}
                    value={review}
                    required
                    placeholder="Enter your review here"
                ></textarea>
            </div>

            <div>
                <button
                    type="submit"
                // disabled='true'
                >
                    Submit
                </button>

                <button
                    onClick={() => history.push(`/${spotId}`)}
                >
                    Cancel
                </button>
            </div>

        </form>
    )
}