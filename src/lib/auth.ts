// Define strict types for the account information
interface accountInfo {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  password: string;
  address: string;
}

// function to parse google's formatted address
function parseAddress(address: string): string[] {
  let address_fields = address.split(',');
  let state_zip = address_fields[2].split(' ');
  let state = state_zip.slice(0, state_zip.length - 1);
  let zip = state_zip[state_zip.length - 1]

  return [address_fields[0], address_fields[1], state.join(' '), zip, address_fields[3]];
}

// Login existing donor
export async function loginDonor(email: string, password: string) {
  try {
    const response = await fetch('/api/login/donor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      console.log(`HTTP Error! Status: ${response.status} | ${response.statusText}`);
      return {sucess: false}
    }

    const data = await response.json();
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('role', 'donor');

    return {data, success: true};
  }
  catch (error) {
    console.log('Error logging in');
    return {sucess: false}
  }
}

// Login existing food bank
export async function loginFoodBank(email: string, password: string) {
  try {
    const response = await fetch('/api/login/food-bank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      console.log(`HTTP Error! Status: ${response.status} | ${response.statusText}`);
      return {sucess: false}
    }

    const data = await response.json();
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('role', 'food-bank');
    
    return {data, success: true};
  }
  catch (error) {
    console.log('Error logging in');
    return {sucess: false}
  }
}

// Register new donor in the database
export async function registerDonor(donorInfo: accountInfo) {
  const parsed_address = parseAddress(donorInfo.address);

  try {
    const response = await fetch('/api/register/donor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...donorInfo,
        streetAddress: parsed_address[0],
        city: parsed_address[1],
        state: parsed_address[2],
        zip: parsed_address[3],
        country: parsed_address[4]
      })
    });

    if (!response.ok) {
      console.log(`HTTP Error! Status: ${response.status} | ${response.statusText}`);
      return {sucess: false}
    }

    const data = await response.json();
    return {data, success: true};
  }
  catch (error) {
    console.log('Error registering donor');
    return {sucess: false}
  }
};

// Register new food bank in the database
export async function registerFoodBank(foodBankInfo: accountInfo) {
  const parsed_address = parseAddress(foodBankInfo.address);

  try {
    const response = await fetch('/api/register/food-bank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...foodBankInfo,
        streetAddress: parsed_address[0],
        city: parsed_address[1],
        state: parsed_address[2],
        zip: parsed_address[3],
        country: parsed_address[4]
      })
    });

    if (!response.ok) {
      console.log(`HTTP Error! Status: ${response.status} | ${response.statusText}`);
      return {sucess: false}
    }

    const data = await response.json();
    return {data, success: true};
  }
  catch (error) {
    console.log('Error registering food bank');
    return {sucess: false}
  }
}
