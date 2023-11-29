import React from 'react';
import {AuthWrapper, Dashboard, Error, Login, PrivateRoute} from './pages';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <AuthWrapper>
            <Router>
                <Switch>
                    <PrivateRoute path={'/'} exact={true}>
                        <Dashboard></Dashboard>
                    </PrivateRoute>
                    <Route path={'/login'}>
                        <Login/>
                    </Route>
                    <Route path={"*"}>
                        <Error/>
                    </Route>
                </Switch>
            </Router>
        </AuthWrapper>
    );
}

export default App;
