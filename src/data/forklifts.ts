export type TForklift = {shortName: string,fullName: string,image: string}

export type TRackAccessories = {
    [key in keyof typeof forklifts]: TForklift[];
};


const forklifts = [
        {shortName: 'EJC', fullName: 'EJC', image: 'none' },
        {shortName: 'ETV', fullName: 'ETV', image: 'none' },
        {shortName: 'Cantilever', fullName: 'Cantilever', image: 'none'},
]

export default forklifts