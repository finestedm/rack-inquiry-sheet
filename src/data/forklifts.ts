export type TForklift = {shortName: string,fullName: string,image: string}

export type TRackAccessories = {
    [key in keyof typeof forklifts]: TForklift[];
};


const forklifts = [
    {shortName: 'handtruck', fullName: 'Pallet Hand Truck', image: 'none' },    
    {shortName: 'EJC', fullName: 'EJC', image: 'none' },
        {shortName: 'ETV', fullName: 'ETV', image: 'none' },
    {shortName: 'ETV-Q', fullName: 'ETV-Q', image: 'none' },

        {shortName: 'Cantilever', fullName: 'Cantilever', image: 'none'},
        {shortName: 'System', fullName: 'System Truck', image: 'none'},
        
]

export default forklifts