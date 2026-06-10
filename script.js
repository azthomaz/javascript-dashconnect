const dogOutput = document.getElementById("dog-output");
const catOutput = document.getElementById("cat-output");
const weatherOutput = document.getElementById("weather-output");
const currencyOutput = document.getElementById("currency-output");
const usdAmountInput = document.getElementById("usd-amount");
const moviesOutput = document.getElementById("movies-output");
const githubOutput = document.getElementById("github-output");
const jokeOutput = document.getElementById("joke-output");
const museumOutput = document.getElementById("museum-output");

async function getDogImage() {
  try {
    dogOutput.innerHTML = "Loading dog image...";

    const response = await fetch("https://dog.ceo/api/breeds/image/random");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    dogOutput.innerHTML = "";

    const img = document.createElement("img");
    img.src = data.message;
    img.alt = "Random dog image";
    img.loading = "lazy";

    dogOutput.appendChild(img);
  } catch (error) {
    console.error("Failed to load dog image:", error);
    dogOutput.textContent = "Sorry, the dog image could not be loaded.";
  }
}

async function getCatImage() {
  try {
    catOutput.innerHTML = "Loading cat image...";

    const response = await fetch("https://cataas.com/cat?json=true");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    catOutput.innerHTML = "";

    /* 
    The cat API at Cataas does not return the same shape as the dog API:
    • Dog API returns JSON with data.message → image URL
    • Cat API returns JSON with data.url → image URL
    The previous code attempt tried to use data.message for the cat image, but the image never got built correctly.

    To fix it
    → fetch from https://cataas.com/cat?json=true
    → use data.url instead of data.message
    */

    const img = document.createElement("img");
    img.src = data.url;
    img.alt = "Random cat image";
    img.loading = "lazy";

    catOutput.appendChild(img);
  } catch (error) {
    console.error("Failed to load the cat image:", error);
    catOutput.textContent = "Sorry, the cat image could not be loaded.";
  }
}

async function getWeather() {
  try {
    weatherOutput.innerHTML = "Loading weather info...";

    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current_weather=true",
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current_weather;

    weatherOutput.innerHTML = "";

    const temp = document.createElement("p");
    temp.textContent = `Temperature: ${current.temperature} °C`;

    const wind = document.createElement("p");
    wind.textContent = `Wind: ${current.windspeed} km/h`;

    const time = document.createElement("p");
    time.textContent = `Time: ${current.time}`;

    weatherOutput.appendChild(temp);
    weatherOutput.appendChild(wind);
    weatherOutput.appendChild(time);
  } catch (error) {
    console.error("Failed to load the weather:", error);
    weatherOutput.textContent = "Sorry, the weather info could not be loaded.";
  }
}

/*
In my first attempt I accidentally used the APIs documentation page instead of the actual forecast API 
& initially I did not know how to check if the API was returning an image or text - in this case it was returning text.
Because it was returning text, I had to create const to receive/store/display the information about temperature, wind and time.
*/

async function getExchangeRates() {
  try {
    currencyOutput.innerHTML = "Loading exchange rate...";

    const amount = Number(usdAmountInput.value);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Please enter a valid USD amount.");
    }

    const response = await fetch(
      "https://api.frankfurter.dev/v1/latest?from=USD&to=EUR",
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const rate = data.rates.EUR;
    const convertedAmount = (amount * rate).toFixed(2);

    currencyOutput.innerHTML = "";

    const rateText = document.createElement("p");
    rateText.textContent = `1 USD = ${rate} EUR`;

    const resultText = document.createElement("p");
    resultText.textContent = `${amount} USD = ${convertedAmount} EUR`;

    currencyOutput.appendChild(rateText);
    currencyOutput.appendChild(resultText);
  } catch (error) {
    console.error("Failed to load exchange rates:", error);
    currencyOutput.textContent =
      "Sorry, the exchange rate could not be loaded.";
  }
}

