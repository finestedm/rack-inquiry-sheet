import { useSelector } from "react-redux";
import { ISystems, TLevelsConfig } from "../../../../../features/interfaces";
import { RootState } from "../../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Grid, IconButton, Input, Menu, MenuItem, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme, useThemeProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { handleAddNewConfig, handleAddNewLevel, handleLevelConfigsChange } from "../../../../../features/redux/reducers/formDataSlice";
import LevelsConfigTable from "./LevelsConfigTable";
import AddIcon from '@mui/icons-material/Add';


export default function LevelsConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

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

        <Card>
            {levelConfigs.map(config => (
                <LevelsConfigTable configId={config.id} selectedSystem={selectedSystem} />
            ))}
            <Box m={1} textAlign='right' justifyContent='end'>
                <Button startIcon={<AddIcon />} variant="contained" onClick={addNewConfig}>Add configuration</Button>
            </Box>
        </Card >

    )
}