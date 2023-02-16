// Data later used in urls
let numberOfPhotos = 0;
let size= "m";
let sort = "relevance";

const article = document.querySelector("article");
const errorMessage = document.querySelector("#errorMessage");

document.querySelector("#formButton").addEventListener("click", getUserInput);

// Function for saving the users choises they inputed in the form
function getUserInput(event){
    event.preventDefault();

    numberOfPhotos = document.querySelector("#numberInput").value;
    // Sets a maximum of pictures the page can show to 100
    if(numberOfPhotos > 100){
        numberOfPhotos = 100;
    }

    let tag = document.querySelector("#typeInput").value;
    // If the user didn´t input a tag it goes to default tag
    if(tag == "" || tag == "0"){
        tag = "hotpink";
        document.querySelector("#typeInput").value = "hotpink";
    }

    size = document.querySelector(`[name=size]:checked`).value;
    sort = document.querySelector(`[name=sort]:checked`).value;
    
    // Removes the old pictures in the container
    article.innerHTML="";

    // Creates an url for the api with the users input as parameters
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=76cbdd38ed04d6db8a75b6bb9b5d474b&tags=${tag}&safe_search=3&sort=${sort}&per_page=${numberOfPhotos}&format=json&nojsoncallback=1`;

    // Fetches the api object containing the pictures
    fetch(url)
        .then( respone =>{
            if(respone.status >= 200 && respone.status < 300){
                return respone.json();
            } else{
                throw `Skiten funkar inte`
            }  
        })
        .then(getPhotos)
        .catch(error =>{
            // In case of error the error-message will show
            console.log(error);
            if(error == "TypeError: Failed to fetch" ){
                errorMessage.innerHTML = "Failed to fetch pictures"
            }else{
                errorMessage.innerHTML = "Unknown error";
            }
        })
}

// Gets the photos from the api object fetched before
function getPhotos(urlObject){

    // If the user wrote a tag with no pictures an error message will show
    if(urlObject.photos.photo.length == 0){
        errorMessage.innerHTML = "No photos of that tag, try again";

    }else{
        // Removes error message if there were one
        errorMessage.innerHTML = "";

        // Runs through each picture the api object contained saves the data needed to show the pictures 
        urlObject.photos.photo.forEach(element => {
            const id = element.id;
            const serverId= element.server;
            const secret= element.secret;
            
            // Uses the data saved from the object along with the size the user submited to create an image url
            const imgUrl = `https://live.staticflickr.com/${serverId}/${id}_${secret}_${size}.jpg`

            createImage(imgUrl);
        });
    }
}

// Creates in anchor element along with an image element to be shown on the page
// The anchor takes the user to a page showing the picture they clicked on
function createImage(link){
    const img = document.createElement("img");
    const imgAnchor = document.createElement("a");

    imgAnchor.append(img)
    article.append(imgAnchor);

    img.src= link;
    imgAnchor.href=link;
    imgAnchor.target="_blank";
}
