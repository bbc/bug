// import React from "react";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
// import { makeStyles } from "@material-ui/core/styles";
// import { useApiPoller } from "@utils/ApiPoller";
// import Loading from "@components/Loading";

// const useStyles = makeStyles((theme) => ({
//     tableName: {
//         width: "14rem",
//         "@media (max-width:512px)": {
//             width: "10rem",
//         },
//     },
// }));

// export default function InterfaceTabHardware({ panelId, interfaceName }) {
//     const classes = useStyles();

//     const iface = useApiPoller({
//         url: `/container/${panelId}/interface/${interfaceName}`,
//         interval: 5000,
//     });

//     if (iface.status === "idle" || iface.status === "loading") {
//         return <Loading height="30vh" />;
//     }
//     if (iface.status === "success" && !iface.data) {
//         return <>Interface not found</>;
//     }

//     const InterfaceText = ({ title, field }) => (
//         <TableRow>
//             <TableCell variant="head" className={classes.tableName}>
//                 {title}
//             </TableCell>
//             <TableCell className={classes.tableValue}>
//                 {iface.data.linkstats && iface.data.linkstats[field] ? iface.data.linkstats[field] : ""}
//             </TableCell>
//         </TableRow>
//     );

//     const InterfaceBoolean = ({ title, field }) => (
//         <TableRow>
//             <TableCell variant="head" className={classes.tableName}>
//                 {title}
//             </TableCell>
//             <TableCell className={classes.tableValue}>
//                 {iface.data.linkstats && iface.data.linkstats[field] !== null
//                     ? iface.data.linkstats[field]
//                         ? "yes"
//                         : "no"
//                     : ""}
//             </TableCell>
//         </TableRow>
//     );

//     return (
//         <>
//             <Grid item xs={12}>
//                 <TableContainer component={Paper} square>
//                     <Table className={classes.table} aria-label="simple table">
//                         <TableBody>
//                             <InterfaceBoolean title="SFP Module Present" field="sfp-module-present" />
//                             <InterfaceBoolean title="SFP RX Loss" field="sfp-rx-loss" />
//                             <InterfaceBoolean title="SFP TX Fault" field="sfp-tx-fault" />
//                             <InterfaceText title="SFP Type" field="sfp-type" />
//                             <InterfaceText title="SFP Connector Type" field="sfp-connector-type" />
//                             <InterfaceText title="SFP Link Length (Copper)" field="sfp-link-length-copper" />
//                             <InterfaceText title="SFP Vendor Name" field="sfp-vendor-name" />
//                             <InterfaceText title="SFP Vendor Part Number" field="sfp-vendor-part-number" />
//                             <InterfaceText title="SFP Vendor Revision" field="sfp-vendor-revision" />
//                             <InterfaceText title="SFP Vendor Serial" field="sfp-vendor-serial" />
//                             <InterfaceText title="SFP Manufacturing Date" field="sfp-manufacturing-date" />
//                             <InterfaceText title="EEPROM checksum" field="eeprom-checksum" />
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Grid>
//         </>
//     );
// }
