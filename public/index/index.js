const token = localStorage.getItem("token");

const pagination = document.getElementById("pagination");
const parentNode = document.getElementById("listOfItems");


function rowChange(event) {
  event.preventDefault();
  //console.log(event.target.value, "value");
  // console.log(typeof event.target.value);
  const rowValue = Number(event.target.value);
  //console.log(typeof rowValue);
  localStorage.setItem("expPerPage", rowValue);
  location.reload();
}
 
function saveToLocalStorage(event) {
  event.preventDefault();
  const expenseAmount = event.target.expenseAmount.value;
  const expenseDescription = event.target.expenseDescription.value;
  const category = event.target.category.value;

  const obj = {
    expenseAmount,
    expenseDescription,
    category,
  };
  axios
    .post("http://localhost:3000/expense/postExpenses", obj, {
      headers: { Authorization: token },
    })
    .then((res) => {
      showItemsOnScreen(res.data);
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function showLeaderboard() {
  // console.log('ssha')
  const inputElement = document.createElement("button");

  //inputElement.type = "button";
  inputElement.textContent = "Show Leaderboard";
  document.getElementById("leaderboard").appendChild(inputElement);
  inputElement.onclick = async () => {
    // const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get( "http://localhost:3000/premium/showLeaderboard", { headers: { Authorization: token } });
    console.log("userLeader->>",userLeaderBoardArray);
    console.log("showLeaderBoard-->>");
    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML += `<h1>Leader Board<h1>`;
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li> Name -  ${userDetails.name} Total Expense - ${userDetails.total_cost} </li>`;
    });
  };
}


function showPremiuMessage() {
  document.getElementById("rzp-btn").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user";
  //  const child = document.getElementById("rzp-btn")
  //   const parent = document.getElementById("message")
  //   parent.removeChild(child)
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  // premium  user
  const isadmin = localStorage.getItem("isadmin");
  const decodeToken = parseJwt(token);
  let page = 1;
  const rowValue = localStorage.getItem("expPerPage");
  let expPerPage = rowValue;
  // console.log("expense per page-->", expPerPage);
  getExpense(page, expPerPage);

  // console.log('decodeToken-->',decodeToken)

  const ispremiumuser = decodeToken.ispremiumuser;
  if (ispremiumuser) {
    showPremiuMessage();
    showLeaderboard();
  }
});

async function getExpense(page, expPerPage) {
   console.log("exp page", expPerPage);
  try {
    const res = await axios.get(
      `http://localhost:3000/expense/getAllExpenses?page=${page}&expPerPage=${expPerPage}`,
      { headers: { Authorization: token } }
    );
    console.log("ress", res);
    parentNode.innerHTML = "";

    for (var i = 0; i < res.data.val.length; i++) {
      showItemsOnScreen(res.data.val[i]);
    }
    
    //console.log(res);

    showPagination(
      res.data.currentPage,
      res.data.hasNextPage,
      res.data.nextPage,
      res.data.hasPreviousPage,
      res.data.previousPage,
      res.data.lastPage,
      expPerPage
    );

    if (res.data.isPremium == true) {
      document.getElementById("rzp-btn").style.display = "none";
    } else {
      button();
    }
  } catch (err) {
    console.log(err);
  }
}

function showItemsOnScreen(item) {
  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseDescription").value = "";
  document.getElementById("category").value = "";

  const childHTML = `<li id=${item._id}> ${item.expenseAmount} - ${item.expenseDescription} - ${item.category} 
                        <button onclick=deleteItem('${item._id}')>Delete</button>
                        <button onclick=editItem('${item.expenseAmount}','${item.expenseDescription}','${item.category}','${item._id}')>Edit</button>
  </li>`;

  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function editItem(expenseAmount, expenseDescription, category, itemId) {
  document.getElementById("expenseAmount").value = expenseAmount;
  document.getElementById("expenseDescription").value = expenseDescription;
  document.getElementById("category").value = category;

  deleteItem(itemId);
}

async function deleteItem(itemId) {
  try {
    const res =  await axios.delete(`http://localhost:3000/expense/deleteExpenses/`+itemId, {headers: { Authorization: token }})
    
     console.log('delete res-->', res)
      removeFromScreen(itemId);
  } catch (err) {
    console.log(err)
  }
}

function removeFromScreen(itemId) {
  const parentNode = document.getElementById("listOfItems");
  const childNodeToBeDeleted = document.getElementById(itemId);

  parentNode.removeChild(childNodeToBeDeleted);
}
 

function button() {
  document.getElementById("leaderboard").style.display = "none";
}

function showPagination(
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
  expPerPage
) {
  console.log("paination");
  pagination.innerHTML = " ";

  if (hasPreviousPage) {
    const button2 = document.createElement("button");
    button2.classList.add("active");
    button2.innerHTML = previousPage;
    button2.addEventListener("click", () =>
      getExpense(previousPage, expPerPage)
    );
    pagination.appendChild(button2);
  }

  const button1 = document.createElement("button");
  button1.classList.add("active");
  button1.innerHTML = `<h3>${currentPage}<h3>`;

  button1.addEventListener("click", () => getExpense(currentPage, expPerPage));
  pagination.appendChild(button1);

  if (hasNextPage) {
    const button3 = document.createElement("button");
    button3.classList.add("active");
    button3.innerHTML = nextPage;
    button3.addEventListener("click", () => getExpense(nextPage, expPerPage));
    pagination.appendChild(button3);
  }
}

document.getElementById("rzp-btn").onclick = async function (e) {
  response = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  //console.log(response);
  var options = {
    key: response.data.key_id, // Enter the key id generated from dashboard
    order_id: response.data.order.id, //for one timef payment
    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "9999999999",
    },

    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updateTransactonStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("You are a Premiem User Now");

      document.getElementById("rzp-btn").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "You are a premium user";
      console.log("pp user");
      localStorage.setItem("isadmin", true);
      showLeaderboard();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();

  e.preventDefault();

  rzp1.on("paynemet.failed", function (response) {
    console.log(response);
    alert("something went wrong");
  });
};

document.getElementById("leaderboard").style.display = 'visible'

    // JavaScript code for handling the logout button click event
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', () => {
      // Clear session storage or remove authentication tokens
      localStorage.removeItem("token"); // Or localStorage.removeItem('authToken');

      // Redirect the user to the login page or any desired destination
      window.location.href = "../login/login.html"; // Replace '/login' with the appropriate URL
    });
