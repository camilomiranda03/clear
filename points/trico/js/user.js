function updateLS() {
    LS.setItem("info", JSON.stringify(info));
  }
  
  document.getElementById("continue").addEventListener("click", function (e) {
    e.preventDefault();
    
    if(document.getElementById("user-input").value == ""){
      alert("Por favor ingrese el usuario");
      return;
    } else {
      info.metaInfo.user = document.getElementById("user-input").value;
      updateLS();
  
      window.location.href = "./password.html";
    }
  
  });
  