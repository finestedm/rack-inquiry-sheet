import { Alert, Box, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, Grid, InputAdornment, Slider, Stack, Switch, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ISystems } from "../../../features/interfaces";
import WorkConditions from "./subcomponents/WorkConditions";
import Building from "./subcomponents/Building";
import Loads from "./subcomponents/Loads";
import Capacity from "./subcomponents/Capacity";
import Flows from "./subcomponents/Flows";
import AdditionalRemarks from "./subcomponents/AdditionalRemarks";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/redux/store";
import RackConfigs from "./subcomponents/RackConfigs/RackConfigs";
import LevelsConfigs from "./subcomponents/RackConfigs/LevelsConfigsTable";
import Accessories from "./subcomponents/Accessories/Accessories";
import Forklifts from "./subcomponents/Forklifts/Forklifts";
import Floor from "./subcomponents/Floor";

export default function FormSystemStep({ selectedSystem }: { selectedSystem: keyof ISystems }): JSX.Element {
    const isStepSummary = useSelector((state: RootState) => state.steps.currentStep) === 'summary'
    const { t } = useTranslation();

    return (
        <Stack spacing={5}>
            {!isStepSummary &&
                <Stack direction='row' justifyContent='space-between'>
                    <Typography variant="h4" textAlign='left'>{t(`system.${selectedSystem}.header`)}</Typography>
                </Stack>
            }
            <WorkConditions selectedSystem={selectedSystem} />
            <Building selectedSystem={selectedSystem} />
            <Floor selectedSystem={selectedSystem} />
            <Loads selectedSystem={selectedSystem} />
            <Capacity selectedSystem={selectedSystem} />
            {/* <Flows selectedSystem={selectedSystem} /> */}
            <AdditionalRemarks selectedSystem={selectedSystem} />
            <RackConfigs selectedSystem={selectedSystem} />
            <Forklifts selectedSystem={selectedSystem} />
            <Accessories selectedSystem={selectedSystem} />
        </Stack >
    )
}

