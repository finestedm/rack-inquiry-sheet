import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormData, ILoad, ILoadsTypes, IFlow, LoadFieldValue, ISystems, IMilestones, ISystemData, CopySystemDataPayload, IEquipment, TLevelsConfig, TRackConfig, TLevelsDetails } from '../../interfaces';
import { loadsToAdd } from '../../../data/typicalLoadSizes';
import { emptyFlow } from '../../../data/flowStations';
import generateRandomId from '../../variousMethods/generateRandomId';
import { TRackAccessories, TRackAccessory } from '../../../data/rackAccessories';

const initialFormDataState: IFormData = {

    version: 'racks-240207alpha',
    sales: {
        contactPerson: '',
        contactPersonRole: '',
    },
    customer: {
        name: '',
        sapNumber: null,
        industryName: [],
        industryNameOther: '',
        address: '',
        contactPerson: '',
        contactPersonRole: '',
        contactPersonPhone: '',
        contactPersonMail: '',
        relations: -1,
        salesHistoryValue: undefined,
        ownedForklifts: undefined,
        ownedRacks: undefined,
        ownedOther: '',
        creditManagement: undefined,
        currency: undefined
    },
    project: {
        opNumber: undefined,
        tender: false,
        investmentLocation: '',
        investmentType: -1,
        consultingCompany: false,
        competitor: false,
        milestones: {
            concept: (() => {
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 1);
                return { start: startDate, end: endDate };
            })(),
            officialOffer: (() => {
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() + 1);
                const endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 3);
                return { start: startDate, end: endDate };
            })(),
            order: {
                start: new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate()),
                end: new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate())
            },
            implementation: {
                start: new Date(new Date().getFullYear(), new Date().getMonth() + 12, new Date().getDate()),
                end: new Date(new Date().getFullYear(), new Date().getMonth() + 18, new Date().getDate())
            },
            launch: {
                start: new Date(new Date().getFullYear(), new Date().getMonth() + 18, new Date().getDate()),
                end: new Date(new Date().getFullYear(), new Date().getMonth() + 18, new Date().getDate())
            },
        }
    },
    system: {
        mpb: {
            selected: true,
            workConditions: {
                temperature: [20, 30],
                freezer: false,
                dangerousMaterials: false,
                other: '',
            },
            building: {
                new: false,
                silo: false,
                existingBuilding: {
                    height: 0,
                    width: 0,
                    length: 0,
                    equipment: []
                },
                incline: 0
            },
            loads: [],
            flow: [emptyFlow],
            rackConfigs: [],
            levelConfigs: [],
            accessories:  {decking: undefined, protection: undefined},
            additionalRemarks: '',
        },
        // shelf: {
        //     selected: false,
        //     workConditions: {
        //         temperature: [20, 30],
        //         freezer: false,
        //         dangerousMaterials: false,
        //         other: '',
        //     },
        //     building: {
        //         new: false,
        //         silo: false,
        //         existingBuilding: {
        //             height: 0,
        //             width: 0,
        //             length: 0,
        //             equipment: []
        //         },
        //         incline: 0
        //     },
        //     loads: [],
        //     flow: [emptyFlow],
        //     additionalRemarks: '',
        // },
        // upc: {
        //     selected: false,
        //     workConditions: {
        //         temperature: [20, 30],
        //         freezer: false,
        //         dangerousMaterials: false,
        //         other: '',
        //     },
        //     building: {
        //         new: false,
        //         silo: false,
        //         existingBuilding: {
        //             height: 0,
        //             width: 0,
        //             length: 0,
        //             equipment: []
        //         },
        //         incline: 0
        //     },
        //     loads: [],
        //     flow: [emptyFlow],
        //     additionalRemarks: '',
        // },
        // flow: {
        //     selected: false,
        //     workConditions: {
        //         temperature: [20, 30],
        //         freezer: false,
        //         dangerousMaterials: false,
        //         other: '',
        //     },
        //     building: {
        //         new: false,
        //         silo: false,
        //         existingBuilding: {
        //             height: 0,
        //             width: 0,
        //             length: 0,
        //             equipment: []
        //         },
        //         incline: 0
        //     },
        //     loads: [],
        //     flow: [emptyFlow],
        //     additionalRemarks: '',
        // },
        // mobile: {
        //     selected: false,
        //     workConditions: {
        //         temperature: [20, 30],
        //         freezer: false,
        //         dangerousMaterials: false,
        //         other: '',
        //     },
        //     building: {
        //         new: false,
        //         silo: false,
        //         existingBuilding: {
        //             height: 0,
        //             width: 0,
        //             length: 0,
        //             equipment: []
        //         },
        //         incline: 0
        //     },
        //     loads: [],
        //     flow: [emptyFlow],
        //     additionalRemarks: '',
        // },
        // drivein: {
        //     selected: false,
        //     workConditions: {
        //         temperature: [20, 30],
        //         freezer: false,
        //         dangerousMaterials: false,
        //         other: '',
        //     },
        //     building: {
        //         new: false,
        //         silo: false,
        //         existingBuilding: {
        //             height: 0,
        //             width: 0,
        //             length: 0,
        //             equipment: []
        //         },
        //         incline: 0
        //     },
        //     loads: [],
        //     flow: [emptyFlow],
        //     additionalRemarks: '',
        // }
    },
}

