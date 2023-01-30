let numberOfPhotos = 0;
let size= "m";
let sort = "relevance";

const article = document.querySelector("article");
const errorMessage = document.querySelector("#errorMessage");

document.querySelector("#formButton").addEventListener("click", getUserInput);

function getUserInput(event){
    event.preventDefault();

    numberOfPhotos = document.querySelector("#numberInput").value;
    if(numberOfPhotos > 100){
        numberOfPhotos = 100;
    }

    let tag = document.querySelector("#typeInput").value;
    if(tag == "" || tag == "0"){
        tag = "hotpink";
        document.querySelector("#typeInput").value = "hotpink";
    }

    size = document.querySelector(`[name=size]:checked`).value;
    sort = document.querySelector(`[name=sort]:checked`).value;
    
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=76cbdd38ed04d6db8a75b6bb9b5d474b&tags=${tag}&safe_search=3&sort=${sort}&per_page=${numberOfPhotos}&format=json&nojsoncallback=1`;
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
            console.log(error);
            if(error == "TypeError: Failed to fetch" ){
                errorMessage.innerHTML = "Failed to fetch pictures"
            }else{
                errorMessage.innerHTML = "Unknown error";
            }
        })

    article.innerHTML="";
}

function getPhotos(urlObject){

    if(urlObject.photos.photo.length == 0){
        errorMessage.innerHTML = "No photos of that tag, try again";

    }else{
        errorMessage.innerHTML = "";

        urlObject.photos.photo.forEach(element => {
            const id = element.id;
            const serverId= element.server;
            const secret= element.secret;
    
            const imgUrl = `https://live.staticflickr.com/${serverId}/${id}_${secret}_${size}.jpg`

            createImage(imgUrl);
        });
    }
}


function createImage(link){
    const img = document.createElement("img");
    const imgAnchor = document.createElement("a");

    imgAnchor.append(img)
    article.append(imgAnchor);

    img.src= link;
    imgAnchor.href=link;
    imgAnchor.target="_blank";
}