import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardActions, CardMedia, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { ISystems } from "../../../../../../features/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../features/redux/store";
import rackAccessories, { TRackAccessories, TRackAccessory } from "../../../../../../data/rackAccessories";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from "react-redux";
import { handleEditAccessories } from "../../../../../../features/redux/reducers/formDataSlice";

export default function AccessoriesSelectors({ selectedSystem }: { selectedSystem: keyof ISystems }) {
    return (
        <Stack spacing={4}>
            {Object.keys(rackAccessories).map(group => (
                <AccessoriesGroup group={group as keyof TRackAccessories} key={group} selectedSystem={selectedSystem} /> 
            ))}
        </Stack>
    );

}

export function AccessoriesGroup({group, selectedSystem}: {group: keyof TRackAccessories, selectedSystem: keyof ISystems}) {
    const accessories = rackAccessories[group];

    return (
        <Box>
            <Grid container spacing={2}>
                {accessories.map(accessory => (
                    <AccessoryCard key={accessory.shortName} group={group} accessory={accessory} selectedSystem={selectedSystem} /> 
                ))}
            </Grid>
        </Box>
    )
}

export function AccessoryCard({group, accessory, selectedSystem}: {group: keyof  TRackAccessories, accessory: TRackAccessory, selectedSystem: keyof ISystems}) {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.editMode);
    const {t} = useTranslation();
    const theme = useTheme();
    const accessoriesState = useSelector((state: RootState) => state.formData.system.mpb.accessories)
    const accessorySelected = accessoriesState[group] === accessory.shortName

    function handleAccessorySelection() {
        dispatch(handleEditAccessories({selectedSystem, group, accessoryName: accessory.shortName}))
    }

    return (
        // <></>
    <Grid item xs={6} md={3} sx={{ position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '.75rem',
                    right: '-14px',
                    borderRadius: '5rem',
                    height: 28,
                    width: 28,
                    backgroundColor: accessorySelected ? '#000' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {accessorySelected && <CheckCircleIcon fontSize='large' sx={{ color: theme.palette.primary.main,  }} />}
            </div>
            <Card className={false ? 'selected-card system-card' : 'system-card'}>
                <CardActionArea
                    disabled={!editMode}
                    onClick={() => handleAccessorySelection()}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={accessory.image}
                        alt={accessory.fullName}
                        sx={{ position: 'relative' }}
                    >
                    </CardMedia>
                </CardActionArea>
                <CardActions>
                    <Accordion disableGutters elevation={0} sx={{ backgroundColor: 'transparent' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography variant='h6' align='left' >{t(`${accessory.fullName}`)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Divider sx={{ mb: 3, borderColor: theme.palette.text.secondary, opacity: .8 }} />
                            <Typography align='left' variant='body1' color='text.secondary'>
                                {t(``)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </CardActions>
            </Card>
    </Grid >
    )
}
