import fs from 'node:fs';
import path from 'node:path'; // Import the 'path' module

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
//import { error } from 'node:console';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //throw new Error('Loading failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    meal.slug = slugify(meal.title, { lower: true });//generate a unique name
    meal.instructions = xss(meal.instructions);//sanitize the name 

    const extension = meal.image.name.split('.').pop();//get extension name of the image entered by the user
    const fileName = `${meal.slug}.${extension}`//combine the extension name with the generated name

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('Saving image failed');
        }
    });

    meal.image = `/images/${fileName}`;

    try {
        db.prepare(`
        INSERT INTO meals
           (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
           
          )
        `).run(meal);
    }
    catch(err) {
        console.log("error is this :",err);
        throw err;
    }
}

export async function deleteMeal(mealId) {
    if (!mealId) {
        throw new Error('Meal ID is required');
    }

    // Fetch the entire meal to get all its fields, including the image path
    const meal = db.prepare(`
        SELECT * FROM meals WHERE slug = ?
    `).get(mealId);

    if (!meal) {
        throw new Error('Meal not found');
    }

    // Construct the full image path using the `meal.image` field (e.g., '/images/slug.png')
    const imagePath = path.join('public', meal.image); // Adjust path as necessary

    // Check if the image file exists and delete it
    if (fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath); // Delete the image file from the file system

        } catch (err) {
            return { success: false, message: err.message };
        }
    }
    console.log(`Image file ${imagePath} deleted successfully`);
    
    // Delete the meal record from the database
    db.prepare(`
        DELETE FROM meals WHERE slug = ?
    `).run(mealId);

    console.log(`Meal with ID ${mealId} deleted successfully`);
    return { success: true };

}