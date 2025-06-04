import { FormEvent } from 'react';

export async function CreateDonationPost(event: FormEvent, _frequency: string) {
    event.preventDefault();

    const donorEmail = sessionStorage.getItem('email')
    const params = {
        donor_email: donorEmail,
        produce: (document.getElementById("produce") as HTMLInputElement).value,
        quantity: Number((document.getElementById("quantity") as HTMLInputElement).value),
        weight: Number((document.getElementById("weight") as HTMLInputElement).value),
        date: (document.getElementById("date") as HTMLInputElement).value,
        frequency: _frequency,
        comment: (document.getElementById("comment") as HTMLTextAreaElement).value,
    };

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch("/api/donor/donation/modify", {
            method: "POST",
            headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
             },
            body: JSON.stringify(params),
        });

        const result = await response.json();
        return { success: true, result };

    } catch (error) {
        console.error("Failed to submit:", error);
    }
}
