'use server';

import { redirect } from "next/navigation";
import { deleteAllMeals, deleteMeal, saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get('image'),
        creator: formData.get('name'),
        creator_email: formData.get('email')
    }

    if (
        isInvalidText(meal.title) ||
        isInvalidText(meal.summary) ||
        isInvalidText(meal.instructions) ||
        isInvalidText(meal.creator) ||
        isInvalidText(meal.creator_email) ||
        !meal.creator_email.includes('@') ||
        !meal.image ||
        meal.image.size === 0
    ) {
        return {
            message: 'invalid input'
        };
    }

    try{
        await saveMeal(meal);//important to add 'await', if not the result of await will not be returned well and "catch" will not execute well
        //revalidatePath('/meals'); 
        //redirect('/meals');its wrong to add this here after a statement that has a return value
    } 
    catch (err){
       console.log("error: ",err.message) ;
       throw err;
    }
    revalidatePath('/meals');
    redirect('/meals');
}

export async function removeMeal(mealId) {
    if (
        isInvalidText(mealId) ||
        mealId == ""
    ) {
        return {
            message: 'invalid input'
        };//i think i should use "throw err" here instead
    }
    else{

        await deleteMeal(mealId);
        revalidatePath('/meals');
        redirect('/meals');
    }
    
}

export async function removeAllMeals(){
    try {
        await deleteAllMeals();
    }
    catch (err){
     throw err;
    }
    revalidatePath('/meals');
    redirect('/meals');
}

