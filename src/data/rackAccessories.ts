import gratingInserted from '../images/accessories/krata wpuszczana.jpg'
import gratingIssued from '../images/accessories/krata wpuszczana.jpg'
import meshPanels from '../images/accessories/półka omega.png'
import cornerProtection from '../images/accessories/Untitled.png'
import uprightProtection from '../images/accessories/1.jpg'
import plasticProtection from '../images/accessories/IMG_20170105_102643.jpg'

export type TRackAccessory = {
    [category: string]: {
        [item: string]: {
            fullName: string;
            image: string
        };
    };
};

const rackAccessories: TRackAccessory = {
    'decking': {
        gratingInserted: {fullName: 'Grating inserted', image: gratingInserted },
        gratingIssued: {fullName: 'Grating issued', image: gratingIssued },
        meshPanels: {fullName: 'Mesh panels', image: meshPanels },
    },
    'protection': {
        corner: {fullName: 'Corner protection', image: cornerProtection },
        upright: {fullName: 'Upright protection', image: uprightProtection },
        plastic: {fullName: 'Plastic protection', image: plasticProtection },
    }
}

export default rackAccessories