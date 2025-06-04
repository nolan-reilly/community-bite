export async function getDonationHistory(){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/food-bank/donation/history/${email}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await data.json();
    return { success: true, response };
  }
  catch(error){
    console.error("Failed to fetch donation history:", error);
    return { success: false, error: error };
  }
}

export async function CloseDonation(post_id: number){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/food-bank/donation/request/close`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_email: email,
        post_id: post_id,
      })
    });
    const response = await data.json();
    return response;
  }
  catch(error){
    console.error("Failed to fetch donation history:", error);
    return { success: false, error: error };
  }
}