/*
How it works:

1. You type or use the up and down arrows to text a number in the "USD amount" field.
2. Click “Convert USD to EUR”.
3. The function fetches the live exchange rate from the API.
4. It multiplies the amount entered in "step 1." by the EUR rate and shows the result on the page.
5. The main logic now looks like this:
    → const amount = Number(usdAmountInput.value);
    → const response = await fetch("https://api.frankfurter.dev/v1/latest?from=USD&to=EUR");
    → const data = await response.json();
    → const rate = data.rates.EUR;
    → const convertedAmount = (amount * rate).toFixed(2);
*/

async function getMovies() {
  try {
    moviesOutput.innerHTML = "Loading movie info...";

    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=95efc4feb8e6adfcf51a54f89d40ed35",
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No movies were returned by the API.");
    }

    const randomMovie =
      data.results[Math.floor(Math.random() * data.results.length)];

    moviesOutput.innerHTML = "";

    const title = document.createElement("p");
    title.textContent = `Title: ${randomMovie.title}`;

    const overview = document.createElement("p");
    overview.textContent = `Overview: ${randomMovie.overview}`;

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`;
    img.alt = `${randomMovie.title} poster`;
    img.loading = "lazy";

    moviesOutput.appendChild(title);
    moviesOutput.appendChild(overview);
    moviesOutput.appendChild(img);
  } catch (error) {
    console.error("Failed to load movie info:", error);
    moviesOutput.textContent = "Sorry, the movie info could not be loaded.";
  }
}

/*
Similar to Weather and Currency, I had to create const to receive/store/display the information about the movie title and overview.
The API returns an array of movies, so I now use Math.random() with data.results.length to pick one random movie from the array and display its title, overview and poster image on the page.
*/

async function getGitHubUser() {
  try {
    githubOutput.innerHTML = "Loading GitHub user info...";

    const username = document.getElementById("github-username").value.trim();

    if (!username) {
      throw new Error("Please enter a GitHub username.");
    }

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    githubOutput.innerHTML = "";

    const name = document.createElement("p");
    name.textContent = `Name: ${data.name || "N/A"}`;

    const bio = document.createElement("p");
    bio.textContent = `Bio: ${data.bio || "N/A"}`;

    const img = document.createElement("img");
    img.src = data.avatar_url;
    img.alt = `${data.login} avatar`;
    img.loading = "lazy";

    githubOutput.appendChild(name);
    githubOutput.appendChild(bio);
    githubOutput.appendChild(img);
  } catch (error) {
    console.error("Failed to load GitHub user info:", error);
    githubOutput.textContent =
      "Sorry, the GitHub user info could not be loaded.";
  }
}

async function getJoke() {
  try {
    jokeOutput.innerHTML = "Loading joke...";
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke",
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    jokeOutput.innerHTML = "";

    const setup = document.createElement("p");
    setup.textContent = `Setup: ${data.setup}`;

    const punchline = document.createElement("p");
    punchline.textContent = `Punchline: ${data.punchline}`;

    jokeOutput.appendChild(setup);
    jokeOutput.appendChild(punchline);
  } catch (error) {
    console.error("Failed to load joke:", error);
    jokeOutput.textContent = "Sorry, the joke could not be loaded.";
  }
}

async function getMuseumObject() {
  try {
    museumOutput.innerHTML = "Loading museum object...";
    const response = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/436121",
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();

    museumOutput.innerHTML = "";

    const title = document.createElement("p");
    title.textContent = `Title: ${data.title}`;

    const artist = document.createElement("p");
    artist.textContent = `Artist: ${data.artistDisplayName || "Unknown"}`;

    const img = document.createElement("img");
    img.src = data.primaryImageSmall;
    img.alt = `${data.title} image`;
    img.loading = "lazy";

    museumOutput.appendChild(title);
    museumOutput.appendChild(artist);
    museumOutput.appendChild(img);
  } catch (error) {
    console.error("Failed to load museum object:", error);
    museumOutput.textContent =
      "Sorry, the museum object could not be loaded.";
  }
}

/*
This function fetches data about a specific museum object from the Metropolitan Museum of Art's public collection API. It displays the object's title, artist (or "Unknown" if not available), and an image of the object on the page. If there's an error during the fetch process, it logs the error and shows a message to the user.
*/