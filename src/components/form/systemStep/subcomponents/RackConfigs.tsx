import { Alert, Box, Checkbox, Collapse, FormControlLabel, Grid, InputAdornment, Slider, Stack, Switch, TextField, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadTable from "./LoadTable";
import { ISystems } from "../../../../features/interfaces";
import InputGroup from "../../InputGroup";
import RackConfigsTable from "./RackConfigsTable";

export default function RackConfigs({ selectedSystem }: { selectedSystem: keyof ISystems }) {

    const { t } = useTranslation();

    return (
        <InputGroup
            title={t(`system.subheader.rackConfigs`)}
            content={
                <Stack spacing={2}>
                    <RackConfigsTable selectedSystem={selectedSystem} />
                </Stack >
            }
        />
    )
}
