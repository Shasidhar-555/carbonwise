function login(){

let role=document.getElementById("role").value;

if(role==="admin"){

window.location.href="admin.html";

}

else{

window.location.href="dashboard.html";

}

}