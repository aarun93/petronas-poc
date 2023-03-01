const art = () => {
  var power_moment = [];
  power_moment[0] = document.getElementById("interest_art");
  power_moment[1] = document.getElementById("interest_music");
  power_moment[2] = document.getElementById("interest_travel");
  power_moment[3] = document.getElementById("interest_cooking");
  power_moment[4] = document.getElementById("interest_sport");

  var artDoc = document.getElementById("art_select");
  artDoc.addEventListener("click", function () {
    for (let i = 0; i < power_moment.length; i++) {
      power_moment[i].style.display = 'none';
    }
    power_moment[0].style.display = 'block';
  });

  var musicDoc = document.getElementById("music_select");
  musicDoc.addEventListener("click", function () {
    for (let i = 0; i < power_moment.length; i++) {
      power_moment[i].style.display = 'none';
    }
    power_moment[1].style.display = 'block';
  });

  var travelDoc = document.getElementById("travel_select");
  travelDoc.addEventListener("click", function () {
    for (let i = 0; i < power_moment.length; i++) {
      power_moment[i].style.display = 'none';
    }
    power_moment[2].style.display = 'block';
  });

  var cookingDoc = document.getElementById("cooking_select");
  cookingDoc.addEventListener("click", function () {
    for (let i = 0; i < power_moment.length; i++) {
      power_moment[i].style.display = 'none';
    }
    power_moment[3].style.display = 'block';
  });

  var sportDoc = document.getElementById("sport_select");
  sportDoc.addEventListener("click", function () {
    for (let i = 0; i < power_moment.length; i++) {
      power_moment[i].style.display = 'none';
    }
    power_moment[4].style.display = 'block';
  });
}

export { art };