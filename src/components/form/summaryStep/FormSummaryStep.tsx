import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, InputLabel, Link, List, ListItem, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from "react-redux";
import { RootState } from "../../../features/redux/store";
import SystemAccordion from "./subcomponents/SystemTabs";
import isPartUnchanged from "../../../features/variousMethods/isPartUnchanged";
import { IFormData, ISystemData, ISystems, TPart } from "../../../features/interfaces";
import industries from "../../../data/industries";
import investmentTypes from "../../../data/investmentType";
import supplyChainParts from "../../../data/supplyChainParts";
import existingWMSTypes from "../../../data/existingWMSTypes";
import BoxForTextPair from "./subcomponents/BoxForTextPair";
import SystemsAccordion from "./subcomponents/SystemTabs";
import SystemsTabs from "./subcomponents/SystemTabs";

export default function FormSummaryStep() {
    const formData = useSelector((state: RootState) => state.formData)
    const { t } = useTranslation();
    const theme = useTheme();
    const textRowSpacing = 1

    const industriesTranslated = industries.map(industry => t(`industry.${industry}`))
    const investmentTypesTranslated = investmentTypes.map(type => t(type))
    const supplyChainPartsTranslated = supplyChainParts.map((part) => t(`project.supplyChainParts.${part}`))
    const existingWMSTypesTranslated = existingWMSTypes.map(wms => t(`project.it.existingSystem.label.${wms}`))

    function toBeRendered({ part, step }: { part: TPart, step: keyof IFormData }) {
        //@ts-ignore
        return formData[step][part] && (!isPartUnchanged({ formData, step, part }))
    }

    function CustomHeaderWithDivider({ headerText }: { headerText: string }) {
        return <Divider><Typography variant="h5">{t(`${headerText}`)}</Typography></Divider>
    }

    return (
        <Stack spacing={8} textAlign='left'>
            <Typography variant="h4">{t('summary.header')}</Typography>
            <Stack spacing={2} className='summary-sales'>
                <CustomHeaderWithDivider headerText='sales.header' />
                <Typography>
                    <Typography fontWeight={700}>
                        {formData.sales.salesUnit}
                    </Typography>
                    {formData.sales.contactPerson}
                    <Typography color='text.secondary' component='span'>
                        {(formData.sales.contactPerson && formData.sales.contactPersonRole) && `, `}
                        {formData.sales.contactPersonRole && formData.sales.contactPersonRole}
                    </Typography>
                </Typography>
            </Stack>
            <Stack spacing={2} className='summary-customer'>
                <CustomHeaderWithDivider headerText='customer.header' />
                <Stack component={Typography} spacing={textRowSpacing}>
                    {formData.customer.name && <BoxForTextPair valueText={formData.customer.name} endText={`${formData.customer.sapNumber ? `(${formData.customer.sapNumber})` : ''} `} />}
                    {formData.customer.address}
                </Stack>
                <Stack component={Typography}>
                    {toBeRendered({ step: 'customer', part: 'contactPerson' }) &&
                        <BoxForTextPair
                            valueText={formData.customer.contactPerson.toString()}
                            endText={formData.customer.contactPersonRole.toString()}
                        />
                    }
                    {toBeRendered({ step: 'customer', part: 'contactPersonPhone' }) && <Link href={`tel:${formData.customer.contactPersonPhone}`}>{formData.customer.contactPersonPhone}</Link>}
                    {toBeRendered({ step: 'customer', part: 'contactPersonMail' }) && <Link href={`mailto:${formData.customer.contactPersonMail}`}>{formData.customer.contactPersonMail}</Link>}
                </Stack>
                <Stack component={Typography} spacing={textRowSpacing}>
                    {toBeRendered({ step: 'customer', part: 'relations' }) && <BoxForTextPair keyText={t('customer.relations.type')} valueText={t(`customer.relations.${formData.customer.relations}`)} />}
                    {formData.customer.salesHistoryValue && <BoxForTextPair keyText={t('customer.relations.saleshistoryvalue')} valueText={formData.customer.salesHistoryValue.toString()} endText={`${formData.customer.currency} ${t('customer.currency.perYear')}`} />}
                    {formData.customer.creditManagement && <BoxForTextPair keyText={t('customer.relations.creditmanagement')} valueText={formData.customer.creditManagement.toString()} endText={formData.customer.currency?.toString()} />}
                    <Box>
                        {(formData.customer.ownedForklifts || formData.customer.ownedRacks || formData.customer.ownedOther) && t('customer.relations.input.owned')}
                        <Box component='ul' style={{ margin: 0 }}>
                            {formData.customer.ownedForklifts && <li>{t('customer.relations.input.forklifts')}: <Typography component='span' fontWeight={700}>{formData.customer.ownedForklifts}</Typography></ li>}
                            {formData.customer.ownedRacks && <li>{t('customer.relations.input.racks')}: <Typography component='span' fontWeight={700}>{formData.customer.ownedRacks}</Typography></ li>}
                            {formData.customer.ownedOther && <li>{t('customer.relations.input.other')}: <Typography component='span' fontWeight={700}>{formData.customer.ownedOther}</Typography></ li>}
                        </Box>
                    </Box>
                    {formData.customer.industryName.length > 0 &&
                        <Box display="flex" flexWrap="wrap" alignItems='baseline'>
                            <Typography mr={1}>{t('customer.industry')}: </Typography>
                            <Stack minWidth={300} direction='row' flex={1} flexWrap="wrap" rowGap={1} >{formData.customer.industryName.map(industry => <Chip sx={{ borderRadius: .5, marginRight: 1 }} key={industry} label={industriesTranslated[industries.indexOf(industry)]} />)}</Stack>
                        </Box>
                    }
                </Stack>
            </Stack>
            <Stack spacing={2} className='summary-project'>
                <CustomHeaderWithDivider headerText='project.header' />
                <Stack component={Typography} spacing={textRowSpacing}>
                    {formData.project.opNumber && <BoxForTextPair keyText={t('project.opNumber')} valueText={formData.project.opNumber} />}
                    {formData.project.investmentLocation && <BoxForTextPair keyText={t('project.investmentLocation')} valueText={formData.project.investmentLocation} />}
                    {formData.project.tender && <BoxForTextPair valueText={t('project.tender')} />}
                    {formData.project.consultingCompany && <BoxForTextPair valueText={t('project.consultingCompany')} />}
                    {formData.project.competitor && <BoxForTextPair valueText={t('project.competitor')} />}
                    {formData.project.investmentType !== -1 && <BoxForTextPair keyText={t('project.subheader.investmentType')} valueText={investmentTypesTranslated[formData.project.investmentType]} />}
                </Stack>
            </Stack>
            <SystemsTabs />
        </Stack>
    )
}

