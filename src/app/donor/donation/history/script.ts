export async function getDonationHistory(){
  try{
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    const data = await fetch(`/api/donor/donation/history/${email}`,{
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