import gratingInserted from '../images/accessories/krata wpuszczana.jpg'
import gratingIssued from '../images/accessories/krata nakładana.jpg'
import meshPanels from '../images/accessories/półka omega.png'
import cornerProtection from '../images/accessories/Untitled.png'
import uprightProtection from '../images/accessories/1.jpg'
import plasticProtection from '../images/accessories/IMG_20170105_102643.jpg'
import woodenEndProtection from '../images/accessories/20231115_105105.jpg'
import sigmaEndProtection from '../images/accessories/odbojnica czołowa fabryka.jpg'
import panelPelny from '../images/accessories/panel-pelny.jpg'
// import backStop from '../images/accessories/backstop-verstelbaar model 4.JPG'
import backMesh from '../images/accessories/mesh on back of rack.jpg'
import rail from '../images/accessories/IMAG0675.jpg'
import inductive from '../images/accessories/obraz.png'



export type TGuidanceType = { shortName: string, fullName: string, image?: string }

export type TGuidanceTypes = TGuidanceType[];



const guidanceTypes = [
        { shortName: 'rail', fullName: 'Rail', image: rail },
        { shortName: 'inductive', fullName: 'Inductive guidance', image: inductive },
]

export default guidanceTypes