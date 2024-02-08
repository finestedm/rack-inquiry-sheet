import { useSelector } from "react-redux";
import { ISystems, TLevelConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, OutlinedInput, Stack, TextField, Typography, useTheme } from "@mui/material";
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

function LevelConfig({ selectedSystem, config, levelConfigs }: {selectedSystem: keyof ISystems, config: TLevelConfig, levelConfigs: TLevelConfig[]}) {
   
    const dispatch = useDispatch();

    const handleLevelChange = (index: number, value: number) => {
        const updatedConfig = [...config];
        updatedConfig[index] = value;
        const sortedConfig = updatedConfig.sort((a, b) => a - b);
        const updatedLevelConfigs = [...levelConfigs];
        updatedLevelConfigs[levelConfigs.indexOf(config)] = sortedConfig;
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };
    
    const handleLastLevelChange = (value: number) => {
        const updatedConfig = [...config, value]; 
        const updatedLevelConfigs = [...levelConfigs]; 
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig; 
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };


    const renderNextInput = Math.max(...config);

    return (
        <Accordion>
            <AccordionSummary>
                Config index
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    {config.map((level, index) => (
                        <CustomLevelTextField
                            key={index}
                            level={config[index]}
                            index={index}
                            onChange={handleLevelChange}
                        />
                    ))}
                    {renderNextInput &&
                        <CustomLevelTextField
                            key={config.length}
                            level={0}
                            index={config.length}
                            onChange={handleLastLevelChange}
                        />
                    }
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}


function CustomLevelTextField({index, level, onChange}: {index: number, level: number, onChange: (index: number, value: number) => void}) {
    const [currentValue, setCurrentValue] = useState(level)

    return (
        <TextField
            variant="outlined" 
            inputProps={{min: 50, max: 16000}}
            InputProps={{startAdornment: index, endAdornment: 'mm'}}
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