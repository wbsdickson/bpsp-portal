"use server";

export async function deleteCardAction(prevState: any, formData: FormData) {
    const id = formData.get("id");

    if (!id) {
        return { success: false, message: "Card ID is required" };
    }

    // Simulate PSP API call and DB deletion
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, we would call the PSP API here.
    // If successful, we delete from DB.

    return {
        success: true,
        message: "The card information has been deleted.",
        data: { id }
    };
}
