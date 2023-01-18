import React, { useEffect } from 'react'
// import * as spotActions from './store/spots'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpot, getSpots } from '../../store/spots';
import './spots.css'

export default function HomeSpots() {
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
        <div className='all-spots-home'>
            <h1>All Spots</h1>
            {Object.values(sessionSpots).map(spot => {
                return (
                    <div
                        onClick={() => alert(spot.id)}
                        className='home-spots'
                    >
                        <div className='home-spots-info-div'>
                            <div>
                                {spot.id}: {spot.name}
                            </div>
                            <div>
                                Address: {spot.address}
                            </div>
                            <div>
                                Price: ${spot.price}
                            </div>
                        </div>
                        <img className='home-preview-img' src={spot.previewImage} />
                    </div>
                )
            })}
        </div>
    )
}