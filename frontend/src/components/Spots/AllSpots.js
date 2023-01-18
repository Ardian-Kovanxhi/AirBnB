import React, { useEffect } from 'react'
// import * as spotActions from './store/spots'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getSpots } from '../../store/spots';
import './spots.css'

export default function HomeSpots() {
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(getSpots())
    }, [])


    const sessionSpots = useSelector(state => state.spots.allSpots);

    return (
        <div className='all-spots-home'>
            {Object.values(sessionSpots).map(spot => {
                return (
                    <div
                        onClick={() => history.push(`/${spot.id}`)}
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