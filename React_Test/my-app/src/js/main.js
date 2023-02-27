var power_moment = [];
power_moment[0] = document.getElementById("interest_art");
power_moment[1] = document.getElementById("interest_music");
power_moment[2] = document.getElementById("interest_travel");
power_moment[3] = document.getElementById("interest_cooking");
power_moment[4] = document.getElementById("interest_sport");

const art = document.getElementById("art");
art.addEventListener("click", function () {
  for(let i = 0;i < power_moment.length;i++){
    power_moment[i].style.display = 'none';
  }
  power_moment[0].style.display = 'block';
});


export default art;