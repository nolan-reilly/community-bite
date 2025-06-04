export async function DeleteDonationPost(post_id : number){
    try {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');
        const data = await fetch(`/api/donor/donation/modify`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            donor_email: email,
            post_id: post_id
          })
        });
        const response = await data.json();
        return response;
    }
    catch(error){
        console.error("Failed to delete donations:", error);
        return { success: false, error: error };
    }
}