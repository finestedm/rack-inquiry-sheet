import { useSelector } from "react-redux";
import { ISystems, TLevelConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Box, Button, Grid, OutlinedInput, Stack, TextField, Typography, useTheme } from "@mui/material";
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

    function addNewConfig() {
        dispatch(handleAddNewConfig(selectedSystem));
    };
   
    const { t } = useTranslation();

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
        const updatedLevelConfigs = [...levelConfigs]; 
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig; 
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };

    const handleLastLevelChange = (value: number) => {
        const updatedConfig = [...config, value]; 
        const updatedLevelConfigs = [...levelConfigs]; 
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig; 
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs: updatedLevelConfigs }));
    };

    return (
        <Stack spacing={2}>
            {config.sort().map((level, index) => (
                <CustomLevelTextField
                    key={index}
                    level={level}
                    index={index}
                    onChange={handleLevelChange}
                />
            ))}
            <CustomLevelTextField
                key={config.length}
                level={0} // Assuming the default value is 0 for the new input
                index={config.length}
                onChange={handleLastLevelChange}
            />
        </Stack>
    )
}


function CustomLevelTextField({index, level, onChange}: {index: number, level: number, onChange: (index: number, value: number) => void}) {
    const [currentValue, setCurrentValue] = useState(level)

    return (
        <TextField
            variant="outlined" 
            inputProps={{min: 50, max: 16000}}
            InputProps={{endAdornment: 'mm'}}
            key={index}
            value={currentValue}
            onChange={(e) => setCurrentValue(+e.target.value)}
            onBlur={() => {
                const newValue = Math.floor(+currentValue / 50) * 50;
                setCurrentValue(newValue);
                onChange(index, newValue);
            }}
        />
    )
}