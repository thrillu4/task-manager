import { useEffect } from 'react'
import './App.css'
import { useAppDispatch, useAppSelector } from './hooks'
import { createTask, deleteTask, fetchTasks } from './redux/slices/tasksSlice'

function App() {
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const dispatch = useAppDispatch()
  const handleAdd = () => {
    dispatch(
      createTask({
        completed: false,
        createdAt: Date.now().toString(),
        description: 'any words for descr',
        title: 'Created new One :D',
      })
    )
  }

  useEffect(() => {
    dispatch(fetchTasks('1'))
  }, [dispatch])
  return (
    <div>
      <h2>All tasks</h2>
      {tasks.map((task) => {
        const date = new Date(Number(task.createdAt))
        return (
          <div
            className="m-2 border-2 border-amber-900 bg-rose-400 text-cyan-400"
            key={task.id}
          >
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <div>Added at: {date.toString()}</div>
            <button
              className="hover:cursor-pointer"
              onClick={() => dispatch(deleteTask(task.id))}
            >
              Delete Task
            </button>
          </div>
        )
      })}
      <button className="hover:cursor-pointer" onClick={handleAdd}>
        Add new one
      </button>
    </div>
  )
}

export default App
