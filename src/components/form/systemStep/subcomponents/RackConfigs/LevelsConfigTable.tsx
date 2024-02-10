import { useSelector } from "react-redux";
import { ISystems, TLevelsConfig } from "../../../../../features/interfaces";
import { RootState } from "../../../../../features/redux/store";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Menu, MenuItem, Stack, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { MouseEvent, useState } from "react";
import { DataGrid, GridRowSelectionModel, GridToolbarContainer } from "@mui/x-data-grid";
import { handleAddNewLevel, handleLevelConfigsChange } from "../../../../../features/redux/reducers/formDataSlice";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { customGreyPalette, customGreyPaletteDark } from "../../../../../theme";
import { openSnackbar } from "../../../../../features/redux/reducers/snackBarSlice";
import AddIcon from '@mui/icons-material/Add';

export default function LevelsConfigTable({ selectedSystem, configId }: { selectedSystem: keyof ISystems; configId: TLevelsConfig['id']; }) {

    const beamHeight = 150
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const config = levelConfigs.find(config => config.id === configId)!;
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
        setRowSelectionModel([])
    }


    return (
        <Accordion>
            <AccordionSummary
                onClick={e => e.stopPropagation()}
                expandIcon={<ExpandMoreIcon />}
            >
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <Typography variant='h6' align='left' >Konfiguracja {levelConfigs.findIndex(conf => conf.id === config.id) + 1}</Typography>
                    <Typography variant='h6' ml={1} align='left' color='text.secondary'> (0 + {config.levels.length})</Typography>
                    <ConfigurationOptionsMenu />
                </Stack>
            </AccordionSummary>
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
                                <Button variant='outlined' startIcon={<AddIcon />} onClick={() => dispatch(handleAddNewLevel({ selectedSystem, configId: config.id }))}>Add Level</Button>
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
                    initialState={{
                        sorting: {
                          sortModel: [{ field: 'id', sort: 'desc' }],
                        },
                      }}
                    onProcessRowUpdateError={(error) => console.log(error)}
                />
            </AccordionDetails>
        </Accordion>
    );
}

function ConfigurationOptionsMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleClose();
    };

    return (
        <Box>
            <IconButton
                aria-label="more"
                aria-controls="configuration-menu"
                aria-haspopup="true"
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick(e)
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="configuration-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDelete}>Delete Configuration</MenuItem>
            </Menu>
        </Box>
    );
}