import { 
    flattenStructure,
    sortStructure, 
    filterStructure,
    groupPrs,
    deleteGroup,
    addPrsToGroup,
    setGroupName,
    updateFromPrOrder,
    move,
 } from "../../src/hooks/useStructure"

const testStructure = [
    'g',
    'e',
    { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a'] },
    'b',
    { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
];

const testPrOrder =  [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

test('updateFromPrOrder - empty result', () => {
    let actual = updateFromPrOrder(
        testStructure,
        { prOrder: [] }
    );

    expect(actual).toEqual(testStructure);
});

test('updateFromPrOrder - new pr', () => {
    let actual = updateFromPrOrder(
        testStructure,
        { prOrder: ['j', ...flattenStructure(testStructure), 'i'] }
    );

    expect(actual).toEqual(['j', 'i', ...testStructure]);
});

test('updateFromPrOrder - removed pr', () => {
    let removedItemsStructure = filterStructure(testStructure, (prId) => !['e', 'h'].includes(prId));

    let actual = updateFromPrOrder(
        testStructure,
        { prOrder: flattenStructure(removedItemsStructure) }
    );

    expect(actual).toEqual(testStructure);
});

test('groupPrs', () => {
    let actual = groupPrs(
        testStructure,
        { 
            prIds: ['e', 'g', 'b'],
            groupName: 'newName'
        }
    )

    expect(actual).toMatchObject([
        { 
            id: expect.any(String),
            name: 'newName',
            prIds: ['e', 'g', 'b']
        },
        { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a'] },
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
})

test('deleteGroup', () => {
    let actual = deleteGroup(
        testStructure,
        { groupId: 'gId1' }
    )

    expect(actual).toEqual([
        'g',
        'e',
        'f', 'c', 'a', // items that were in the group
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
})

test('addPrsToGroup', () => {
    let actual = addPrsToGroup(
        testStructure,
        { groupId: 'gId1', name: 'g1', prIds: ['g', 'b']}
    )

    expect(actual).toEqual([
        'e',
        { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a', 'g', 'b'] },
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
})

test('setGroupName', () => {
    let actual = setGroupName(
        testStructure,
        { groupId: 'gId1', groupName: 'foo'}
    )

    expect(actual).toEqual([
        'g',
        'e',
        { id: 'gId1', name: 'foo', prIds: ['f', 'c', 'a'] },
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
})

test('move - root to root', () => {
    let actual = move(
        testStructure,
        { itemId: 'g', index: 1 }
    )

    expect(actual).toEqual([
        'e',
        'g',
        { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a'] },
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
});

test('move - group to same group', () => {
    let actual = move(
        testStructure,
        { itemId: 'f', index: 1, groupId: 'gId1' }
    )

    expect(actual).toEqual([
        'g',
        'e',
        { id: 'gId1', name: 'g1', prIds: ['c', 'f', 'a'] },
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
});

test('move - group to new group', () => {
    let actual = move(
        testStructure,
        { itemId: 'f', index: 1, groupId: 'gId2' }
    )

    expect(actual).toEqual([
        'g',
        'e',
        { id: 'gId1', name: 'g1', prIds: ['c', 'a'] },
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'f', 'h']}
    ])
});

test('move - group to root', () => {
    let actual = move(
        testStructure,
        { itemId: 'f', index: 1 }
    )

    expect(actual).toEqual([
        'g',
        'f',
        'e',
        { id: 'gId1', name: 'g1', prIds: ['c', 'a'] },
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
});

test('move - root to group', () => {
    let actual = move(
        testStructure,
        { itemId: 'b', index: 1, groupId: 'gId2' }
    )

    expect(actual).toEqual([
        'g',
        'e',
        { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a'] },
        { id: 'gId2', name: 'g2', prIds: ['d', 'b', 'h']}
    ])
});


test('move - group', () => {
    let actual = move(
        testStructure,
        { itemId: 'gId1', index: 1 }
    )

    expect(actual).toEqual([
        'g',
        { id: 'gId1', name: 'g1', prIds: ['f', 'c', 'a'] },
        'e',
        'b',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
});

// ----------------------- Utils -----------------------

test('sorts structure', () => {
    let actual = sortStructure(
        testStructure, 
        testPrOrder,
    )

    expect(actual).toEqual([
        'b', 
        'e',
        { id: 'gId1', name: 'g1', prIds: ['a', 'c', 'f'] },
        'g',
        { id: 'gId2', name: 'g2', prIds: ['d', 'h']}
    ])
})

test('flattens structure', () => {
    let actual = flattenStructure(
        testStructure
    )

    expect(actual).toEqual([
        'g',
        'e',
        'f', 
        'c',
        'a',
        'b',
        'd',
        'h',
    ])
})

test('filter structure', () => {
    let actual = filterStructure(
        testStructure,
        (prId) => ['a', 'f', 'g'].includes(prId)
    )

    expect(actual).toEqual([
        'g',
        { id: 'gId1', name: 'g1', prIds: ['f', 'a'] },
    ])
})