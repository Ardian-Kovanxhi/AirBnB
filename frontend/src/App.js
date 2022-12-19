import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import TestButton from "./components/TestComponent";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <h1>This is incredibly incomplete (I talked to Alex to explain already). This is the only functionality I was able to set up</h1>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
        </Switch>
      )}
      <TestButton />
    </>
  );
}

export default App;