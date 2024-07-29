import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../../features/redux/store";
import { Box, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, InputAdornment, InputLabel, Slider, Stack, Switch, TextField, Typography, useTheme, IconButton, Collapse } from "@mui/material";
import { useTranslation } from "react-i18next";
import { handleInputMethod } from "../../../../features/redux/reducers/formDataSlice";
import trimLeadingZeros from "../../../../features/variousMethods/trimLeadingZero";
import { ISystems } from "../../../../features/interfaces";
import WarehouseLayout from "./WarehouseLayout";
import { useState } from "react";
import InputGroup from "../../InputGroup";
import CloseIcon from '@mui/icons-material/Close';
import CustomAlert from "../../../CustomAlert";

export default function Building({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const formData = useSelector((state: RootState) => state.formData);
    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [tempDimensions, setTempDimensions] = useState({
        width: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.width),
        length: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.length),
    });

    const [tempColumnsDimensions, setTempColumnsDimensions] = useState({
        columnX: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.columnX),
        columnY: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.columnY),
        columnGridX: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.columnGridX),
        columnGridY: trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.columnGridY),
    });

    const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
    function extenderHandler() {
        setWarehouseDialogOpen(current => !current)
    }

    const handleInputChange = (field: 'width' | 'length' ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempDimensions((prevDimensions) => ({
            ...prevDimensions,
            [field]: e.target.value,
        }));
    };

    const handleColumnsInputChange = (field:  'columnX' | 'columnY' | 'columnGridX' | 'columnGridY') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempColumnsDimensions((prevDimensions) => ({
            ...prevDimensions,
            [field]: e.target.value,
        }));
    };

    const handleBlur = () => {
        const newWidth = +tempDimensions.width;
        const newLength = +tempDimensions.length;
        console.log(newLength, newWidth)
        try {
            if (newWidth < newLength) {
                // Swap the values if the condition is met
                dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.width`, value: newLength.toString() }));
                dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.length`, value: newWidth.toString() }));
            } else {
                dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.width`, value: newWidth.toString() }));
                dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.length`, value: newLength.toString() }));
            }
            dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.columnX`, value: tempColumnsDimensions.columnX.toString() }));
            dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.columnY`, value: tempColumnsDimensions.columnY.toString() }));
            console.log(tempColumnsDimensions)
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <InputGroup
            title={t(`system.subheader.building`)}
            extendedOpener={warehouseDialogOpen}
            extendedHandler={extenderHandler}
            content={
                <Stack spacing={2}>
                    <Stack direction='row' alignItems='center'>
                        <Typography color={!editMode ? 'text.disabled' : 'text.primary'} variant='body1'> {t(`system.building.existing`)}</Typography>
                        <Switch
                            disabled={!editMode}
                            checked={formData.system[selectedSystem].building.new}
                            onChange={(e) => dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.new`, value: e.target.checked }))}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography color={!editMode ? 'text.disabled' : 'text.primary'} variant='body1'>{t(`system.building.new`)}</Typography>
                    </Stack>

                    {!formData.system[selectedSystem].building.silo &&
                        <Stack spacing={2}>
                            <Box>
                                <Grid container direction='row' spacing={2} justifyContent='space-between' alignItems='center'>
                                    <Grid item xs>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.height`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.height`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(formData.system[selectedSystem].building.existingBuilding.height)}
                                                onChange={(e) => dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.existingBuilding.height`, value: e.target.value }))}
                                                inputProps={{
                                                    min: 1,
                                                    max: 30,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.width`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.width`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempDimensions.width)}
                                                onChange={handleInputChange('width')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.length`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.length`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempDimensions.length)}
                                                onChange={handleInputChange('length')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box>
                            <Grid container direction='row' spacing={2} justifyContent='space-between' alignItems='center'>
                                    <Grid item xs={3}>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.columnX`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.columnX`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempColumnsDimensions.columnX)}
                                                onChange={handleColumnsInputChange('columnX')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.columnY`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.columnY`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempColumnsDimensions.columnY)}
                                                onChange={handleColumnsInputChange('columnY')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.columnGridX`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.columnGridX`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempColumnsDimensions.columnGridX)}
                                                onChange={handleColumnsInputChange('columnGridX')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Stack spacing={1} textAlign='left'>
                                            <InputLabel>{t(`system.building.existingBuilding.columnGridY`)}</InputLabel>
                                            <TextField
                                                disabled={!editMode}
                                                id={`system${[selectedSystem]}.building.existingBuilding.columnGridY`}
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={trimLeadingZeros(tempColumnsDimensions.columnGridY)}
                                                onChange={handleColumnsInputChange('columnGridY')}
                                                onBlur={handleBlur}
                                                inputProps={{
                                                    min: 5,
                                                    max: 1000,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            m
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                            </Grid>
                            </Box>
                            {+formData.system[selectedSystem].building.existingBuilding.length + +formData.system[selectedSystem].building.existingBuilding.width > 0 &&
                                <WarehouseLayout selectedSystem={selectedSystem} />
                            }
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction='row' alignItems='center' justifyContent='start'>
                                            <Typography color={!editMode ? 'text.disabled' : 'text.primary'} variant='body1'> {t(`system.building.layout.false`)}</Typography>
                                            <Switch
                                                disabled={!editMode}
                                                checked={formData.system[selectedSystem].building.layout}
                                                onChange={(e) => dispatch(handleInputMethod({ path: `system.${selectedSystem}.building.layout`, value: e.target.checked }))}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <Typography color={!editMode ? 'text.disabled' : 'text.primary'} variant='body1'>{t(`system.building.layout.true`)}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>

                                        {formData.system[selectedSystem].building.layout ?
                                            <CustomAlert severity="info" collapseTrigger={formData.system[selectedSystem].building.layout} text={`${t('system.building.layout.trueText')}`} title={`${t('system.building.layout.trueTitle')}`} />
                                            :
                                            <CustomAlert severity="warning" collapseTrigger={!formData.system[selectedSystem].building.layout} text={`${t('system.building.layout.falseText')}`} title={`${t('system.building.layout.falseTitle')}`} />
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                        </Stack>
                    }
                    <Dialog
                        fullScreen
                        open={warehouseDialogOpen}
                        onClose={extenderHandler}
                    >
                        <DialogActions>
                            <IconButton aria-label="close" onClick={extenderHandler}>
                                <CloseIcon />
                            </IconButton>
                        </DialogActions>
                        <DialogContent>
                            <WarehouseLayout selectedSystem={selectedSystem} />
                        </DialogContent>
                    </Dialog>
                </Stack>
            }
        />

    )
}