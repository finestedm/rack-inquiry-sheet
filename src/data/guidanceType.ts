import rail from '../images/accessories/IMAG0675.jpg'
import inductive from '../images/accessories/obraz.png'



export type TGuidanceType = { shortName: string, fullName: string, image?: string }

export type TGuidanceTypes = TGuidanceType[];



const guidanceTypes = [
        { shortName: 'rail', fullName: 'Rail', image: rail },
        { shortName: 'inductive', fullName: 'Inductive guidance', image: inductive },
]

export default guidanceTypes