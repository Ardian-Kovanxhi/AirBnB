import React from 'react'
// import * as spotActions from './store/spots'
import { useDispatch, useSelector } from 'react-redux';
import { getSpot, getSpots } from '../../store/spots';

export default function TestButton() {
    // getSpots()
    const dispatch = useDispatch()
    dispatch(getSpots())
    // const sessionSpots = useSelector(state => state.spots.allSpots);


    return (
        <div>
            <ul>
                <li>
                    {/* {useSelector(state => state.spots.allSpots)[1].name} */}
                </li>
            </ul>
        </div>
    )
}