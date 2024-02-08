import { useSelector } from "react-redux";
import { ISystems, TLevelConfig } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import { Box, Grid, OutlinedInput, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputGroup from "../../InputGroup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { handleLevelConfigsChange } from "../../../../features/redux/reducers/formDataSlice";

export default function LevelConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const currentStep = useSelector((state: RootState) => state.steps.currentStep);
    const editMode = useSelector((state: RootState) => state.editMode) && currentStep !== 'summary';
    const formData = useSelector((state: RootState) => state.formData)

    const [levelConfigs, setLevelConfigs] = useState(formData.system[selectedSystem].levelConfigs)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(handleLevelConfigsChange({ selectedSystem, levelConfigs }));
    }, [levelConfigs])
    
    const { t } = useTranslation();

    return (
        <InputGroup
            title={t(`system.subheader.additionalRemarks`)}
            content={
                <Box>
                    {levelConfigs.map(config => (
                        <LevelConfig config={config} levelConfigs={levelConfigs} setLevelConfigs={setLevelConfigs}/>
                    ))}
                </Box>
            }
        />
    )
}

function LevelConfig({ config, levelConfigs, setLevelConfigs }: { config: TLevelConfig, levelConfigs: TLevelConfig[], setLevelConfigs: Dispatch<SetStateAction<TLevelConfig[]>>}) {
    const handleLevelChange = (index: number, value: number) => {
        const updatedConfig = [...config]; 
        updatedConfig[index] = value; 
        const updatedLevelConfigs = [...levelConfigs]; 
        updatedLevelConfigs[levelConfigs.indexOf(config)] = updatedConfig; 
        setLevelConfigs(updatedLevelConfigs); 
    };

    return (
        <Stack spacing={2}>
            {config.map((level, index) => (
                <CustomLevelTextField
                    key={index}
                    level={level}
                    index={index}
                    onChange={handleLevelChange}
                />
            ))}
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