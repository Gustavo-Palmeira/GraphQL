import React, { useState } from 'react'
import './App.css'
import { useQuery, useMutation, gql } from '@apollo/client'

const ALL_TODOS = gql`
  query allTodos {
    todos {
      id
      text
      complete
    }
  }
`

const UPDATE_TODO = gql`
    mutation completeTodo($id: uuid!, $complete: Boolean!) {
        update_todos(where: {id: {_eq: $id}}, _set: {complete: $complete}) {
        returning {
                complete
                id
                text
            }
        }
    }
`

const INSERT_TODO = gql`
    mutation insertTodos($text: String!) {
        insert_todos(objects: { text: $text }) {
            returning {
                id
                text
                complete
            }
        }
    }
`

const DELETE_TODO = gql`
    mutation delete_todos($id: uuid!) {
        delete_todos(where: {id: {_eq: $id}}) {
        returning {
                complete
                id
                text
            }
        }
    }
`

export default function App() {
    const [todoText, setTodoText] = useState('')
    const { data, loading, error } = useQuery(ALL_TODOS)
    const [updateTodo] = useMutation(UPDATE_TODO)
    const [insertTodo] = useMutation(INSERT_TODO)
    const [deleteTodo] = useMutation(DELETE_TODO)

    const handleCompleteTodo = async ({ id, complete }) => {
        await updateTodo({ variables: { id, complete: !complete } })
    }

    const handleInsertTodo = async (event) => {
        event.preventDefault()
        await insertTodo({
            variables: { text: todoText },
            refetchQueries: [{ query: ALL_TODOS }]
        })
        setTodoText('')
    }

    const handleDeleteTodo = async ({ id, text }) => {
        if (window.confirm(`Deseja apagar a tarefa "${text}"`)) {
            await deleteTodo({
                variables: { id },
                refetchQueries: [{ query: ALL_TODOS }]
            })
        }
    }

    if (loading) return <h1>Carregando...</h1>
    if (error) return <h1>Não foi possível pegar os dados</h1>
    return (
        <div>
            <h1>Lista de tarefas</h1>
            <hr />
            <form onSubmit={handleInsertTodo}>
                <input type="text" placeholder="Digite sua nova tarefa" value={todoText} onChange={({ target }) => setTodoText(target.value)} />
                <button>Salvar tarefa</button>
            </form>
            {data.todos.map((todo) => (
                <div key={todo.id} onDoubleClick={() => handleCompleteTodo(todo)}>
                    <span className={todo.complete ? 'strike' : ''}>{todo.text}</span>
                    <button onClick={() => handleDeleteTodo(todo)}>Remover tarefa</button>
                </div>
            ))}
        </div>
    )
}
