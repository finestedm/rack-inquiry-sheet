import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Chip, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ISystem, ISystems } from '../../../../features/interfaces';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../features/redux/store';
import { handleSystemChange } from '../../../../features/redux/reducers/formDataSlice';

export default function SystemCard({ system }: { system: ISystem }): JSX.Element {

    const theme = useTheme()

    const formData = useSelector((state: RootState) => state.formData);
    const editMode = useSelector((state: RootState) => state.editMode);
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const systemSelected = formData.system[system.alt].selected;

    return (
        <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '.75rem',
                    right: '-14px',
                    borderRadius: '5rem',
                    height: 28,
                    width: 28,
                    backgroundColor: systemSelected ? '#000' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {systemSelected && <CheckCircleIcon fontSize='large' sx={{ color: theme.palette.primary.main,  }} />}
            </div>
            <Card className={systemSelected ? 'selected-card system-card' : 'system-card'}>
                <CardActionArea
                    disabled={!editMode}
                    onClick={e => dispatch(handleSystemChange(system.alt))}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={system.url}
                        alt={system.alt}
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
                            <Typography variant='h6' align='left' >{t(`${system.label}`)}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Divider sx={{ mb: 3, borderColor: theme.palette.text.secondary, opacity: .8 }} />
                            <Typography align='left' variant='body1' color='text.secondary'>
                                {t(`${system.description}`)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </CardActions>
            </Card>
        </Grid >
    );
}