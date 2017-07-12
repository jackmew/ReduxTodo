/*
    Provider：我們需要一個Provider做為Container透過React Advanced Context的方式，對Child傳store
    connect：1.mapStateToProps(呈現在View的資料), mapDispatchToProps(action，View要反映的動作、行為)，將state和action分開了
             2.做了Provider傳store的動作
             3.做了store.subscribe() & store.unsubscribe()

*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false                
            };
        case 'TOGGLE_TODO': 
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default: 
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const getVisibleTodo = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(todo => !todo.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(todo => todo.completed);
    }
};

let nextTodoId = 0;
let AddTodo = ({ dispatch }) => {
    let input;
    return (
        <div>
            <input 
                ref={node => {
                    input = node;
                }} 
            />
            <button 
                onClick={() => {
                    dispatch({
                        type: 'ADD_TODO',
                        text: input.value,
                        id: nextTodoId++
                    });  
                    input.value = '';
                }}
            >
                Add Todo
            </button>            
        </div>
    );
};
// 這個範例是因為，很常出現不需要傳state，但是會需要定義action
AddTodo = connect()(AddTodo);
// AddTodo = connect(
    // state => {
    //     return [];
    // },
    // dispatch => {
    //     return { dispatch };
    // }
    // null,null
// )(AddTodo);
const Todo = ({ text, completed, onClick }) => {
    return (
        <li 
            onClick={onClick}
            style={{ textDecoration: completed ? 'line-through' : 'none' }}
        >
            {text}
        </li>
    );
};

const TodoList = ({ todos, onTodoListClick }) => {
    return (
        <ul>
            {todos.map(todo => 
                <Todo 
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoListClick(todo.id)}
                />
            )}
        </ul>
    );
};
const Link = ({ active, children, onClick }) => {
    if (active) {
        return (
            <span>
                {children}
            </span>
        );
    }
    return (
        <a 
            href='#'
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
        {children}
        </a>
    );
};

const mapStateToProp = (state) => {
    return {
        todos: getVisibleTodo(state.todos, state.visibilityFilter)
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onTodoListClick: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id
            });
        }
    };
};

const VisibleTodoList = connect(mapStateToProp, mapDispatchToProps)(TodoList);


// 因為需要知道之前的props，用來計算之後要產生的props，所以都會傳ownProps
const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
// 因為需要知道之前的props，用來決定之後的action，所以都會傳ownProps
const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: ownProps.filter
            });                
        }
    };
};

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

const Footer = () => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink filter='SHOW_ALL'>
                All
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_ACTIVE'>
                Active
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_COMPLETED'>
                Completed
            </FilterLink>
        </p>
    );
};
const TodoApp = () => {
    return (
        <div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
        </div>
    );
};
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

ReactDOM.render(
    
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.querySelector('.container')
);

