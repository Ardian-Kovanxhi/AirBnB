import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from '../../store/spots';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';


export default function SelectedSpot() {
    const dispatch = useDispatch();

    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [])

    const Spot = useSelector(state => state.spots.singleSpot);
    const User = useSelector(state => state.session.user)

    const spotImgs = Spot.SpotImages

    console.log(Spot)



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
            </div>
            <div>
                {
                    User ?
                        User.id === Spot.ownerId ?

                            <button>
                                Edit Spot
                            </button> :

                            <button>
                                Reserve
                            </button> :

                        <OpenModalButton
                            buttonText='Reserve'
                            modalComponent={<LoginFormModal />}
                        />
                }
            </div>
        </div>

    )
}