import Link from 'next/link';
import classes from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';
import { Suspense } from 'react';
import RemoveAllMeals from '@/components/meals/remove-all-meals';

async function Meals() {
   const meals = await getMeals();
   return <MealsGrid meals={meals}/>
}

export default function MealsPage() {
    

    return <>
       <header className={classes.header}>
         <h1>Exciting Meals</h1>
         <p className={classes.cta}>
            <Link href="/meals/share">
                Share Your Favorite Treats
            </Link>
         </p>
         <RemoveAllMeals/>
       </header>
       <main className={classes.main}>
         <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
            <Meals />
         </Suspense>
       </main>
    </>
}