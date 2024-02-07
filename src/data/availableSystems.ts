import { ISystem } from "../features/interfaces";
import mpb from "../images/rack-types/302BAE8A3789B20FFBECF7F6B7E2EFDD.webp";
import shelf from "../images/rack-types/39308baa-6813-4b64-a276-fdaa10980072.webp";
import upc from "../images/rack-types/stage-shuttle-channel-racking.jpg";
import flow from "../images/rack-types/E6CB4541182C215F85873AF18CF9A206.webp";
import mobile from "../images/rack-types/stage-mobile-racking.jpg";
import driveIn from "../images/rack-types/5DCB89705242D2E7B79E0B2855A43C4A.webp";

const availableSystems: ISystem[] = [
    {
        url: mpb,
        alt: 'mpb',
        label: 'system.mpb.label',
        labelShort: 'system.mpb.labelshort',
        description: 'system.mpb.description'
    },
    {
        url: shelf,
        alt: 'shelf',
        label: 'system.shelf.label',
        labelShort: 'system.shelf.labelshort',
        description: 'system.shelf.description'
    },
    {
        url: upc,
        alt: 'upc',
        label: ('system.upc.label'),
        labelShort: 'system.upc.labelshort',
        description: 'system.upc.description'
    },
    {
        url: flow,
        alt: 'flow',
        label: ('system.flow.label'),
        labelShort: 'system.flow.labelshort',
        description: 'system.flow.description'
    },
    {
        url: mobile,
        alt: 'mobile',
        label: ('system.mobile.label'),
        labelShort: 'system.mobile.labelshort',
        description: 'system.mobile.description'
    },
    {
        url: driveIn,
        alt: 'drivein',
        label: ('system.drivein.label'),
        labelShort: 'system.drivein.labelshort',
        description: 'system.drivein.description'
    }
]

export default availableSystems