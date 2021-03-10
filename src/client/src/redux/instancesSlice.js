import { createSlice } from '@reduxjs/toolkit'

// const initialState = { value: 0 }
const initialState = [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' },
]

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}


const instancesSlice = createSlice({
    name: 'instances',
    initialState,
    reducers: {
        addArticle(state, action) {
            // return [
            //     ...state,
            //     action.payload
            // ]
            // OR:
            state.push(action.payload);
            // madness - mutable state?!?!
        },
        increment(state) {
            state.value++
        },
        decrement(state) {
            state.value--
        },
        incrementByAmount(state, action) {
            state.value += action.payload
        },
    },
})

export const { addArticle, increment, decrement, incrementByAmount } = instancesSlice.actions
export default instancesSlice.reducer


// the old way to do it (without react toolkit)

// const initialState = [
//     { id: 0, text: 'Learn React', completed: true },
//     { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//     { id: 2, text: 'Build something fun!', completed: false, color: 'blue' },
// ]

// function nextTodoId(todos) {
//     const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//     return maxId + 1
// }

// export default function instancesReducer(state = initialState, action) {
//     switch (action.type) {
//         case 'instances/instanceAdded': {
//             // Can return just the new todos array - no extra object around it
//             return [
//                 ...state,
//                 {
//                     id: nextTodoId(state),
//                     text: action.payload,
//                 }
//             ]
//         }
//         //   case 'todos/todoToggled': {
//         //     return state.map(todo => {
//         //       if (todo.id !== action.payload) {
//         //         return todo
//         //       }

//         //       return {
//         //         ...todo,
//         //         completed: !todo.completed
//         //       }
//         //     })
//         //   }
//         default:
//             return state
//     }
// }