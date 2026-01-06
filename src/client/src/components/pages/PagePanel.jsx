import BugLoading from "@core/BugLoading";
import { usePanelConfig } from "@data/PanelConfigHandler";
import panelDataSlice from "@redux/panelDataSlice";
import { lazy, useEffect } from "react"; // Added useMemo
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";

const moduleImports = import.meta.glob("../../../../modules/*/client/Module.jsx");

const Modules = {};
Object.keys(moduleImports).forEach((path) => {
    // Extract the module name from the path
    const match = path.match(/\/modules\/([^/]+)\/client\/Module\.jsx$/);
    if (match) {
        const moduleName = match[1];
        // Wrap the dynamic import in React.lazy
        Modules[moduleName] = lazy(moduleImports[path]);
    }
});

export default function PagePanel() {
    const params = useParams();
    const panelId = params.panelId || "";
    const panelConfig = useSelector((state) => state.panelConfig);
    const moduleName = panelConfig.data ? panelConfig.data.module : null;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(panelDataSlice.actions.clear());
    }, [panelId, dispatch]);

    usePanelConfig({ panelId });

    if (panelConfig.status !== "success") {
        return <BugLoading />;
    }

    if (!moduleName || !Modules[moduleName]) {
        console.error(`Module "${moduleName}" not found in`, Object.keys(Modules));
        return <Navigate replace to="/" />;
    }

    const ModuleComponent = Modules[moduleName];

    return (
        <ModuleComponent panelId={panelId}>
            <Outlet />
        </ModuleComponent>
    );
}
