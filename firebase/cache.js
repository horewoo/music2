import { cache as cache_db } from "../index.js";
import { ref, child, remove, set, update, get } from "firebase/database";

import log from "../cli-utils/log.js";

//Basic functionality
/**
 * @param {any} data 
 * @param {string} route 
 */
export const setData = async(data, route) => {
    const cache = await cache_db;
    const reference = ref(cache, route);

    try{
        await set(reference, data);
    }catch(err){
        log(`&1[!] >& Couldn't set data at &1"${route}"&`);
    }
}

/**
 * @param {string} route 
 * @returns 
 */
export const getData = async(route) => {
    const cache = await cache_db;
    const reference = ref(cache);

    try{
        const value = await get(child(reference, route));
        return value.val();
    }catch(err){
        log(`&1[!] >& Couldn't get data at &1"${route}"&`);
        console.log(err);
    }
}

/**
 * @param {string} route 
 */
export const deleteData = async(route) => {
    const cache = await cache_db;
    const reference = ref(cache, route);

    try{
        await remove(reference);
    }catch(err){
        log(`&1[!] >& Couldn't delete data at &1"${route}"&`);
    }
}

/**
 * @param {any} data 
 * @param {string} route 
 */
export const updateData = async(data, route) => {
    const cache = await cache_db;
    const reference = ref(cache, route);

    try{
        await update(reference, data);
    }catch(err){
        log(`&1[!] >& Couldn't update data at &1"${route}"&`);
    }
}