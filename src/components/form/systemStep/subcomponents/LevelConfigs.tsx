import { useSelector } from "react-redux";
import { ISystems, TLevelsConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, Input, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme, useThemeProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputGroup from "../../InputGroup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { handleAddNewConfig, handleAddNewLevel, handleLevelConfigsChange } from "../../../../features/redux/reducers/formDataSlice";
import { DataGrid, GridEditCellProps, GridRenderCellParams, GridRowSelectionModel, GridToolbarContainer, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { openSnackbar } from "../../../../features/redux/reducers/snackBarSlice";
import { customGreyPalette, customGreyPaletteDark } from "../../../../theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

export default function LevelConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function addNewConfig() {
        dispatch(handleAddNewConfig(selectedSystem));
    };

    return (
        <InputGroup
            title={t(`system.subheader.configs`)}
            content={
                <Box>
                    {levelConfigs.map(config => (
                        <LevelConfig config={config} selectedSystem={selectedSystem} />
                    ))}
                    <Button onClick={addNewConfig}>Add configuration</Button>
                </Box>
            }
        />
    )
}

function LevelConfig({ selectedSystem, config }: { selectedSystem: keyof ISystems; config: TLevelsConfig; }) {

    const beamHeight = 150
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const rows = config.levels.slice().sort((a, b) => a - b).map((level, index) => ({ id: index, value: level }));

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


    function handleDeleteLevel() {
        const newLevels = config.levels.filter((level, index) => !rowSelectionModel.includes(index));
        const updatedConfig = { ...config, levels: newLevels };
        const updatedConfigs = levelConfigs.map(levelConfig => levelConfig.id === config.id ? updatedConfig : levelConfig);
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedConfigs }));
    }


    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography variant='h6' align='left' >Konfiguracja {levelConfigs.findIndex(conf => conf.id === config.id) + 1}</Typography>
                <Typography variant='h6' ml={1} align='left' color='text.secondary'> (0 + {config.levels.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Button variant="outlined" startIcon={<DeleteIcon />}>Delete configuration</Button>

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
                        { field: 'id', headerName: 'Beam Level', width: 120, valueGetter: (params) => params.row.id + 1 },

                        { field: 'value', headerName: 'Height', width: 120, editable: true, valueGetter: (params) => config.levels[params.row.id] },
                        {
                            field: 'difference', headerName: 'Difference', width: 150,
                            valueGetter: (params) => {
                                if (params.row.id === 0) {
                                    return '';
                                } else {
                                    // Calculate the difference between the current row value and the previous row value
                                    const currentLevel = params.row.value;
                                    const previousLevel = config.levels[params.row.id - 1];
                                    return currentLevel - previousLevel;
                                }
                            }
                        },
                        {
                            field: 'freeLevelHeight', headerName: 'Free level height', width: 200,
                            valueGetter: (params) => {
                                if (params.row.id === 0) {
                                    return '';
                                } else {
                                    // Calculate the difference between the current row value and the previous row value
                                    const currentLevel = params.row.value;
                                    const previousLevel = config.levels[params.row.id - 1];
                                    return currentLevel - previousLevel - beamHeight;
                                }
                            }

                        },
                    ]}
                    slots={{
                        pagination: () => (
                            <GridToolbarContainer>
                                {(editMode && rowSelectionModel.length > 0) ?
                                    <Box>
                                        <Box display={{ xs: 'none', md: 'block' }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                disabled={!editMode}
                                                onClick={handleDeleteLevel}
                                                endIcon={<DeleteIcon />}
                                            >
                                                {t('ui.button.deleteSelectedLevels')}
                                            </Button>
                                        </Box>
                                        <Box display={{ xs: 'inline-block', md: 'none' }}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                disabled={!editMode}
                                                onClick={handleDeleteLevel}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    : ''
                                }
                                <Button onClick={() => dispatch(handleAddNewLevel({ selectedSystem, configId: config.id }))}>Add Level</Button>
                            </GridToolbarContainer>
                        ),
                    }}
                    autoHeight
                    onRowSelectionModelChange={(newRowSelectionModel) => { setRowSelectionModel(newRowSelectionModel) }}
                    rowSelectionModel={rowSelectionModel}
                    processRowUpdate={(newRow: { id: number, value: number }, oldRow: { id: number, value: number }) => {
                        if (newRow.value < config.levels[newRow.id - 1]) {
                            // Dispatch an action to open a snackbar with an error message
                            dispatch(openSnackbar({ message: 'Level cannot be set lover than previous level', severity: 'error' }));
                            return oldRow
                        }
                        if (newRow.value - config.levels[newRow.id - 1] < (beamHeight + 100)) {
                            // Dispatch an action to open a snackbar with an error message
                            dispatch(openSnackbar({ message: 'Level have to be set at least 250mm above the previous level', severity: 'error' }));
                            return oldRow
                        }
                        const newLevels = [...config.levels];
                        newLevels[oldRow.id] = Number(newRow.value);
                        const updatedConfig = { ...config, levels: newLevels }
                        const updatedConfigs = levelConfigs.map(levelConfig => levelConfig.id === config.id ? updatedConfig : levelConfig);
                        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedConfigs }));

                        return { ...newRow, isNew: false };
                    }}
                    disableRowSelectionOnClick
                    checkboxSelection

                    onProcessRowUpdateError={(error) => console.log(error)}
                />
            </AccordionDetails>
        </Accordion>
    );
}