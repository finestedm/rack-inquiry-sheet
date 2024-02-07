import { Box, Button, ButtonBase, ButtonGroup, Checkbox, ClickAwayListener, Grid, Grow, IconButton, InputAdornment, Menu, MenuItem, MenuList, Paper, Popper, Select, SelectChangeEvent, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { handleAddLoad, handleDeleteLoad, handleLoadChange } from "../../../../features/redux/reducers/formDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../features/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid, GridActionsCellItem, GridCellEditStopReasons, GridCellModes, GridCellModesModel, GridCellParams, GridRowId, GridRowSelectionModel, GridToolbarContainer } from "@mui/x-data-grid";
import { ISystems } from "../../../../features/interfaces";
import { customGreyPalette, customGreyPaletteDark } from "../../../../theme";

export default function CapacityTable({ selectedSystem }: { selectedSystem: keyof ISystems },) {
    const { t } = useTranslation()
    const theme = useTheme()

    const selectedSystemLoads = useSelector((state: RootState) => state.formData.system[selectedSystem].loads);
    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const dispatch = useDispatch();

    const rows = selectedSystemLoads.map((load, index) => ({
        index: index + 1, // Sequential number starting from 1
        id: load.id,
        name: load.name,
        length: load.length,
        width: load.width,
        height: load.height,
        L2: load.L2,
        W2: load.W2,
        W3: load.W3,
        H2: load.H2,
        H3: load.H3,
        weightMin: load.weightMin,
        weightMax: load.weightMax,
        overhang: load.overhang,
        material: load.material,
        loadSide: load.loadSide,
        secured: load.secured,
        capacity: load.capacity,
        label: '',
    }));

    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        navigator.maxTouchPoints > 0 ? setIsMobile(true) : setIsMobile(false)
    }, [])

    return (
        <Box>
            <DataGrid
                sx={{
                    borderColor: 'divider',
                    boxShadow: theme.palette.mode === 'light' ? theme.shadows[1] : 'none',
                    backgroundColor: 'background.paper',
                    '& .MuiDataGrid-row': {
                        '& .MuiDataGrid-cell': {
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'divider',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        color: theme.palette.mode === 'light' ? customGreyPalette[500] : customGreyPaletteDark[400],
                        fontSize: 12,
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: `1px solid ${theme.palette.divider}`,
                    },
                }}
                rows={rows}
                columns={[
                    { field: "index", headerName: "№", width: 50, type: 'number' },
                    {
                        field: "load",
                        headerName: "Load Type",
                        width: 125,
                        flex: 1,
                        type: 'string',
                        // valueGetter: params => (
                        //     (selectedSystemLoads.filter((load) => load.id === params.id))[0].name
                        // ),
                        renderCell: params => (
                            <Grid container alignItems="center  ">
                                <Grid item mr={1}>
                                    <Typography>
                                        {/* this is needed to that it does not throw an error when filtering updated loads */}
                                        {(selectedSystemLoads.filter((load) => load.id === params.id))[0]?.name ?? ''}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography fontSize="65%" color="text.secondary" p={0}>
                                        {(selectedSystemLoads.filter((load) => load.id === params.id))[0]?.length ?? ''} x{" "}
                                        {(selectedSystemLoads.filter((load) => load.id === params.id))[0]?.width ?? ''} x{" "}
                                        {(selectedSystemLoads.filter((load) => load.id === params.id))[0]?.height ?? ''},{" "}
                                        {(selectedSystemLoads.filter((load) => load.id === params.id))[0]?.weightMax ?? ''} kg
                                    </Typography>
                                </Grid>
                            </Grid>
                        )
                    },
                    { field: "capacity", headerName: "Capacity", minWidth: 125, editable: true, type: 'number', description: 'How many loads should the installation store?' },
                ]}
                processRowUpdate={(newRow: any, oldRow: any) => {
                    if (editMode) {
                        dispatch(handleLoadChange({ newRow, selectedSystem }));
                        // Return the updated row with isNew set to false
                        return { ...newRow, isNew: false };
                    } else {
                        return oldRow
                    }
                }}
                disableRowSelectionOnClick
                disableColumnMenu={isMobile}
                hideFooter
                density='compact'
                slots={{
                    noRowsOverlay: () => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6">No loads defined. <Typography color='text.secondary'>Add them in 'Loads' table first!</Typography></Typography>
                        </Box>
                    )
                }}
            // Add other Data Grid props as needed...
            />
        </Box >
    )
}
