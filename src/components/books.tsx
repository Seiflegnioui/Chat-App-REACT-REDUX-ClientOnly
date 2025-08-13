import  { useEffect } from 'react'
import { store, type AppDispatch, type RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';


const Books = () => {
    const users = useSelector((st:RootState)  => st.users)
    const dispatch : AppDispatch =  useDispatch();

    useEffect(() => {
        store.dispatch({ type: "user/login", payload: { id: 1, name: "seif" } });
        dispatch({ type: "user/login", payload: { id: 1, name: "yoyo" } });
    }, []);

    useEffect(() => {
        console.log("Updated users:", users);
    }, [users]);

  return (
    <div>

    </div>
  )
}

export default Books