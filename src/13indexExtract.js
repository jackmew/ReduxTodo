/*
    Extract Presentaion & Container components
    1. TodoList -> Todo
    2. AddTodo
    3. Footer -> FilterLink
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

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

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const store = createStore(todoApp);

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


const AddTodo = ({ onAddTodoClick }) => {
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
                    onAddTodoClick(input.value);
                    input.value = '';
                }}
            >
                Add Todo
            </button>            
        </div>
    );
};
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
const FilterLink = ({ filter, currentFilter, children, onClick }) => {
    if (filter === currentFilter) {
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
                onClick(filter);
            }}
        >
        {children}
        </a>
    );
};
const Footer = ({ visibilityFilter, onFilterClick }) => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick} >
                All
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onClick={onFilterClick} >
                Active
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} onClick={onFilterClick} >
                Completed
            </FilterLink>
        </p>
    );
};

let nextTodoId = 0;
class TodoApp extends Component {
    render() {
        const { todos, visibilityFilter } = this.props;

        const visibleTodos = getVisibleTodo(todos, visibilityFilter);
        return (
            <div>
                <AddTodo 
                    onAddTodoClick={(text) => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text,
                            id: nextTodoId++
                        });                        
                    }}
                />
                <TodoList 
                    todos={visibleTodos}
                    onTodoListClick={id => {
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id
                        });
                    }}
                />
                <Footer 
                    visibilityFilter
                    onFilterClick={(filter) => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter
                        });
                    }}
                />
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()} />,
        document.querySelector('.container')
    );
};
store.subscribe(render);
render();

