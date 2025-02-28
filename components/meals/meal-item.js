'use client'

import Link from 'next/link';
import Image from 'next/image';
import { removeMeal } from '@/lib/actions';

import classes from './meal-item.module.css';
import { useTransition } from 'react';

export default function MealItem({ title, slug, image, summary, creator }) {
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const result = await removeMeal(slug);
      if (result?.success) {

      } else {
          console.log(result?.message || 'Failed to delete the meal.');
      }
  });
  };
  


  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={image} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
             <div className={classes.action}>
                 <Link href={`/meals/${slug}`}>View Details</Link>
             </div>
            <div className={classes.action}>
                 <button onClick={handleDelete} disabled={isPending}>
                   {isPending ? 'Removing...' : 'Remove Item'}
                 </button>
            </div>
        </div>
        
      </div>
    </article>
  );
}
