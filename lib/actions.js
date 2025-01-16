'use server';

import { redirect } from "next/navigation";
import { deleteMeal, saveMeal } from "./meals";
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
        await saveMeal(meal);} //important to add 'await', if not the result of await will not be returned well i.e "catch"
    catch (err){
       return{
         message: 'An item already bears this name. Use a different name'
       };
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
        };
    }
    else{

        await deleteMeal(mealId);
        revalidatePath('/meals');
        redirect('/meals');
    }
    
}