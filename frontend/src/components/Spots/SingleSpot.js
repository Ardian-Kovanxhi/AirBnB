import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpot, removeSpot } from '../../store/spots';
// import { removeSpot } from "../../store/spots";
import { getReviewsBySpot } from "../../store/reviews";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './spots.css'


export default function SelectedSpot() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpot(spotId))
        dispatch(getReviewsBySpot(spotId))
    }, [])

    const Spot = useSelector(state => state.spots.singleSpot);
    const Reviews = useSelector(state => state.reviews.allReviews);
    const User = useSelector(state => state.session.user)

    const reviewArr = Object.values(Reviews)

    const spotImgs = []
    // let spotImgs;


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

                <div className="single-spot-info-name-div">

                    <div className="selected-spot-name">
                        {Spot.name}
                    </div>
                    <div id="selected-spot-info-div">
                        <span>
                            {Spot.avgStarRating}            ·     {`${Spot.numReviews} reviews`}        ·         {`${Spot.city}, ${Spot.state}, ${Spot.country}`}
                        </span>
                    </div>

                </div>

                <div className="gen-img-div">
                    {
                        spotImgs.map((el, count = 1) => {
                            if (el.preview === true) {
                                return (
                                    <img className="single-spot-images" id="single-spot-img-preview" src={el.url} />
                                )
                            }
                            else {
                                return (
                                    <img className="single-spot-images" id={`single-spot-gen-img-${count}`} src={
                                        el.url ||
                                        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
                                    } />
                                )
                            }
                        })
                    }
                </div>

                {/* <div className="single-spot-info-name-div">

                <div className="selected-spot-name">
                    {Spot.name}
                </div>
                <div className="selected-spot-info-div">
                    <div>
                        {Spot.avgStarRating}
                    </div>
                    <div>
                        {`${Spot.numReviews} reviews`}
                    </div>
                    <div>
                        {`${Spot.city}, ${Spot.state}, ${Spot.country}`}
                    </div>
                </div>

            </div> */}

                <div>
                    {
                        User ?
                            User.id === Spot.ownerId ?

                                <div className="single-spot-buttons-div">
                                    <button
                                        onClick={() => history.push(`/${spotId}/edit`)}
                                    >
                                        Edit Spot
                                    </button>
                                    <button
                                        onClick={deleteHandler}
                                    >
                                        Delete Spot
                                    </button>
                                </div> :

                                <button>
                                    Review
                                </button> :

                            <OpenModalButton
                                buttonText='Review'
                                modalComponent={<LoginFormModal />}
                            />
                    }
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