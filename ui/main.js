// Counter code
var button = document.getElementById('counter');

button.onclick = function () {
    // Make a request to the counter endpoint
    var request = new XMLHttpRequest();
    
    // Capture the response and store it in a variable
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE){
            if (request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();
            }
        }
        // Not done yet
    };
    
    // Make the request
    request.open('GET','http://pnpiano.imad.hasura-app.io/counter', true);
    request.send(null);
};

// Submit Name page code

var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit-btn');
submit.onclick = function () {
    // Make the request
    request.open('GET','http://pnpiano.imad.hasura-app.io/submit-name', true);
    request.send(null);
    
    // Capture list of names and render it as a list
    var name = ['name1', 'name2', 'name3', 'name4'];
    var list = '';
    for (var i=0; i<names.length;i++){
        list += '<li>' + names[i] + '</li>';
    }
    var ul = document.getElementById('namelist');
    ul.innerHTML=list;
};


