export async function AddProduce(produce_name: string, quantity: number){
    try {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');
        const data = await fetch(`/api/food-bank/inventory/add-produce`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_email: email,
            produce_name: produce_name,
            quantity: quantity
          })
        });
        const response = await data.json();
        return { success: true, response };
    }
    catch(error){
        console.error("Failed to create donation request:", error);
        return { success: false, error: error };
    }
}