export async function WithdrawDonation(post_id : number){
    try {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');
        const data = await fetch(`/api/food-bank/donation/request/modify`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_email: email,
            post_id: post_id
          })
        });
        const response = await data.json();
        return response;
    }
    catch(error){
        console.error("Failed to withdraw donation request:", error);
        return { success: false, error: error };
    }
}

export async function GetDonationRequests(){
  try {
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    const data = await fetch(`/api/food-bank/donation/request/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await data.json();
    return response;
}
catch(error){
    console.error("Failed to get donation posts:", error);
    return { success: false, error: error };
}
}

export async function GetDonationRequestStatus(post_id: number){
  try {
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    const data = await fetch(`/api/food-bank/donation/request/status/${email}?post_id=${post_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

    });
    const response = await data.json();
    return response;
}
catch(error){
    console.error("Failed to get donation posts:", error);
    return { success: false, error: error };
}
}