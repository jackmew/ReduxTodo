// deepFreeze
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const addCounter = (list) => {
    // list.push(0);
    // return list;

    // return list.concat([0]);

    return [...list, 0];
};

const removeCounter = (list, index) => {
    // list.splice(index, 1);
    // return list;

    // return list.slice(0, index).concat(list.slice(index + 1));

    return [...list.slice(0, index), ...list.slice(index + 1)];
};

const incrementCounter = (list, index) => {
    // list[index]++;
    // return list;

    // const newList = list.map((l, i) => {
    //     if (i === index) {
    //         l++;
    //         return l;
    //     }
    //     return l;
    // });
    // return newList;

    // return list.slice(0, index).concat([list[index] + 1]).concat(list.slice(index + 1));

    return [...list.slice(0, index), list[index] + 1, ...list.slice(index + 1)];
};

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [10, 20, 30];
    const listAfter = [10, 30];

    deepFreeze(listBefore);

    expect(
        removeCounter(listBefore, 1)
    ).toEqual(listAfter);
};

const testIncrementCounter = () => {
    const listBefore = [10, 11, 20];
    const listAfter = [10, 12, 20];

    deepFreeze(listBefore);

    expect(
        incrementCounter(listBefore, 1)
    ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('Test all Passed');
