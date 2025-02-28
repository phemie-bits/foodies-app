import fs from 'node:fs';
import path from 'node:path'; // Import the 'path' module

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
//import { error } from 'node:console';

const db = sql('meals.db');

export async function getMeals() {//for 'all meals' page
    await new Promise((resolve) => setTimeout(resolve, 2000));
    //throw new Error('Loading failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {//for 'product details' page
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    meal.slug = slugify(meal.title, { lower: true });//generate a unique name
    meal.instructions = xss(meal.instructions);//sanitize the name 

    const extension = meal.image.name.split('.').pop();//get extension name of the image entered by the user
    const fileName = `${meal.slug}.${extension}`;//combine the extension name with the generated name

    //const stream = fs.createWriteStream(`public/images/${fileName}`);
    //const bufferedImage = await meal.image.arrayBuffer();
    //const filePath = path.join('public/images', fileName);
    //await fs.promises.writeFile(filePath, Buffer.from(bufferedImage));
    //await stream.write(Buffer.from(bufferedImage), (error) => {
    //    if (error) {
    //        throw new Error('Saving image failed');
    //   }
    //});
     
     const filePath = path.join('public', 'images', fileName);
     const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
     try {
        await fs.promises.writeFile(filePath, bufferedImage);
     }
     catch(err){
        console.error("Error writing image to path:", err);
        throw new Error('Saving image failed');
     }
     
     
    try {

        meal.image = `/images/${fileName}`;

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
        console.error("Error saving image to table:", err);
        throw new Error('Saving image failed');
    }
}

export async function deleteMeal(mealId) {
    try{
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
                console.error("Error deleting image:", err);
                return { success: false, message: "Failed to delete meal" };
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
    catch(err){
        console.error("Error deleting meal:", err);
        return { success: false, message: "Failed to delete meal" };
    }
}
    


export async function deleteAllMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        // Get all meals from the database
        const meals = db.prepare(`SELECT * FROM meals`).all();

        // Loop through each meal and delete its image
        for (const meal of meals) {
            const imagePath = path.join('public', meal.image);

            // Check if image exists and delete it
            if (fs.existsSync(imagePath)) {
                try {
                    await fs.promises.unlink(imagePath);
                } catch (err) {
                    console.error(`Failed to delete image: ${imagePath}`, err);
                    return { success: false, message: err.message };
                }
            }
        }

        // Delete all meals from the database
        db.prepare(`DELETE FROM meals`).run();
        console.log("All meals deleted successfully");

        return { success: true, message: "All meals and images deleted" };
    } 
    catch (err) {
        console.error("Error deleting meals:", err);
        return { success: false, message: "Failed to delete meals" };
    }
}
