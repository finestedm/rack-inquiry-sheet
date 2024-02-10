import { useSelector } from "react-redux";
import { ISystems, TLevelsConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Input, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme, useThemeProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputGroup from "../../InputGroup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { handleAddNewConfig, handleAddNewLevel, handleLevelConfigsChange } from "../../../../features/redux/reducers/formDataSlice";
import { DataGrid, GridEditCellProps, GridRenderCellParams, GridRowSelectionModel, GridToolbarContainer, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { openSnackbar } from "../../../../features/redux/reducers/snackBarSlice";
import { customGreyPalette, customGreyPaletteDark } from "../../../../theme";

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
            title={t(`system.subheader.additionalRemarks`)}
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

interface LevelConfigProps {
    selectedSystem: keyof ISystems;
    config: TLevelsConfig;
}

function LevelConfig({ selectedSystem, config }: LevelConfigProps) {

    const beamHeight = 150
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const theme = useTheme();
    const dispatch = useDispatch();

    type ExtendedLevelsConfig = TLevelsConfig & {
        levelsWithId: { id: number; value: number; }[];
    };

    const rows = config.levels.slice().sort((a, b) => a - b).map((level, index) => ({ id: index, value: level }));
    // console.log(rows)

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    function handleDeleteLevel(id: number) {
        const newLevels = [...config.levels.slice(0, id), ...config.levels.slice(id + 1)];
        const updatedConfig = { ...config, levels: newLevels }
        const updatedConfigs = levelConfigs.map(levelConfig => levelConfig.id === config.id ? updatedConfig : levelConfig);
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedConfigs }));
    }

    return (
        <Accordion>
            <AccordionSummary>Config index</AccordionSummary>
            <AccordionDetails>
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
                        {
                            field: 'actions', headerName: 'Actions', width: 120,
                            renderCell: (params) => (
                                <Button onClick={() => handleDeleteLevel(params.row.id)}>Delete level</Button>
                            )
                        },

                    ]}
                    slots={{
                        pagination: () => (
                            <GridToolbarContainer>
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

                    onProcessRowUpdateError={(error) => console.log(error)}
                />
            </AccordionDetails>
        </Accordion>
    );
}