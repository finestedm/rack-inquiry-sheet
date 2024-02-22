import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardActions, CardMedia, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from "react-redux";
import forklifts, { TForklift } from "../../../../data/forklifts";
import { ISystems } from "../../../../features/interfaces";
import { RootState } from "../../../../features/redux/store";
import { handleInputMethod } from "../../../../features/redux/reducers/formDataSlice";

export default function ForkLiftSelector({ selectedSystem }: { selectedSystem: keyof ISystems }) {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.editMode);
    const {t} = useTranslation();
    const theme = useTheme();
    const accessoriesState = useSelector((state: RootState) => state.formData.system[selectedSystem].forklift)

    return (
        <Grid container spacing={2}>
            {forklifts.map(forklift => (
                <ForkliftCard forklift={forklift} selectedSystem={selectedSystem} />
            ))}
        </Grid>
    );

}

export function ForkliftCard({forklift, selectedSystem}: {forklift: TForklift, selectedSystem: keyof ISystems}) {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.editMode);
    const {t} = useTranslation();
    const theme = useTheme();
    const forkliftState = useSelector((state: RootState) => state.formData.system[selectedSystem].forklift)
    const forkliftSelected = forklift.shortName === forkliftState


    function handleForkliftSelection() {
        dispatch(handleInputMethod({path: `system.${selectedSystem}.forklift`, value: forklift.shortName}))
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
                    backgroundColor: forkliftSelected ? '#000' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {forkliftSelected && <CheckCircleIcon fontSize='large' sx={{ color: theme.palette.primary.main,  }} />}
            </div>
            <Card className={false ? 'selected-card system-card' : 'system-card'}>
                <CardActionArea
                    disabled={!editMode}
                    onClick={() => handleForkliftSelection()}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={forklift.image}
                        alt={forklift.fullName}
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
                            <Typography variant='h6' align='left' >{t(`${forklift.fullName}`)}</Typography>
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
