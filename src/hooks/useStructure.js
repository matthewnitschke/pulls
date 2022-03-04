import { useEffect, useReducer, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import settings from 'src/components/settings/settings-utils.js';

export default function useStructure(query, prOrder) {
    let queryKey = encodeURIComponent(query);

    let [ structure, dispatch ] = useReducer((state, action) => {
        let newStructure;
        switch(action.type) {
            case 'groupPrs': newStructure = groupPrs(state, action); break;
            case 'deleteGroup': newStructure = deleteGroup(state, action); break;
            case 'addPrsToGroup': newStructure = addPrsToGroup(state, action); break;
            case 'setGroupName': newStructure = setGroupName(state, action); break;
            case 'updateFromPrOrder': newStructure = updateFromPrOrder(state, action); break;
            case 'move': newStructure = move(state, action); break;
            case 'resetFromPrOrder': newStructure = resetFromPrOrder(state, action); break;
        }
        return newStructure;

    }, settings.get(`savedStructure.${queryKey}`) ?? []);

    useEffect(() => settings.set(`savedStructure.${queryKey}`, structure), [structure]);
    useEffectExceptOnMount(() => {
        dispatch({ type: 'updateFromPrOrder', prOrder });
    }, [prOrder])

    return {
        structure,

        groupPrs: (prIds, groupName) => dispatch({ type: 'groupPrs', prIds, groupName }),
        deleteGroup: (groupId) => dispatch({ type: 'deleteGroup', groupId }),
        addPrsToGroup: (prIds, groupId) => dispatch({ type: 'addPrsToGroup', prIds, groupId }),
        setGroupName: (groupId, groupName) => dispatch({ type: 'setGroupName', groupId, groupName}),
        move: (itemId, index, groupId) => {
            dispatch({ type: 'move', itemId, index, groupId });
        },
        resetStructure: (prOrder) => dispatch({ type: 'resetFromPrOrder', prOrder })
    }
}

export function updateFromPrOrder(structure, { prOrder }) {
    let flattenedStructure = flattenStructure(structure);

    return [
        ...prOrder.filter(prId => !flattenedStructure.includes(prId)),
        ...structure,
    ];
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

export function move(structure, { itemId, index, groupId }) {
    let newStructure = [...structure];

    let enclosingGroup = structure.find(el => el.prIds?.includes(itemId))

    let element;

    if (enclosingGroup != null) {
        // itemId is within a group

        let newPrIds = [...enclosingGroup.prIds]
        let itemIndex = newPrIds.indexOf(itemId)
        element = newPrIds[itemIndex];

        newPrIds.splice(itemIndex, 1);

        newStructure[newStructure.indexOf(enclosingGroup)] = {
            ...enclosingGroup,
            prIds: newPrIds,
        }
    } else {
        let itemIndex = structure
            .map(el => el.id ?? el)
            .indexOf(itemId)

        element = structure[itemIndex];
        newStructure.splice(itemIndex, 1);
    }

    if (groupId != null) {
        newStructure = newStructure.map(el => {
            if (el.id == groupId) {
                let newGroupPrIds = [...el.prIds]
                newGroupPrIds.splice(index, 0, element)
                return {
                    ...el,
                    prIds: newGroupPrIds
                }
            }

            return el
        });
    } else {
        newStructure.splice(index, 0, element)
    }

    return newStructure;
}

export function resetFromPrOrder(structure, { prOrder }) {
    return filterStructure(structure, prId => prOrder.includes(prId))
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

function useEffectExceptOnMount(fn, inputs) {
    const didMountRef = useRef(false);
  
    useEffect(() => {
      if (didMountRef.current)
        return fn();
      else
        didMountRef.current = true;
    }, inputs);
  }