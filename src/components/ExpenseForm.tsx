import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { useBudget } from "../hooks/useBudget";
import ErrorMessage from "./ErrorMessage";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount:0,
        expenseName:'',
        category:'',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmoun] = useState(0)

    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if(state.editingId !== ''){
            const obj = state.expenses.filter((e) => e.id === state.editingId)[0]
            setExpense(obj)
            setPreviousAmoun(obj.amount)
        }
    },[state.editingId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        
        console.log(e.target)
        let isNumberField = ['amount'].includes( e.target.id )
        setExpense({
            ...expense,
            [e.target.name]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            console.log('error...')
            return
        }

        if( (expense.amount - previousAmount) > remainingBudget ){
            setError('Ese gasto se sale del presupuesto')
            return
        }

        if(state.editingId) {
          dispatch({type:'update-expense',payload:{expense: {id: state.editingId, ...expense}}});
       

        } else {
          dispatch({
            type: "add-expense",
            payload: { expense: expense },
          });


        }

        setExpense({
            amount:0,
            expenseName:'',
            category:'',
            date: new Date()
        })    
        setPreviousAmoun(0)
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">{state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}</legend>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
            <input type="text" 
                    id="expenseName" 
                    placeholder="Añade el Nombre del gasto" 
                    className="bg-slate-100 p-2" 
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}/>
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">Cantidad:</label>
            <input type="text" 
                    id="amount" 
                    placeholder="Añade la cantidad del gasto: ej. 50" 
                    className="bg-slate-100 p-2" 
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}/>
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">Categoria:</label>
            <select id="category" 
                    className="bg-slate-100 p-2" 
                    name="category"
                    value={expense.category}
                    onChange={handleChange}>
                
                <option value="">-- Seleccione --</option>
                    {categories.map(c => (
                    
                        <option key={c.id} value={c.id}>{c.name}</option>
                
                    ))}
            </select>
        </div>
         <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">Fecha Gasto:</label>
             <DatePicker onChange={handleChangeDate} value={expense.date} className="bg-slate-100 p-2 border-0"/>
        </div>
        <input value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'} type="submit" className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" />
    </form>
  )
}
