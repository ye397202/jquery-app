$(document).ready(() => {
  searchByName(" ");
});

function openNav() {
  $(".aside").animate({ left: `0px` }, 500);
  $(".icon i").attr("class", "fa-solid open-close-icon fa-2x fa-x");
  $("ul.links li").slideDown(1000);
}

function closeNav() {
  const navWidth = $(".nav").outerWidth();
  $(".aside").animate({ left: `-${navWidth}px` }, 500);
  $(".icon i").attr("class", "fa fa-bars fa-2x");
  $("ul.links li").slideUp(1000);
}

$(".icon i").click(() => {
  if ($(".aside").css("left") == "0px") {
    closeNav(navWidth);
  } else {
    openNav();
  }
});

async function getMeal(id) {
  const respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (respone.ok) {
    const responseData = await respone.json();
    showMealDetails(responseData.meals[0]);
  } else {
    console.log("something went wrong");
  }
}

function showMealDetails(meal) {
  let ingredients = "";
  for (let i = 0; i < 21; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">
          ${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}
        </li>`;
    }
  }

  let tags = meal.strTags;
  let tagsElements = "";
  if (tags != null) {
    let tagsArr = tags.split(",");
    for (let i = 0; i < tagsArr.length; i++) {
      tagsElements += `<li class="alert alert-danger m-2 p-1">${tagsArr[i]}</li>`;
    }
  }
  $("#searchelement").empty();
  $("#data").empty().append(`
    <div class="col-md-4">
      <img src="${meal.strMealThumb}" class="w-100"/>
      <h3 class="text-white">${meal.strMeal}</h3>
    </div>
    <div class="col-md-8 text-white">
      <h3>Instructions</h3>
       <p>${meal.strInstructions}</p>
       <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
       <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
       <h3>Recipes :</h3>
       <ul class="d-flex p-0 flex-wrap g-3">
        ${ingredients}
       </ul>
       <h4>Tags :</h4>
       <ul class="list-unstyled d-flex g-3 flex-wrap">
          ${tagsElements}    
       </ul>

       <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `);
}

function showMeals(arr) {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += `
    <div class="col-md-3">
      <div onclick="getMeal('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2" role="button">
        <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3></div>
      </div>
    </div>`;
  }
  $("#data").empty().append(str);
}

function showCategories(arr) {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += `
    <div class="col-md-3">
        <div onclick="getCategoryMeals('${
          arr[i].strCategory
        }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer" role="button">
                    <img class="w-100" src="${
                      arr[i].strCategoryThumb
                    }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
    </div>
    `;
  }
  $("#data").empty().append(str);
}

async function getCategoryMeals(category) {
  const respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  if (respone.ok) {
    const data = await respone.json();
    showMeals(data.meals.slice(0, 20));
  }
}

async function getAreaMeals(area) {
  const respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  if (respone.ok) {
    const data = await respone.json();
    showMeals(data.meals.slice(0, 20));
  }
}

async function getIngredientMeals(ingredient) {
  const respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  if (respone.ok) {
    const data = await respone.json();
    showMeals(data.meals.slice(0, 20));
  }
}

async function searchByName(val) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${
      val !== "" ? val : "Arrabiata"
    }`
  );
  if (response.ok) {
    const data = await response.json();
    showMeals(data.meals);
  } else {
    console.log("something went wrong");
  }
}

function showAreas(arr) {
  let areas = "";
  for (let i = 0; i < arr.length; i++) {
    areas += `
     <div class="col-md-3 text-white" role="button">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
    `;
  }
  $("#data").empty().append(areas);
}



function showIngredients(arr) {
  let ingredients = "";
  for (let i = 0; i < arr.length; i++) {
    ingredients += `
    <div class="col-md-3 text-white" role="button">
                <div onclick="getIngredientMeals('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
    `;
  }
  $("#data").empty().append(ingredients);
}

function validateInput(id, pat, message) {
  $(`#${id} input`).on("input", (e) => {
    const pattern = pat;
    $("form button").attr("disabled", !pattern.test( e.target.value));
    if (!pattern.test(e.target.value) && $(`#${id}`).children().length === 1) {
      $(`#${id}`).append(
        `<div class="alert alert-danger my-3">${message}</div>`
      );
    } else if (
      pattern.test(e.target.value) &&
      $(`#${id}`).children().length === 2
    ) {
      $(`#${id} div`).remove(".alert");
    }
  });
}

