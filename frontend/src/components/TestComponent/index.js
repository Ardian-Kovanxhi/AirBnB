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
        <div>
            <div>
                <h1>All Spots</h1>
                {Object.values(sessionSpots).map(spot => {
                    return (
                        <>
                            <div>
                                {spot.id}: {spot.name}
                            </div>
                            <div>
                                address: {spot.address}
                            </div>
                            <div>
                                price: ${spot.price}
                            </div>
                            <div>
                                img url: {spot.previewImage}
                            </div>
                            <img src={`${spot.previewImage}`} />
                        </>
                    )
                })}
            </div>
            <div>
                <h1>Single Spot (hard coded to pull a certain spot, not url based)</h1>
                <div>
                    name: {sessionSpot.name}
                </div>
                <div>
                    lat: {sessionSpot.lat}
                </div>
                <div>
                    lng: {sessionSpot.lng}
                </div>
                <img src='https://pbs.twimg.com/media/Dk-5pO2VsAAaShu?format=jpg&name=small' />
            </div>



        </div>
    )
}