import { useReducer, useState } from 'react'
import TodoItem from './TodoItem'
import Books from './components/books'

function App() {
  type Todo ={
    todo : string | undefined,
    done : boolean | undefined,
   }

  const [count, setCount] = useState<number>(0)
  const [input,setInput] = useState<string>("")
  const [todo,setTodo] = useState<Todo>({todo:"",done:false})
  const [todos,setTodos] = useState<Todo[]>([])


  const addTdod = (todo : Todo) : void =>{
    setTodos([...todos,todo])
    setTodo({todo:"",done:false})
  }
   
  const markDone = (todo : string)=>{
    setTodos(todos.map((td)=>{
    if (td.todo == todo ){
      return {...td, done:true}
    }
    return td
  }))}

  return (
    <>
      <div>
        <p>{count}</p>
        <button onClick={()=>{setCount(ps=>ps+1)}}>+</button>
        <button onClick={()=>{setCount(ps=>ps-1)}}>-</button>
        <button onClick={()=>{setCount(0)}}>RESET</button>
      </div>

      <div>
        <h1>{input}</h1>
        <input type="text" name="name" id="name" onChange={(e)=> setInput(e.target.value)} />
      </div>
      <hr />

      <div>
        <form action="" onSubmit={(e)=>{
          e.preventDefault()
          addTdod(todo)
        }}  >
          <input type="text" name="todo" id="" onChange={e=>setTodo({...todo,todo:e.target.value})} />
          <input type="submit"  id="" />
        </form>

        <section>
           {todos.map((tds)=>{
            return <TodoItem todos={tds} markDone={markDone}/>
          })}
        </section>
      </div>

      <div>
        <Books/>
      </div>
       
    </>
  )
}

export default App
