import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomeSpots from "./components/Spots/AllSpots";
import SelectedSpot from "./components/Spots/SingleSpot";
import SpotCreation from "./components/SpotFormPage/SpotForm";
import SpotEditor from "./components/SpotEditPage/SpotEdit";
import UserReviews from "./components/UserReviews";
import ReviewCreation from "./components/ReviewFormPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'} component={HomeSpots} />
          {/* <Route path={'/create-spot'} component={SpotCreation} /> */}
          <Route path={'/user-reviews'} component={UserReviews} />
          <Route path={'/:spotId/edit'} component={SpotEditor} />
          <Route path={'/:spotId/review'} component={ReviewCreation} />
          <Route path={'/:spotId'} component={SelectedSpot} />
          <Route>Page Not found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;