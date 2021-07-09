import React from "react";
import { useSelector } from "react-redux";
import PageLogin from "@components/pages/PageLogin";
import PageRouter from "@components/pages/PageRouter";
import PageReconnect from "@components/pages/PageReconnect";
import Loading from "@components/Loading";
import { BrowserRouter as Router } from "react-router-dom";

const AuthRouter = (props) => {
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);

    // strategies first. If they're not loaded then wait
    if (strategies.status !== "success") {
        return <Loading />;
    }

    // if they're loaded and none enabled, then we're done
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    if (enabledStrategiesCount === 0) {
        return (
            <Router>
                <PageRouter />
            </Router>
        );
    }

    if (user.status === "failure") {
        return <PageReconnect />;
    }

    // if we've got to here, then there must be a strategy enabled
    if (user.status === "idle") {
        return <Loading />;
    }

    if (user.data && user.data.id !== null) {
        return (
            <Router>
                <PageRouter />
            </Router>
        );
    }

    return <PageLogin />;
};

export default AuthRouter;
