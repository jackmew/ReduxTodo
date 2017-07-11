// reducer => previous state + action = next state
import expect from 'expect';

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT': 
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default: 
            return state;
    }
};

expect(
    counter(0, { type: 'INCREMENT' })
).toEqual(1);

expect(
    counter(2, { type: 'INCREMENT' })
).toEqual(3);

expect(
    counter(3, { type: 'DECREMENT' })
).toEqual(2);

expect(
    counter(1, { type: 'SOTHING_ELSE' })
).toEqual(1);

expect(
    counter(undefined, { type: 'SOMETHING_ELSE' })
).toEqual(0);

console.log('Tests passed');
