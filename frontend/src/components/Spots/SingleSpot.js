import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpot, removeSpot } from '../../store/spots';
import { createReview } from "../../store/reviews";
// import { removeSpot } from "../../store/spots";
import { getReviewsBySpot } from "../../store/reviews";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SpotEditModal from "../SpotEditModal";
import ReviewFormModal from "../ReviewFormModal";
import './spots.css'


export default function SelectedSpot() {
    const dispatch = useDispatch();
    const history = useHistory();
    let disabled = false

    const { spotId } = useParams();
    const Spot = useSelector(state => state.spots.singleSpot);
    const Reviews = useSelector(state => state.reviews.allReviews);
    const User = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(getSpot(spotId))
        dispatch(getReviewsBySpot(spotId))
    }, [])


    const reviewArr = Object.values(Reviews)

    let starTotal = 0

    if (User) {
        for (let review of reviewArr) {
            starTotal += review.stars
            if (review.userId === User.id) {
                disabled = true
            }
        }
    }

    const spotImgs = []
    // let spotImgs;
    let name;

    if (Spot.Owner) {
        // if (Spot..firstName) {
        name = Spot.Owner.firstName
        // console.log(Spot.User)
        // }
    }

    if (Spot.SpotImages) {
        spotImgs.push(...Spot.SpotImages)
        // console.log(Object.values(Spot.SpotImages))
    }
    for (let i = 0; i < 5; i++) {
        if (spotImgs.length === 5) {
            break
        }
        else {
            spotImgs.push({ preview: false })
        }
    }

    const deleteHandler = async (e) => {
        const test = await dispatch(removeSpot(spotId));
        if (test.ok) {
            history.push('/')
        }
    }



    return (
        <div>

            <div className="single-spot-div">

                <div className="info-buttons-div">

                    <div className="single-spot-info-name-div">

                        <div className="selected-spot-name">
                            {Spot.name}
                        </div>
                        <div id="selected-spot-info-div">
                            <span class="material-symbols-outlined">
                                star
                            </span>

                            <div>
                                {reviewArr.length > 0 ?
                                    (starTotal / reviewArr.length).toFixed(2) :
                                    0
                                }
                            </div>

                            <div className="dot">
                                ·
                            </div>

                            <div>
                                {`${reviewArr.length} reviews`}
                            </div>

                            <div className="dot">
                                ·
                            </div>

                            <div>
                                {`${Spot.city}, ${Spot.state}, ${Spot.country}`}
                            </div>
                        </div>

                    </div>


                    {
                        User ?
                            User.id === Spot.ownerId ?

                                <div className="single-spot-buttons-div">
                                    <button>
                                        <OpenModalMenuItem
                                            itemText="Edit"
                                            modalComponent={<SpotEditModal />}
                                        />
                                    </button>
                                    {/* <button
                                        onClick={() => history.push(`/${spotId}/edit`)}
                                    >
                                        Edit
                                    </button> */}
                                    <button
                                        onClick={deleteHandler}
                                    >
                                        Delete
                                    </button>
                                </div> :
                                <div
                                // className={`review-modal-button-${disabled} modal-button`}
                                >
                                    {/* {
                                        disabled ?
                                            <button
                                                disabled={disabled}
                                            >
                                                Review
                                            </button> :
                                        } */}
                                    <button
                                        disabled={disabled}
                                        className={`review-modal-button-${disabled}`}
                                    >
                                        <OpenModalMenuItem
                                            itemText="Review"
                                            // onItemClick={closeMenu}
                                            modalComponent={<ReviewFormModal />}
                                        />
                                    </button>
                                </div>
                            :

                            < OpenModalButton
                                buttonText='Review'
                                modalComponent={<LoginFormModal />}
                            />
                    }


                </div>


                <div className="gen-img-div">
                    {
                        spotImgs.map((el, count = 1) => {
                            if (el.preview === true) {
                                return (
                                    <div className="single-spot-preview-div img-divs">
                                        <img className="single-spot-images" id="single-spot-img-preview" src={
                                            el.url ||
                                            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
                                        } />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className={`single-spot-gen-img-div-${count} img-divs`} >
                                        <img className="single-spot-images" id={`single-spot-gen-img-${count}`} src={
                                            el.url ||
                                            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
                                        } />
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                <div>

                    <div>
                        {`Home hosted by ${name}`}
                    </div>

                    <div>
                        ${Spot.price}
                    </div>

                </div>

            </div>

            <div>
                {
                    reviewArr.map(el => (
                        <div>
                            <p>
                                {el.review}
                            </p>
                        </div>
                    ))
                }
            </div>

        </div>

    )
}