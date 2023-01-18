import { csrfFetch } from "../../store/csrf";

/*
ownerId: userId,
address,
city,
state,
country,
lat,
lng,
name,
description,
price
*/


export default function SpotCreation() {

    return (
        <form>
            <label>
                {'Address: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'City: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'State: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'Country: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'lat: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'lng: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'Name: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'Description: '}
                <input
                    type="text"
                />
            </label>

            <label>
                {'Price: '}
                <input
                    type="text"
                />
            </label>

        </form>
    );
};