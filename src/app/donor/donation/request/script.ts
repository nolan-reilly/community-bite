export async function getDonationPost(){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    // get OPEN donations only
    const data = await fetch(`/api/donor/donation/${email}?donation_status=OPEN`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const response = await data.json();
    return { success: true, response };
  }
  catch(error){
    console.error("Failed to fetch donation:", error);
    return { success: false, error: error };
  }
}

export async function getPendingDonationRequests(post_id: string){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/donor/donation/request/${email}?post_id=${post_id}`,{
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
    console.error("Failed to fetch donation requests:", error);
    return { success: false, error: error };
  }
}

export async function ApproveRequest(post_id: string, foodBank_email: string){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/donor/donation/request/${email}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_email: foodBank_email,
        post_id: post_id,
        request_status: "ACCEPTED",
      })
    });
    const response = await data.json();
    if(!response.success){
      return { success: false, response };
    }
    return { success: true, response };
  }
  catch(error){
    console.error("Failed to approve donation requests:", error);
    return { success: false, error: error };
  }
}

export async function DeclineRequest(post_id: string, foodBank_email: string){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/donor/donation/request/${email}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_email: foodBank_email,
        post_id: post_id,
        request_status: "DECLINED",
      })
    });
    const response = await data.json();
    return { success: true, response };
  }
  catch(error){
    console.error("Failed to decline donation requests:", error);
    return { success: false, error: error };
  }
}