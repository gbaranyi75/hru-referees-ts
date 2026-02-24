'use server'

import connectDB from "@/config/database";
import GuestUser from "@/models/GuestUser";
import { Address } from "@/types/models";
import { Result } from "@/types/result";
import { revalidatePath } from "next/cache";

/**
 * Vendég játékvezető létrehozása az adatbázisban
 * 
 * @param {Object} data - A vendég játékvezető adatai
 * @param {string} data.userName - A vendég játékvezető neve
 * @param {Address} data.address - A vendég játékvezető címe (város, irányítószám, stb.)
 * @param {string} data.status - A vendég játékvezető státusza
 * @param {boolean} data.isGuest - Vendég státusz jelölő (mindig true)
 * @returns {Promise<Result<null>>} - Sikeres létrehozás esetén {success: true, data: null}, hiba esetén {success: false, error: string}
 * 
 * @example
 * const result = await createGuestUser({
 *   userName: "Kiss János",
 *   address: { city: "Budapest", zipCode: "1000" },
 *   status: "aktív",
 *   isGuest: true
 * });
 * if (result.success) {
 *   console.log("Vendég játékvezető sikeresen létrehozva");
 * }
 */
export async function createGuestUser(data: { userName: string, address: Address, status: string, isGuest: boolean }): Promise<Result<null>> {
    try {
        await connectDB();
        const guestUser = new GuestUser({
            username: data.userName,
            address: data.address,
            status: data.status,
            isGuest: data.isGuest,
        })

        await guestUser.save()
        revalidatePath('/dashboard/referees');
        return { success: true, data: null };
    } catch (error) {
        console.error('Error creating guest user:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Hiba történt a vendég játékvezető létrehozásakor' 
        };
    }
}