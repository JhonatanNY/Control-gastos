import { useReducer, createContext, type Dispatch, type ReactNode, useMemo } from 'react'
import { budgetReducer, initialState, type BudgetActions, type BudgetState } from '../reducers/budget-reducer'

type BudgetContextProps = {
    state : BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpenses:number
    remainingBudget:number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children} : BudgetProviderProps) => {

    const [ state, dispatch ] = useReducer(budgetReducer, initialState)
    
    const totalExpenses = useMemo(() => state.expenses.reduce((acum, e) => e.amount + acum, 0),[state.expenses])
    const remainingBudget = state.budget - totalExpenses

    return (
        <BudgetContext.Provider value={{state: state,dispatch: dispatch, totalExpenses:totalExpenses, remainingBudget:remainingBudget}}>
            {children}
        </BudgetContext.Provider>
    )
}