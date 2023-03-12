import axios from "axios";
import Swal from "sweetalert2";
import initAdmin from "./admin";
// const socket = io();


const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector(".cartCounter");


function updateCart(pizza) {
  
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res);
 
      if(res.data.ifLoggedIn == null){
        Swal.fire({ 
          icon: "error",
          title: "Please Login First",
          timer: 2000,
          position: "bottom-end",
        })
        return ;
      }

      console.log(res.data.totalQty , "TotQty from app.js");
      cartCounter.innerHTML = res.data.totalQty; 

      // Display notification 
      Swal.fire({
        icon: "success",
        title: "Item has been added to cart",
        timer: 1000,
        position: "top-end",
      })
 
    })
    .catch(() =>{ 
      console.log("error in updating cart ")
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        position: "top-end",
        customClass: {
          container: 'notificationPopup',
        },
      }); 
    });
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pizza = JSON.parse(button.dataset.pizza);
    // console.log(pizza) ;
    console.log(pizza.name, "This is the Name");
    updateCart(pizza);
    // Use the pizza object in your code
  });
});


//Remove the "Congratulations ! Order Placed Successfully !" message after 10 secs

const alertMsg = document.getElementById('success-alert') ; 
if(alertMsg){
  setTimeout(()=>{
    alertMsg.remove();
  },10000)
}

//Logout Functionality
const logout = document.getElementById('logout') ; 
logout.addEventListener('click', function() {
  // alert('You have been successfully logged out!');
  Swal.fire({
    title: 'Are you sure you want to log out?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, log me out',
    cancelButtonText: 'No, keep me logged in'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/logout';
    }
  })
  
});
 
//Admin
initAdmin() ; 

 



