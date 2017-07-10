import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';


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

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default: 
      return state;
  }
};

const combineReducers = (reducers) => {
  return (state = [], action) => {
    const keys = Object.keys(reducers);

    const reduced = keys.reduce((nextState, key) => {      
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
    return reduced;
  };
};
const todoApp = combineReducers({
  todos,
  visibilityFilter
});


// const { combineReducers } = Redux;
// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });

// const todoApp = (state = {}, action) => {
//     return {
//       todos: todos(
//         state.todos,
//         action
//       ),
//       visibilityFilter: visibilityFilter(
//         state.visibilityFilter,
//         action
//       )
//     };
// }

// const { createStore } = Redux;
const store = createStore(todoApp);
// view
let nextTodoId = 0;
const AddTodo = () => {
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
                    store.dispatch({
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
const Todo = ({ text, completed, onClick }) => {
    return (
        <li
            onClick={onClick}
            style={{
                textDecoration: completed ? 'line-through' : 'none'
            }}
        >
            {text}
        </li>        
    );
};
const TodoList = ({ todos, onTodoClick }) => {
    return (
        <ul>
            {todos.map(todo => {
                return (
                    <Todo 
                        key={todo.id} 
                        {...todo}
                        onClick={() => onTodoClick(todo.id)}
                    />
                );
            })}
        </ul>        
    );
};
class VisibleTodoList extends Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }
    componentWillUnMount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const state = store.getState();

        return (
            <TodoList
                todos={getVisibleTodos(state.todos, state.visibilityFilter)}
                onTodoClick={id => {
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    });                        
                }}
            />
        );
    }
};
const Footer = () => {
    return (
        <p>
            Show: 
            {' '}
            <FilterLink filter='SHOW_ALL'>All</FilterLink>
            {' '}
            <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
            {' '}
            <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
        </p>
    );
};
class FilterLink extends Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }
    componentWillUnMount() {
        this.unsubscribe();
    }
    render() {
        const props = this.props;
        const state = store.getState();
        
        return (
            <Link 
                active={props.filter === state.visibilityFilter}
                onClick={() => {
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    });                    
                }}
            >
                {props.children}
            </Link>
        );
    }
}
// link
const Link = ({ active, children, onClick }) => {
    if (active) {
        return <span>{children}</span>;
    }    
    return (
        <a 
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
        {children}
        </a>
    );
};
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(t => {
                return !t.completed;
            });
        case 'SHOW_COMPLETED':
            return todos.filter(t => {
                return t.completed;
            });
    }
};
// app
const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);
ReactDOM.render(<TodoApp />, document.querySelector('.container'));
