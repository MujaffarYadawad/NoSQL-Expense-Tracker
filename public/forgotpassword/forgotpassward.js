async function forgotpassword(event) {
  event.preventDefault();
  //console.log('forgot password')
  //const form = new FormData(event.target);
  const email = event.target.email.value;

  const userDetails = {
    email,
  };

  //console.log(userDetails);

  try {
    const res = await axios.post(
      "http://localhost:3000/password/forgotpassword",
      userDetails
    );

    console.log(res);
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}
