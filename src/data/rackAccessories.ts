import gratingInserted from '../images/accessories/krata wpuszczana.jpg'
import gratingIssued from '../images/accessories/krata wpuszczana.jpg'
import meshPanels from '../images/accessories/półka omega.png'
import cornerProtection from '../images/accessories/Untitled.png'
import uprightProtection from '../images/accessories/1.jpg'
import plasticProtection from '../images/accessories/IMG_20170105_102643.jpg'
import woodenEndProtection from '../images/accessories/20231115_105105.jpg'
import sigmaEndProtection from '../images/accessories/odbojnica czołowa fabryka.jpg'

export type TRackAccessory = { shortName: string, fullName: string, image?: string }

export type TRackAccessories = {
    [key in keyof typeof rackAccessories]: TRackAccessory[];
};


const rackAccessories = {
    'decking': [
        { shortName: 'none', fullName: 'No decking' },
        { shortName: 'gratingInserted', fullName: 'Grating inserted', image: gratingInserted },
        { shortName: 'gratingIssued', fullName: 'Grating issued', image: gratingIssued },
        { shortName: 'meshPanel', fullName: 'Mesh panels', image: meshPanels },
    ],
    'protection': [
        { shortName: 'corner', fullName: 'Corner protection', image: cornerProtection },
        { shortName: 'upright', fullName: 'Upright protection', image: uprightProtection },
        { shortName: 'plastic', fullName: 'Plastic protection', image: plasticProtection },
    ],
    'endProtection': [
        { shortName: 'none', fullName: 'No end frame protection'},
        { shortName: 'wood', fullName: 'Wooden Beam', image: woodenEndProtection },
        { shortName: 'metal', fullName: 'Sigma Beam', image: sigmaEndProtection },
    ]
}

export default rackAccessories