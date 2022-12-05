recipe_url = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=1&q="

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7d1d4f8149mshb4440809f1e7b6cp1381f4jsnd8c9aaf79909',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

submitButton = document.getElementById("submit");
search = document.getElementById("search");
description = document.getElementById("description");
original_video_url = document.getElementById("original_video_url");
recipename = document.getElementById("recipename");



submitButton.addEventListener("click", function () {
  if (search.value != "") {
    getRecipes(search.value);
  }
});


  async function getRecipes(search_text) {
    let recipeData = await getRecipesData(search_text)

    description.innerHTML = recipeData.results[0].description  ;
    //original_video_url.href = recipeData.results[0].original_video_url  ;
    recipename.innerHTML = recipeData.results[0].name  ;

    x = recipeData.results[0].original_video_url

    if(typeof x !== 'undefined' && x !== null){
      original_video_url.innerHTML = '<a href="' + recipeData.results[0].original_video_url + '"> Recipe Video </a>'
    }

    //original_video_url.innerHTML = '<a href="' + recipeData.results[0].original_video_url + '"> Link </a>'
    // in case no video
    // original_video_url.href = original_video_url.href.replace('undefined', '');


  }

  async function apiCall(url,options) {
    let response = await fetch(url,options) 
    let data = await response.json()
    return data
  
  }

  async function getRecipesData(search) {
    let formattedUrl = recipe_url + encodeURIComponent(search)
    let data = await apiCall(formattedUrl,options)
    return data
  }