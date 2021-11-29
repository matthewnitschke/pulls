import { useEffect, useReducer } from 'react';
import { v4 as uuid } from 'uuid';

import settings from 'src/components/settings/settings-utils.js';

export default function useStructure(prOrder) {
    let [ structure, dispatch ] = useReducer((state, action) => {
        switch(action.type) {
            case 'groupPrs': return sortStructure(groupPrs(state, action), prOrder);
            case 'deleteGroup': return sortStructure(deleteGroup(state, action), prOrder);
            case 'addPrsToGroup': return sortStructure(addPrsToGroup(state, action), prOrder);
            case 'setGroupName': return sortStructure(setGroupName(state, action), prOrder);
        }
    }, settings.get('savedStructure') ?? []);
    useEffect(() => settings.set('savedStructure', structure), [structure])

    let flattenedStructure = flattenStructure(structure);

    let updatedStructure = [
        ...filterStructure(structure, prId => prOrder.includes(prId)),
        ...prOrder.filter(prId => !flattenedStructure.includes(prId))
    ];

    return {
        structure: updatedStructure,

        groupPrs: (prIds, groupName) => {
            dispatch({
                type: 'groupPrs',
                prIds,
                groupName
            })
        },

        deleteGroup: (groupId) => {
            dispatch({
                type: 'deleteGroup',
                groupId,
            })
        },
        
        addPrsToGroup: (prIds, groupId) => {
            dispatch({
                type: 'addPrsToGroup',
                prIds,
                groupId
            })
        },
        setGroupName: (groupId, groupName) => {
            dispatch({
                type: 'setGroupName',
                groupId,
                groupName
            })
        }
    }
}

export function groupPrs(structure, { prIds, groupName }) {
    return structure
        .map(el => {
            // replace the first pr with the new group
            if (el == prIds[0]) {
                return {
                    id: uuid(),
                    name: groupName,
                    prIds: prIds,
                }
            }

            return el;
        })
        .filter(el => !(typeof el == 'string' && prIds.includes(el)));
}

export function deleteGroup(structure, { groupId }) {
   return structure
        .reduce((acc, el) => {
            if (el.id == groupId) {
                return [
                    ...acc,
                    ...el.prIds,
                ]
            }
            return [...acc, el];
        }, [])
}

export function addPrsToGroup(structure, { groupId, prIds }) {
    return structure
        .filter(el => !prIds.includes(el))
        .map(el => {
            if (el.id == groupId) {
                return {
                    ...el,
                    prIds: [...el.prIds, ...prIds],
                }
            }

            return el
        })
}

export function setGroupName(structure, { groupId, groupName }) {
    return structure
        .map(el => {
            if (el.id == groupId) {
                return {
                    ...el,
                    name: groupName
                }
            }
            return el
        });
}

// --------------------------- Structure Utils ---------------------------

export function filterStructure(structure, filterLambda) {
    return structure.reduce((acc, el) => {
        if (typeof el === 'string') {
            if (filterLambda(el)) {
                return [...acc, el]
            }
            return acc
        }

        let newGroupIds = el.prIds.filter(filterLambda)
        if (newGroupIds.length <= 0) return acc;
        return [
            ...acc,
            {...el, prIds: newGroupIds}
        ]
    }, [])
}

export function flattenStructure(structure) {
    return structure.reduce((acc, el) => {
        if (typeof el === 'string') {
            return [...acc, el]
        }
        return [...acc, ...el.prIds]
    }, []);
}

export function sortStructure(structure, prOrder) {
    let sortedStructure = prOrder.filter(prId => structure.includes(prId))

    structure
        .filter(el => typeof el !== 'string')
        .forEach(group => {
            let index = structure.indexOf(group);
            sortedStructure.splice(index, 0, {
                ...group,
                prIds: prOrder.filter(prId => group.prIds.includes(prId))
            });
        })

    return sortedStructure;
}