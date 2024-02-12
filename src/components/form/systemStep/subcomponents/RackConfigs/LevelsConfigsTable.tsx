import { useSelector } from "react-redux";
import { ISystems, TLevelsConfig } from "../../../../../features/interfaces";
import { RootState } from "../../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Grid, IconButton, Input, Menu, MenuItem, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme, useThemeProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { handleAddNewConfig, handleAddNewLevel, handleLevelConfigsChange } from "../../../../../features/redux/reducers/formDataSlice";
import LevelsConfigTable from "./LevelsConfigTable";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import { customGreyPalette, customGreyPaletteDark } from "../../../../../theme";


export default function LevelsConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const theme = useTheme();

    function addNewConfig() {
        dispatch(handleAddNewConfig(selectedSystem));
    };

    const rows = levelConfigs

    console.log(levelConfigs)

    return (

        <Card>
            {levelConfigs.map(config => (
                <LevelsConfigTable configId={config.id} selectedSystem={selectedSystem} />
            ))}
            <Box m={1} textAlign='right' justifyContent='end'>
                <Button startIcon={<AddIcon />} variant="contained" onClick={addNewConfig}>Add configuration</Button>
            </Box>
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
                columns={
                    [
                        { field: 'id', headerName: 'Configuration', width: 120, valueGetter: (params) => rows.findIndex(row => params.row.id === row.id) + 1 },
                        { field: 'beamLevels', headerName: 'Beam levels', width: 120, valueGetter: (params) => ` (0+${rows.filter(row => row.id === params.row.id)[0].levels.length})` },
                        { field: 'highestLevel', headerName: 'Highest level', width: 120,  valueGetter: (params) => {
                            const levels = rows.find(row => row.id === params.row.id)?.levels || [];
                            return Math.max(...levels);
                        }},

                    ]
                }
            />

        </Card >

    )
}