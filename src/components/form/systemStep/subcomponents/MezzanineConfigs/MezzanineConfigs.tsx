import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import LevelsConfigTable from "../RackConfigs/LevelsConfigTable";
import { ISystems } from "../../../../../features/interfaces";
import LevelConfigDrawing from "../RackConfigs/LevelConfigDrawing";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../features/redux/store";
import { useTranslation } from "react-i18next";

export default function MezzanineConfigs({selectedSystem}: {selectedSystem: keyof ISystems}) {
    const formData = useSelector((state: RootState) => state.formData)
    const levelConfigs = formData.system[selectedSystem].levelConfigs
    const selectedLevelConfig = levelConfigs.length > 0 && levelConfigs[0]
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    if (selectedLevelConfig) {
        return (
        <Stack spacing={2}>
            <Box>
                <LevelsConfigTable selectedSystem={selectedSystem} configId={levelConfigs[0].id} />
            </Box>
            <Box sx={{ px: 2 }}>
                <Typography gutterBottom variant="h6" color="textPrimary">Podgląd</Typography>
                <LevelConfigDrawing levels={selectedLevelConfig.levels} />
            </Box>
        </Stack>
        )
    } else {
        return (
            <Typography>'Brak konfiguracji'</Typography>
        )
    }
}