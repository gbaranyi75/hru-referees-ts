'use server'

import connectDB from "@/config/database";
import GuestUser from "@/models/GuestUser";
import { Address } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createGuestUser(data: { userName: string, address: Address, status: string, isGuest: boolean }) {
    await connectDB();
    try {
        const guestUser = new GuestUser({
            username: data.userName,
            address: data.address,
            status: data.status,
            isGuest: data.isGuest,
        })

        await guestUser.save()
        revalidatePath('/dashboard/referees');
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
        return new Error(error instanceof Error ? error.message : String(error)) as any;
    }
}