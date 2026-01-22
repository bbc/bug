import React from "react";

// List of MDI icon names
const mdiIconNames = [
    "mdiAccount",
    "mdiHome",
    "mdiSpeaker",
    "mdiViewQuilt",
    "mdiMatrix",
    "mdiCloudBraces",
    "mdiPhoneSettings",
    "mdiPowerPlugOutline",
    "mdiSatelliteUplink",
    "mdiRadioTower",
    "mdiSetTopBox",
    "mdiMonitorEye",
    "mdiLink",
    "mdiVideoWireless",
    "mdiClipboardList",
    "mdiRouter",
    "mdiMapMarkerPath",
    "mdiOrderAlphabeticalAscending",
    "mdiNoteEditOutline",
    "mdiLan",
    "mdiRssBox",
    "mdiSpeedometer",
    "mdiTransitConnectionVariant",
    "mdiTurtle",
    "mdiWifi",
    "mdiPlayBoxOutline",
];

const lazyMdiIcon = (iconName) => {
    return React.lazy(async () => {
        const icons = await import("@mdi/js");
        const { default: MdiSvgIcon } = await import("./MdiSvgIcon");
        return {
            default: (props) => <MdiSvgIcon path={icons[iconName]} {...props} />,
        };
    });
};

export const iconMap = {
    // MUI icons
    AltRoute: React.lazy(() => import("@mui/icons-material/AltRoute")),
    Home: React.lazy(() => import("@mui/icons-material/Home")),
    AccountCircle: React.lazy(() => import("@mui/icons-material/AccountCircle")),
    ChevronRight: React.lazy(() => import("@mui/icons-material/ChevronRight")),
    Dvr: React.lazy(() => import("@mui/icons-material/Dvr")),
    Settings: React.lazy(() => import("@mui/icons-material/Settings")),
    Dashboard: React.lazy(() => import("@mui/icons-material/Dashboard")),
    MusicNote: React.lazy(() => import("@mui/icons-material/MusicNote")),
    People: React.lazy(() => import("@mui/icons-material/People")),
    Security: React.lazy(() => import("@mui/icons-material/Security")),
    SettingsBackupRestore: React.lazy(() => import("@mui/icons-material/SettingsBackupRestore")),
    SystemUpdateAlt: React.lazy(() => import("@mui/icons-material/SystemUpdateAlt")),
    ResetTv: React.lazy(() => import("@mui/icons-material/ResetTv")),
    Info: React.lazy(() => import("@mui/icons-material/Info")),
    Receipt: React.lazy(() => import("@mui/icons-material/Receipt")),
    SettingsEthernet: React.lazy(() => import("@mui/icons-material/SettingsEthernet")),
    SmartButton: React.lazy(() => import("@mui/icons-material/SmartButton")),
    Schedule: React.lazy(() => import("@mui/icons-material/Schedule")),
    Web: React.lazy(() => import("@mui/icons-material/Web")),

    // MDI icons
    ...Object.fromEntries(mdiIconNames.map((name) => [name, lazyMdiIcon(name)])),
};
