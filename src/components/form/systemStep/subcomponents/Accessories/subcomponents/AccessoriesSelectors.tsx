import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardActions, CardMedia, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { ISystems } from "../../../../../../features/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../features/redux/store";
import rackAccessories, { TRackAccessory } from "../../../../../../data/rackAccessories";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AccessoriesSelectors({ selectedSystem }: { selectedSystem: keyof ISystems }) {
    return (
        <Stack spacing={4}>
            {Object.keys(rackAccessories).map(group => (
                <AccessoriesGroup group={group} key={group} /> 
            ))}
        </Stack>
    );

}

export function AccessoriesGroup({group}: {group: keyof TRackAccessory}) {
    const accessories = rackAccessories[group];

    return (
        <Box>
            <Grid container spacing={2}>
                {Object.keys(accessories).map(accessory => (
                    <AccessoryCard key={accessory} group={group} accessory={accessory} /> 
                ))}
            </Grid>
        </Box>
    )
}

export function AccessoryCard({group, accessory}: {group: keyof  TRackAccessory, accessory: keyof TRackAccessory[keyof TRackAccessory]}) {
    const editMode = useSelector((state: RootState) => state.editMode);
    const accessories = rackAccessories[group];
    const accessoryItem = accessories[accessory]
    const {t} = useTranslation();
    const theme = useTheme();
    const accessoriesState = useSelector((state: RootState) => state.formData.system.mpb.accessories)

    function handleAccessorySelection() {
        console.log(accessoriesState[group])
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
                    // backgroundColor: systemSelected ? '#000' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* {systemSelected && <CheckCircleIcon fontSize='large' sx={{ color: theme.palette.primary.main,  }} />} */}
            </div>
            <Card className={false ? 'selected-card system-card' : 'system-card'}>
                <CardActionArea
                    disabled={!editMode}
                    onClick={() => handleAccessorySelection()}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={accessoryItem.image}
                        alt={accessoryItem.fullName}
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
                            <Typography variant='h6' align='left' >{t(`${accessoryItem.fullName}`)}</Typography>
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
