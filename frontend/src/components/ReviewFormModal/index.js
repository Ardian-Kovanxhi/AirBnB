import React, { useEffect, useState } from "react";
import { createReview } from "../../store/reviews";
import { useSelector, useDispatch } from "react-redux";
import { getSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import './ReviewFormModal.css'

export default function ReviewFormModal() {
    const dispatch = useDispatch();
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState();
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const spot = useSelector(state => state.spots.singleSpot);


    useEffect(() => {
        const detected = [];
        if (stars < 0 || stars > 5) {
            detected.push('Stars must be between 0 and 5')
        }

        setErrors(detected)
    }, [stars])

    const submitHandler = async (e) => {
        e.preventDefault();

        const newReview = await dispatch(createReview(spot.id, {
            stars,
            review
        }))

        closeModal();

        spot.numReviews++
        spot.avgStarRating = ((spot.avgStarRating * (spot.numReviews - 1)) / spot.numReviews).toFixed(2)

        await dispatch(getSpot(spot.id))
    }


    return (
        <form
            className="spot-form-modal"
            onSubmit={submitHandler}
        >
            <div className="modal-title-div">

                <h2>Leave a Review</h2>

                <i
                    className="fa-solid fa-x"
                    onClick={closeModal}
                ></i>

            </div>

            <ul
                className="error-handling"
            >
                {errors.map(el => (
                    <li>
                        {el}
                    </li>
                ))}
            </ul>

            <div
                className='spot-form-modal-info'
            >
                <label>
                    {'Stars'}
                </label>
                <input
                    type='number'
                    min='0'
                    max='5'
                    step='1'
                    onChange={(e) => setStars(e.target.value)}
                    value={stars}
                    required
                />
            </div>

            <div
                className='spot-form-modal-info'>
                <label>
                    {'Review'}
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
                    disabled={!!errors.length}
                    className='review-form submit-but'
                >
                    Submit
                </button>

                <button
                    onClick={closeModal}
                    className='review-form cancel-but'
                >
                    Cancel
                </button>
            </div>

        </form>
    )
}