import { useMemo } from "react"
import { formatDate } from "../helpers"
import type { Expense } from "../types"
import AmountDisplay from "./AmountDisplay"
import { categories } from "../data/categories"
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useBudget } from "../hooks/useBudget"

type ExpenseDetailProps = {
    expense: Expense
}

export default function ExpenseDetail({expense} : ExpenseDetailProps) {

  const categoryInfo = useMemo(() => categories.filter((c) => c.id === expense.category)[0],[expense])
  const { dispatch } = useBudget()

  const leadingActions = () => (
  <LeadingActions>
    <SwipeAction onClick={() => dispatch({type:'get-expense-by-id',payload:{id:expense.id}})}>
      Actualizar
    </SwipeAction>
  </LeadingActions>
  );

  const trailingActions = () => (
  <TrailingActions>
    <SwipeAction
      destructive={true}
      onClick={() => dispatch({type:'remove-expense', payload:{id:expense.id}})}
    >
      Eliminar
    </SwipeAction>
  </TrailingActions>
  );

  return (
    <SwipeableList>
       <SwipeableListItem leadingActions={leadingActions()}
                          trailingActions={trailingActions()}
                          maxSwipe={50}>
          <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">
              <div>
                <img src={`/icono_${categoryInfo.icon}.svg`} alt="icono gasto" className="w-20" />

              </div>
              <div className="flex-1 space-y-1">
                  <p className="text-sm font-bold uppercase text-slate-500">{categoryInfo.name}</p>
                  <p>{expense.expenseName}</p>
                  <p>{formatDate(expense.date!.toString())}</p>
              </div>
              <AmountDisplay amount={expense.amount}/>
          </div>
        </SwipeableListItem>
    </SwipeableList>
  )
}