const formDataSlice = createSlice({
    name: 'formData',
    initialState: initialFormDataState,
    reducers: {
        setFormData: (state: any, action: { payload: IFormData; }) => {
            return { ...state, ...action.payload };
        },
        resetFormData: () => {
            return initialFormDataState;
        },
        handleInputMethod: (state: any, action: PayloadAction<{ path: string; value: any }>) => {
            const { path, value } = action.payload;
            const keys = path.split('.');
            let currentObject: any = state;

            for (let i = 0; i < keys.length - 1; i++) {
                if (currentObject[keys[i]] === undefined) {
                    currentObject[keys[i]] = {};
                }
                currentObject = currentObject[keys[i]];
            }

            currentObject[keys[keys.length - 1]] = value;
        },

        // In your reducer file

        handleDateChanges: (state, action: PayloadAction<IMilestones>) => {
            return {
                ...state,
                project: {
                    ...state.project,
                    milestones: action.payload,
                },
            };
            // ... other cases ...
        },


        // Reducer for handling adding a new load
        handleAddLoad: (
            state: IFormData,
            action: PayloadAction<{ systemName: keyof ISystems; loadType: string }>
        ) => {
            const { systemName, loadType } = action.payload;

            let newLoad: ILoad = loadsToAdd[loadType];
            newLoad = { ...newLoad, id: generateRandomId() }

            const updatedSystemLoads = state.system[systemName].loads.concat(newLoad);

            return {
                ...state,
                system: {
                    ...state.system,
                    [systemName]: {
                        ...state.system[systemName],
                        loads: updatedSystemLoads,
                    },
                },
            };
        },

        handleAddFlow: (state: IFormData, action: PayloadAction<{ systemName: keyof ISystems; }>) => {
            const { systemName } = action.payload;

            const updatedSystemStations = state.system[systemName].flow.concat(emptyFlow);

            return {
                ...state,
                system: {
                    ...state.system,
                    [systemName]: {
                        ...state.system[systemName],
                        flow: updatedSystemStations,
                    },
                },
            };
        },


        handleSystemChange: (state: { system: { [x: string]: any; }; }, action: PayloadAction<string>) => {
            const alt = action.payload.toLowerCase();
            const system = state.system[alt];
            if (system) {
                state.system[alt] = {
                    ...system,
                    selected: !system.selected,
                };
            }
        },

        handleLoadChange: (state: IFormData, action: PayloadAction<{ newRow: any, selectedSystem: keyof ISystems; }>) => {

            const { newRow, selectedSystem } = action.payload;

            const loadIndex = state.system[selectedSystem].loads.findIndex((load) => load.id === newRow.id);
            if (loadIndex !== -1) {
                // If a matching load is found, replace it with the new row
                state.system[selectedSystem].loads[loadIndex] = newRow;
            }
        },

        handleDeleteLoad: (state: IFormData, action: PayloadAction<{ updatedLoads: ILoad[]; selectedSystem: keyof ISystems }>) => {
            const { updatedLoads, selectedSystem } = action.payload;

            state.system[selectedSystem].loads = updatedLoads;
        },

        handleFlowChange: (state: IFormData, action: PayloadAction<{ newRow: IFlow, selectedSystem: keyof ISystems; }>) => {
            const { newRow, selectedSystem } = action.payload;



            // Replace the old load object with the new one at the specified index
            if (typeof (newRow.id) === 'number') {
                state.system[selectedSystem].flow[newRow.id - 1] = newRow;
            }
        },

        handleDeleteFlow: (state: IFormData, action: PayloadAction<{ updatedFlows: IFlow[]; selectedSystem: keyof ISystems }>) => {
            const { updatedFlows, selectedSystem } = action.payload;
            state.system[selectedSystem].flow = updatedFlows;
        },

        handleIndustryChange: (state, action) => {
            const { industryName, value } = action.payload;
            state.customer.industryName = [...industryName, value];
        },


        updateEquipment: (state: IFormData, action: PayloadAction<{ updatedEquipment: IEquipment[]; selectedSystem: keyof ISystems }>) => {
            const { updatedEquipment, selectedSystem } = action.payload;

            // Update the equipment in the selected system
            state.system[selectedSystem].building.existingBuilding.equipment = updatedEquipment;
        },

        handleLevelConfigsChange: (
            state: IFormData,
            action: PayloadAction<{ selectedSystem: keyof ISystems; levelConfigs: TLevelsConfig[] }>
        ) => {
            const { selectedSystem, levelConfigs } = action.payload;
            // Assuming that 'selectedSystem' corresponds to the system in the form data
            state.system[selectedSystem].levelConfigs = levelConfigs;
        },

        handleRackConfigsChange: (
            state: IFormData,
            action: PayloadAction<{ selectedSystem: keyof ISystems; rackConfigs: TRackConfig[] }>
        ) => {
            const { selectedSystem, rackConfigs } = action.payload;
            state.system[selectedSystem].rackConfigs = rackConfigs;
        },

        handleAddNewConfig: (state, action: PayloadAction<keyof ISystems>) => {
            const selectedSystem = action.payload;
            // Create a new configuration object with an id and an empty levels array
            const newConfig: TLevelsConfig = { id: generateRandomId(), levels: [] };
            // Add the new configuration to the specified system
            state.system[selectedSystem].levelConfigs.push(newConfig);
        },

        handleAddNewLevel: (state, action: PayloadAction<{ selectedSystem: keyof ISystems, configId: number }>) => {
            const { selectedSystem, configId } = action.payload;
            const configIndex = state.system[selectedSystem].levelConfigs.findIndex(config => config.id === configId);
            if (configIndex !== -1) {
                const levels = state.system[selectedSystem].levelConfigs[configIndex].levels;
                const lastLevel = levels.length > 0 ? levels[levels.length - 1].height : 0;
                const newHeight = lastLevel + 1000;
                const newLevelDetails: TLevelsDetails = { id: levels.length + 1, height: newHeight, accessory: '' };
                state.system[selectedSystem].levelConfigs[configIndex].levels.push(newLevelDetails);
            } else {
                console.error(`Configuration with id ${configId} not found in system ${selectedSystem}`);
            }
        },

        handleAddNewRack(state, action: PayloadAction<keyof ISystems>) {
            const selectedSystem = action.payload
            const newRack = {
                id: generateRandomId(),
                quantity: 0,
                depth: 1100,
                load: 500,
                bays: [],
            }
            state.system[selectedSystem].rackConfigs.push(newRack);
        },

        handleEditAccessories(state: IFormData, action: PayloadAction<{ selectedSystem: keyof ISystems; group: keyof TRackAccessories, accessoryName: TRackAccessory['shortName'] }>) {
            const { selectedSystem, group, accessoryName } = action.payload;
        
            // Update the state with the selected accessoryName
            state.system[selectedSystem].accessories[group] = accessoryName;
        }
    

        // ... add other reducers here if needed
    },
});

export const { setFormData, handleInputMethod, handleAddLoad, handleSystemChange, handleLoadChange, handleIndustryChange, handleDeleteLoad, handleAddFlow, handleDeleteFlow, handleFlowChange, resetFormData, handleDateChanges, updateEquipment, handleLevelConfigsChange, handleAddNewConfig, handleAddNewLevel, handleAddNewRack, handleRackConfigsChange, handleEditAccessories } = formDataSlice.actions;
export default formDataSlice.reducer;
export { initialFormDataState }