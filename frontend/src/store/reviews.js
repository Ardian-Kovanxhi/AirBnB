import Cookies from "js-cookie";
import { csrfFetch } from "./csrf";


const READ_REVIEWS = 'spots/READ_SPOTS'
const DELETE_REVIEW = 'spot/DELETE_SPOT'

const initialState = { allReviews: {} }