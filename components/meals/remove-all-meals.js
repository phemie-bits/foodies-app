'use client'

import classes from './remove-all-meals.module.css'
import { removeAllMeals } from "@/lib/actions";
import { useTransition } from 'react';



export default function RemoveAllMeals() {
const [isPending, startTransition] = useTransition();
async function ClearAllMeals(){
  
    startTransition(async () => {
      const result = await removeAllMeals();
      if (result?.success) {

      } else {
          console.log(result?.message || 'Failed to delete all meals.');
      }
  });
  
} 


return (
    <button className={classes.cta} onClick={ClearAllMeals} disabled={isPending}>
        {isPending ? 'Removing...' : 'Remove All Meals'}
    </button>
);
}



