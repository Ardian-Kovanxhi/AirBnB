import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpot } from '../../store/spots';
import { removeSpot } from "../../store/spots";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './spots.css'


export default function SelectedSpot() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [])

    const Spot = useSelector(state => state.spots.singleSpot);
    const User = useSelector(state => state.session.user)


    const spotImgs = []


    if (Spot.SpotImages) {
        spotImgs.push(...Spot.SpotImages)
    }

    const deleteHandler = (e) => {
        dispatch(removeSpot(spotId));
        history.push('/')
    }



    return (
        <div>
            <div className="selected-spot-name">
                {Spot.name}
            </div>
            <div className="selected-spot-info-div">
                <div>
                    {Spot.avgStarRating}
                </div>
                <div>
                    {Spot.numReviews} reviews
                </div>
                <div>
                    {Spot.city}, {Spot.state}, {Spot.country}
                </div>
                {
                    spotImgs.map(el => (
                        <img className="single-spot-img" src={el.url} />
                    ))
                }
            </div>
            <div>
                {
                    User ?
                        User.id === Spot.ownerId ?

                            <div>
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

    )
}