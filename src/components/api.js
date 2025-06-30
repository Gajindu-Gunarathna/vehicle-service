const BASE_URL = "http://localhost:8084/service-app/users";

export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json(); // returns true or false
}

export async function signupUser(credentials){
  try{
    const res = await fetch("http://localhost:8084/service-app/users/signup",  {
      method: "POST",
      header: { "Content-Type": "application/json",},
      body: JSON.stringify(credentials),
    });

    //when signup is a succes
    if(res.ok){
      console.log ("Singup Responded:", await res.json());
      return true;
    }else{
      console.error("SignUp Failed:", res.status);
    }

  }catch(error){
    console.error("Sing error:", error);
    return false;
  }
}