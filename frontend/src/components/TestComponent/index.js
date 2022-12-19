import React, { useEffect } from 'react'
// import * as spotActions from './store/spots'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpot, getSpots } from '../../store/spots';

export default function TestButton() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getSpots())
    }, [])

    useEffect(() => {
        dispatch(getSpot())
    }, [])
    const sessionSpots = useSelector(state => state.spots.allSpots);
    const sessionSpot = useSelector(state => state.spots.singleSpot);

    console.log(useParams())
    return (
        <>
            <div>
                <h1>All Spots</h1>
                {Object.values(sessionSpots).map(spot => {
                    return (
                        <>
                            <div>
                                {spot.id}: {spot.name}
                            </div>
                            <div>
                                {spot.address}
                            </div>
                            <div>
                                ${spot.price}
                            </div>
                            <div>
                                {spot.previewImage}
                            </div>
                            <img src='https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg' />
                        </>
                    )
                })}
            </div>
            <div>
                <h1>Single Spot</h1>
                <div>
                    {sessionSpot.name}
                </div>
                <div>
                    lat: {sessionSpot.lat}
                </div>
                <div>
                    lng: {sessionSpot.lng}
                </div>
                <img src='https://pbs.twimg.com/media/Dk-5pO2VsAAaShu?format=jpg&name=small' />
                <img src='https://i2.wp.com/creapills.com/wp-content/uploads/2018/03/30-photos-absurdes-banques-dimages-23.jpg?resize=800%2C536&ssl=1' />
            </div>



        </>
    )
}