import { useTranslation } from "react-i18next";
import { ISystems } from "../../../../features/interfaces";
import { Stack, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../features/redux/store";
import { useDispatch } from "react-redux";
import InputGroup from "../../InputGroup";
import { handleInputMethod } from "../../../../features/redux/reducers/formDataSlice";
import floorTypes from "../../../../data/floorTypes";

export default function Floor({selectedSystem}: {selectedSystem: keyof ISystems}) {
    const { t } = useTranslation();
    const theme = useTheme();
    const formData = useSelector((state: RootState) => state.formData);
    const editMode = useSelector((state: RootState) => state.editMode);
    const dispatch = useDispatch();

    return (
        <InputGroup
                title={t('project.subheader.floorType')}
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
                                dispatch(handleInputMethod({ path: `system.${selectedSystem}.floor`, value: v }))
                                // formikProps.setFieldValue('project.investmentType', v);
                            }}
                        >
                            {floorTypes.map((floor) => (
                                <ToggleButton
                                    className="buttongroup-deep"
                                    // sx={{ color: Boolean(formikProps.errors.project?.investmentType) ? theme.palette.error.main : '', borderColor: Boolean(formikProps.errors.project?.investmentType) ? theme.palette.error.main : '' }}
                                    value={floor}
                                    color="primary"
                                    key={floor}
                                    selected={formData.system[selectedSystem].floor === floor}
                                >
                                    {floor}
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
                                dispatch(handleInputMethod({ path: `system.${selectedSystem}.floor`, value: v }))
                                // formikProps.setFieldValue('project.investmentType', v);
                            }}
                        >
                            {floorTypes.map((floor) => (
                                <ToggleButton
                                    className="buttongroup-deep"
                                    value={floor}
                                    key={floor}
                                    color="primary"
                                    selected={formData.system[selectedSystem].floor === floor}
                                >
                                    {floor}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        {/* {formikProps.errors.project?.investmentType && <FormHelperText error>{t(`${formikProps.errors.project?.investmentType}`)}</ FormHelperText>} */}
                    </Stack>
                }
            />
    )
}