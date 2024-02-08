import { useSelector } from "react-redux";
import { ISystems, TLevelConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Input, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputGroup from "../../InputGroup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { handleAddNewConfig, handleLevelConfigsChange } from "../../../../features/redux/reducers/formDataSlice";

export default function LevelConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const formData = useSelector((state: RootState) => state.formData)
    const dispatch = useDispatch();
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    console.log(levelConfigs)
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
                        <LevelConfig config={config} levelConfigs={levelConfigs} selectedSystem={selectedSystem} />
                    ))}
                    <Button onClick={addNewConfig}>Add configuration</Button>
                </Box>
            }
        />
    )
}

interface LevelConfigProps {
    selectedSystem: keyof ISystems;
    config: TLevelConfig;
    levelConfigs: TLevelConfig[];
}

function LevelConfig({ selectedSystem, config, levelConfigs }: LevelConfigProps) {

    const beamHeight = 150

    const dispatch = useDispatch();
    const [localConfig, setLocalConfig] = useState<number[]>([]);
    const [sortedConfig, setSortedConfig] = useState<number[]>([]);

    useEffect(() => {
        const sorted = [...config].sort((a, b) => a - b);
        setSortedConfig(sorted);
        setLocalConfig(sorted);
    }, [config]);

    const handleTextFieldChange = (index: number, newValue: number) => {
        const updatedLocalConfig = [...localConfig];
        updatedLocalConfig[index] = newValue;
        setLocalConfig(updatedLocalConfig);
    };

    const handleTextFieldBlur = (index: number) => {
        const newValue = Math.floor(localConfig[index] / 50) * 50;
        const updatedLocalConfig = [...localConfig];
        updatedLocalConfig[index] = newValue;
        setLocalConfig(updatedLocalConfig);
        handleLevelChange(index, newValue);
    };

    const handleLevelChange = (index: number, value: number) => {
        const updatedConfig = [...sortedConfig];
        updatedConfig[index] = value;
        const updatedLevelConfigs = [...levelConfigs];
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig;
        setSortedConfig(updatedConfig);
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };

    const handleLastLevelChange = (value: number) => {
        const updatedConfig = [...sortedConfig, value];
        const updatedLevelConfigs = [...levelConfigs];
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig;
        setSortedConfig(updatedConfig);
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };

    return (
        <Accordion>
            <AccordionSummary>Config index</AccordionSummary>
            <AccordionDetails>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Beam level</TableCell>
                                <TableCell>Height</TableCell>
                                <TableCell>Difference</TableCell>
                                <TableCell>Free level height</TableCell>
                                <TableCell>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedConfig.map((level, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="standard"
                                            size='small'
                                            value={localConfig[index]}
                                            onChange={(e) => handleTextFieldChange(index, parseInt(e.target.value))}
                                            onBlur={() => handleTextFieldBlur(index)}
                                            type="number"
                                            inputProps={{ min: 0, max: 16000 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {sortedConfig[index] - sortedConfig[index - 1]}
                                    </TableCell>
                                    <TableCell>
                                        {sortedConfig[index] - sortedConfig[index - 1] - beamHeight}
                                    </TableCell>
                                    <TableCell>
                                        <Button>Delete level</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <Button onClick={() => handleLastLevelChange(0)}>Add New Level</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );
}



function CustomLevelTextField({ index, level, onChange }: { index: number, level: number, onChange: (index: number, value: number) => void }) {
    const [currentValue, setCurrentValue] = useState(level)

    return (
        <TextField
            variant="outlined"
            inputProps={{ min: 50, max: 16000 }}
            InputProps={{ startAdornment: `level: ${index + 1} `, endAdornment: 'mm' }}
            key={index}
            value={currentValue !== index ? currentValue : 0}
            onChange={(e) => setCurrentValue(+e.target.value)}
            onBlur={() => {
                const newValue = Math.floor(+currentValue / 50) * 50;
                setCurrentValue(newValue);
                onChange(index, newValue);
            }}
        />
    )
}