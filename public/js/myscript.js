// get request to fetch string of all files
var req = new XMLHttpRequest();
req.open("GET", "/api/allFiles", true);
//req.setRequestHeader('needallfiles', true);
req.addEventListener("load", function() {
  var filesArray = req.responseText.split('\n');
  var ul = document.querySelector('#list');
  filesArray.forEach(function(item) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href', 'http://localhost:8000/' + encodeURIComponent(item));
    a.textContent = item;
    let button = document.createElement('button');
    button.setAttribute('id', 'delete-button');
    button.setAttribute('file', item);
    button.textContent = 'Delete';
    li.appendChild(a);
    li.appendChild(button);
    ul.appendChild(li);
  });
  var deleteButton = document.querySelectorAll('#delete-button');
  deleteButton.forEach(function(button) {
    button.addEventListener("click", deleteFile);
  });
});
req.send(null);


// post request to post a new file
var fileInput = document.querySelector("#file-input");
var uploadButton = document.querySelector("#upload-button");

uploadButton.addEventListener("click", function() {
  var file = fileInput.files[0];
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `http://localhost:8000/${file.name}`, true);
  //xhr.setRequestHeader('Content-Type', 'image/jpeg'); // it doesnt solve XML Parsing Error: syntax error shown on console
  xhr.addEventListener("load", function() {
    console.log("Request sent", req.status);
    console.log('ResponseText:', xhr.responseText);
  });
  // create fileReader and read file as buffer
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // when file is read, send the request with buffer (which is inside reader.result)
  reader.onload = function() {
    xhr.send(reader.result);
  }
  // reload page, forceGet set to true to reload from server instread of cache
  location.reload(true);
});


// deleteFile callback with delete request
function deleteFile(e) {
  var xhr = new XMLHttpRequest();
  console.log(e.target);
  xhr.open("Delete", `http://localhost:8000/${e.target.attributes.file.value}`, true);
  xhr.addEventListener("load", function() {
    console.log("Request sent, status:", req.status);
    console.log('ResponseText>', xhr.responseText);
    location.reload(true);
  });
  xhr.send(null);
}