$(".links .search").click(() => {
  closeNav();
  $("#data").empty();
  if ($("#searchelement").children().length === 0) {
    $("#searchelement").append(`
   <div class="row py-4">
          <div class="col-md-6">
            <input
              id="searchbyname"
              type="text"
              class="form-control bg-black text-white"
              placeholder="Search By Name"
            />
          </div>
          <div class="col-md-6">
            <input
              id="searchbyfirstletter"
              type="text"
              maxlength="1"
              class="form-control bg-black text-white"
              placeholder="Search By first Letter"
            />
          </div>
        </div>
  `);
    $("#searchbyname").on("input", async (e) => {
      await searchByName(e.target.value);
    });
    $("#searchbyfirstletter").on("input", async function (e) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${
          e.target.value ? e.target.value : "a"
        }`
      );
      if (response.ok) {
        const data = await response.json();
        showMeals(data.meals);
      } else {
        console.log("something went wrong");
      }
    });
  }
});

$(".links .category").click(async () => {
  closeNav();
  $("#searchelement").empty();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  if (response.ok) {
    const data = await response.json();
    showCategories(data.categories);
  } else {
    console.log("something went wrong");
  }
});

$(".links .area").click(async () => {
  closeNav();
  $("#searchelement").empty();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  if (response.ok) {
    const data = await response.json();
    showAreas(data.meals);
  } else {
    console.log("something went wrong");
  }
});

$(".links .ingredient").click(async () => {
  closeNav();
  $("#searchelement").empty();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  if (response.ok) {
    const data = await response.json();
    showIngredients(data.meals.slice(0, 20));
  } else {
    console.log("something went wrong");
  }
});



$(".links .contact").click(() => {
  closeNav();
  if ($("#data").children().length !== 1) {
    $("#searchelement").empty();
    $("#data").empty().append(`
    <div class="d-flex   justify-content-center align-items-center">
    <form class="row g-4 w-75">
        <div class="col-md-6" id="name">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Your Name"
            />
        </div>
        <div class="col-md-6" id="email">
            <input
              type="email"
              class="form-control"
              placeholder="Enter Your Email"
            />
        </div>
        <div class="col-md-6" id="phone">
            <input
            type="text"
              class="form-control"
              placeholder="Enter Your Phone"
            />
        </div>
        <div class="col-md-6" id="age">
            <input
              type="number"
              class="form-control"
              placeholder="Enter Your Age"
            />
        </div>
        <div class="col-md-6" id="password">
          <input
          type="password"
          class="form-control"
          placeholder="Enter Your Password"
          />
          </div>
          <div class="col-md-6" id="repassword">
          <input
          type="password"
          class="form-control"
          placeholder="Repassword"
          />
          </div>
          <button class="btn btn-danger mx-auto col-md-2 bg-transparent text-danger px-2 py-1" disabled>Submit</button>
          </form>
          </div>
          `);

    validateInput(
      "name",
      /^[a-zA-Z]+$/,
      "Special characters and numbers not allowed"
    );
    validateInput(
      "email",
      /^[a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]{2,}$/,
      "Email not valid *exemple@yyy.zzz"
    );
    validateInput("phone", /^(01)[0125][0-9]{8}$/, "Enter valid Phone Number");
    validateInput("age", /^[1-9][0-9]*$/, "Enter valid Age");
    validateInput(
      "password",
      /^[a-zA-Z0-9]{8,}/,
      "Enter valid password *Minimum eight characters, at least one letter and one number"
    );
    $("#repassword input").on("input", () => {
      if (
        $("#password input").val() !== $("#repassword input").val() &&
        $("#repassword").children().length === 1
      ) {
        $("#repassword").append(
          `<div class="alert alert-danger my-3">Enter valid repassword</div>`
        );
      } else if (
        $("#repassword input").val() === $("#password input").val() &&
        $("#repassword").children().length === 2
      ) {
        $("#repassword div").remove();
      }
    });
  }
});
