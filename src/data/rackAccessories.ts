export type TRackAccessory = {
    [category: string]: {
        [item: string]: {
            type: string;
        };
    };
};

const rackAccessories: TRackAccessory = {
    'decking': {
        grating: {type: 'grating'},
        meshPanels: {type: 'mesh panels'},
    },
    'protection': {
        corner: {type: 'corner'},
        upright: {type: 'upright'}
    }
}

export default rackAccessories