import { Box, Button, ButtonGroup, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, Switch, TextField, TextFieldProps, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { MenuProps } from "../customerStep/FormCustomerStep";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/redux/store";
import { handleInputMethod } from "../../../features/redux/reducers/formDataSlice";
import { FormikProps, useFormikContext, Field } from 'formik'
import { IFormData } from "../../../features/interfaces";
import CustomTextField from "../CustomTextField";
import WarehouseLayout from "../systemStep/subcomponents/WarehouseLayout";
import GanttGraph from "./subcomponents/GanttGraph";
import investmentTypes from "../../../data/investmentType";
import supplyChainParts from "../../../data/supplyChainParts";
import existingWMSTypes from "../../../data/existingWMSTypes";
import InputGroup from "../InputGroup";

export default function FormProjectStep(): JSX.Element {

    const { t } = useTranslation();
    const theme = useTheme();
    const formData = useSelector((state: RootState) => state.formData);
    const editMode = useSelector((state: RootState) => state.editMode);
    const dispatch = useDispatch();
    const formikProps: FormikProps<IFormData> = useFormikContext(); // Access formikProps from context

    const supplyChainPartsWithIcon = [
        {
            name: t(`project.supplyChainParts.${supplyChainParts[0]}`),
            icon: <PrecisionManufacturingIcon />,
        },
        {
            name: t(`project.supplyChainParts.${supplyChainParts[1]}`),
            icon: <WarehouseIcon />,
        },
        {
            name: t(`project.supplyChainParts.${supplyChainParts[2]}`),
            icon: <LocalShippingIcon />,
        },
        {
            name: t(`project.supplyChainParts.${supplyChainParts[3]}`),
            icon: <CheckroomIcon />,
        },
        {
            name: t(`project.supplyChainParts.${supplyChainParts[4]}`),
            icon: <SettingsInputComponentIcon />,
        },
    ];

    const investmentTypesTranslated = investmentTypes.map(type => t(type))

    const existingWMSTypesTranslated = existingWMSTypes.map(wms => t(`project.it.existingSystem.label.${wms}`))

    return (
        <Stack spacing={5}>
            <Typography variant="h4" textAlign='left'>{t('project.header')}</Typography>
            <InputGroup
                title={t('project.subheader.various')}
                content={
                    <Stack spacing={2}>
                        <CustomTextField
                            fieldName="project.opNumber"
                            type="number"
                        />
                    </Stack>
                }
            />
            <InputGroup
                title={t('project.subheader.investmentType')}
                content={
                    <Stack spacing={2}>
                        <ToggleButtonGroup
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            color='primary'
                            disabled={!editMode}
                            exclusive
                            fullWidth
                            aria-label="investment type buttons"
                            onChange={(e, v) => {
                                dispatch(handleInputMethod({ path: 'project.investmentType', value: v }))
                                formikProps.setFieldValue('project.investmentType', v);
                            }}
                        >
                            {investmentTypesTranslated.map((investmentType) => (
                                <ToggleButton
                                    className="buttongroup-deep"
                                    sx={{ color: Boolean(formikProps.errors.project?.investmentType) ? theme.palette.error.main : '', borderColor: Boolean(formikProps.errors.project?.investmentType) ? theme.palette.error.main : '' }}
                                    value={investmentTypesTranslated.indexOf(investmentType)}
                                    color="primary"
                                    key={investmentType}
                                    selected={formData.project.investmentType === investmentTypesTranslated.indexOf(investmentType)}
                                >
                                    {investmentType}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        <ToggleButtonGroup
                            sx={{ display: { sm: 'none' } }}
                            size="small"
                            className="buttongroup-deep"
                            exclusive
                            disabled={!editMode}
                            aria-label="investment type buttons"
                            orientation="vertical"
                            fullWidth
                            color='primary'
                            onChange={(e, v) => {
                                dispatch(handleInputMethod({ path: 'project.investmentType', value: v }))
                                formikProps.setFieldValue('project.investmentType', v);
                            }}
                        >
                            {investmentTypesTranslated.map((investmentType) => (
                                <ToggleButton
                                    className="buttongroup-deep"
                                    value={investmentTypesTranslated.indexOf(investmentType)}
                                    key={investmentType}
                                    color="primary"
                                    selected={formData.project.investmentType === investmentTypesTranslated.indexOf(investmentType)}
                                >
                                    {investmentType}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        {formikProps.errors.project?.investmentType && <FormHelperText error>{t(`${formikProps.errors.project?.investmentType}`)}</ FormHelperText>}
                    </Stack>
                }
            />
            <InputGroup
                title={t('project.subheader.milestones')}
                content={
                    <GanttGraph />
                }
            />
        </Stack >

    )
}