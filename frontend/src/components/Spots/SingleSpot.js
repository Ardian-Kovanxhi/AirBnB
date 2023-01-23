import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpot, removeSpot } from '../../store/spots';
import { createReview } from "../../store/reviews";
// import { removeSpot } from "../../store/spots";
import { getReviewsBySpot } from "../../store/reviews";
import { removeReview } from "../../store/reviews";
import LoginFormModal from '../LoginFormModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SpotEditModal from "../SpotEditModal";
import ReviewFormModal from "../ReviewFormModal";
import './spots.css'


export default function SelectedSpot() {
    const dispatch = useDispatch();
    const history = useHistory();
    let disabled = false
    const pfpArr = [
        'https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg',

        'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',

        'https://image.shutterstock.com/image-photo/stock-photo-handsome-unshaven-young-dark-skinned-male-laughing-out-loud-at-funny-meme-he-found-on-internet-250nw-640011838.jpg'
    ]

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

    for (let review of reviewArr) {
        starTotal += review.stars
    }

    if (User) {
        for (let review of reviewArr) {
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

    const reviewDeleteHandler = (reviewId) => {
        dispatch(removeReview(reviewId, spotId))
        // console.log(reviewId)
        // console.log(reviewId)
    }

    return (
        <div
            className="single-spot-master-div"
        >

            <div className="single-spot-div">

                <div className="info-buttons-div">

                    <div className="single-spot-info-name-div">

                        <div className="selected-spot-name">
                            {Spot.name}
                        </div>
                        <div id="selected-spot-info-div">
                            <i class="fa-sharp fa-solid fa-star"></i>

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
                                    <button
                                        className="edit-button"
                                    >
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
                                        className="delete-button"
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
                                    <div
                                        className={`review-modal-button-${disabled}`}
                                    >
                                        <OpenModalMenuItem
                                            itemText="Review"
                                            // onItemClick={closeMenu}
                                            modalComponent={<ReviewFormModal />}
                                        />
                                    </div>

                                </div>
                            :

                            < OpenModalMenuItem
                                itemText='Review'
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

                <div
                    className="host-price-div"
                >

                    <div
                        className="host"
                    >
                        {`Home hosted by ${name}`}
                    </div>

                    <div
                        className='single-home-price'
                    >
                        <div
                            className='price-actual'
                        >
                            {`$${Spot.price}`}
                        </div>
                        <div className="home-dot">
                            ·
                        </div>
                        <div>
                            {'night'}
                        </div>
                    </div>
                    {/* <div
                        className=""
                    >
                        ${Spot.price}
                    </div> */}

                </div>

            </div>

            <div
                className="spot-reviews-div"
            >
                {
                    reviewArr.map(el => (
                        <div
                            className="spot-reviews"
                        >

                            <div
                                className="review-user-div"
                            >

                                <div
                                    className="review-pfp-div"
                                >
                                    <img
                                        className="review-pfp"
                                        src={pfpArr[Math.floor(Math.random() * 3)]}
                                    />

                                </div>

                                <p
                                    className="review-user-name"
                                >
                                    {el.User.firstName}
                                </p>
                                {
                                    User ?

                                        el.userId === User.id ?
                                            <button
                                                className="spot-user-delete-button"
                                                onClick={() => reviewDeleteHandler(el.id)}
                                            >delete</button> :

                                            '' : ''
                                }

                            </div>

                            <div
                                className="review-info"
                            >

                                <p
                                    className="review-actual"
                                >
                                    {el.review}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>

    )
}