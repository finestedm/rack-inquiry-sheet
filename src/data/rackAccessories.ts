import gratingInserted from '../images/accessories/krata wpuszczana.jpg'
import gratingIssued from '../images/accessories/krata wpuszczana.jpg'
import meshPanels from '../images/accessories/półka omega.png'
import cornerProtection from '../images/accessories/Untitled.png'
import uprightProtection from '../images/accessories/1.jpg'
import plasticProtection from '../images/accessories/IMG_20170105_102643.jpg'

export type TRackAccessory = {shortName: string,fullName: string,image: string}

export type TRackAccessories = {
    [key in keyof typeof rackAccessories]: TRackAccessory[];
};


const rackAccessories = {
    'decking': [
        {shortName: 'gratingInserted', fullName: 'Grating inserted', image: gratingInserted },
        {shortName: 'gratingIssued', fullName: 'Grating issued', image: gratingIssued },
        {shortName: 'meshPanel', fullName: 'Mesh panels', image: meshPanels },
],
    'protection': [
        {shortName: 'corner', fullName: 'Corner protection', image: cornerProtection },
        {shortName: 'upright', fullName: 'Upright protection', image: uprightProtection },
        {shortName: 'plastic', fullName: 'Plastic protection', image: plasticProtection },
    ]
}

export default rackAccessories