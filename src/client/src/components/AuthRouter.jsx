import PageLogin from "@components/pages/PageLogin";
import PageRouter from "@components/pages/PageRouter";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const AuthRouter = () => {
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);

    // strategies first. If they're not loaded then wait
    if (strategies.status !== "success") {
        return <BugLoading />;
    }

    // if they're loaded and none enabled, then we're done
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    if (enabledStrategiesCount === 0) {
        return (
            <BrowserRouter>
                <PageRouter />
            </BrowserRouter>
        );
    }

    // if we've got to here, then there must be a strategy enabled
    if (user.status === "idle") {
        return <BugLoading />;
    }

    if (user.data && user.data.id !== null) {
        return (
            <BrowserRouter>
                <PageRouter />
            </BrowserRouter>
        );
    }

    return <PageLogin />;
};

export default AuthRouter;
