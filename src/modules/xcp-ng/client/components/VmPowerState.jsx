import { Box } from "@mui/material";
export default function PanelPowerState({ item }) {
    const operationLabels = {
        migrate_send: "Migrating",
        pool_migrate: "Migrating",
        changing_VCPUs_live: "Upgrading",
        suspend: "Suspending",
        hard_reboot: "Rebooting",
        clean_reboot: "Rebooting",
        hard_shutdown: "Stopping",
        clean_shutdown: "Stopping",
        pause: "Pausing",
        checkpoint: "Creating Checkpoint",
        snapshot: "Creating Snapshot",
        changing_dynamic_range: "Reconfiguring",
        changing_shadow_memory: "Reconfiguring",
        changing_static_range: "Reconfiguring",
        make_into_template: "Reconfiguring",
        changing_dynamic_range: "Reconfiguring",
        destroy: "Deleting",
        export: "Exporting",
        start_on: "Starting",
        start: "Starting",
        clone: "Cloning",
        copy: "Copying",
    };

    const operationColors = {
        migrate_send: "primary.main",
        pool_migrate: "primary.main",
        changing_VCPUs_live: "primary.main",
        suspend: "warning.main",
        hard_reboot: "warning.main",
        clean_reboot: "warning.main",
        hard_shutdown: "warning.main",
        clean_shutdown: "warning.main",
        pause: "warning.main",
        checkpoint: "primary.main",
        snapshot: "primary.main",
        changing_dynamic_range: "primary.main",
        changing_shadow_memory: "primary.main",
        changing_static_range: "primary.main",
        make_into_template: "primary.main",
        changing_dynamic_range: "primary.main",
        destroy: "warning.main",
        export: "primary.main",
        start_on: "warning.main",
        start: "warning.main",
        clone: "primary.main",
        copy: "primary.main",
    };

    let resultText = "";
    let resultColor = "primary.main";

    if (Object.keys(item.current_operations).length > 0) {
        // there's something happening - we'll just use the first one
        const firstOperation = Object.values(item.current_operations)[0];
        if (operationLabels[firstOperation]) {
            resultText = operationLabels[firstOperation];
            resultColor = operationColors[firstOperation];
        } else {
            console.log(item.current_operations);
            resultText = "Busy";
        }
    } else {
        if (item.power_state === "Halted") {
            resultText = "Stopped";
            resultColor = "error.main";
        } else if (item.power_state === "Running") {
            resultText = "Running";
            resultColor = "success.main";
        } else {
            resultText = item.power_state;
        }
    }

    return (
        <Box
            sx={{
                textTransform: "uppercase",

                opacity: "0.8",
                fontSize: "0.8rem",
                fontWeight: "500",
                color: resultColor,
            }}
        >
            {resultText}
        </Box>
    );
}
