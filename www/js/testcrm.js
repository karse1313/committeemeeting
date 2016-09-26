// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var AuthenticationContext;
var authority = 'https://login.microsoftonline.com/common';
var clientID = '901dd7d4-4e43-4498-b6d2-4a77f2298057';
var redirectURL = 'http://committeemeeting';
var resourceUrl = 'https://graph.windows.net/';
var organizationURL = "";
var authResultant;
//(function () {

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
   // document.getElementById("committees").addEventListener("change", meetRequest());

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        
        //AuthenticationContext = Microsoft.ADAL.AuthenticationContext;

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        document.getElementById('btn_submit').addEventListener('click', authenticate)
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
       
        // TODO: This application has been reactivated. Restore application state here.
    };

    function authenticate(authCompletedCallback) {
        AuthenticationContext = Microsoft.ADAL.AuthenticationContext;
            organizationURL = "https://syvsandbox2.crm.dynamics.com";
            AuthenticationContext.createAsync(authority).then(function (context) {
                context.acquireTokenAsync(organizationURL, clientID, redirectURL).then(function (authResult) {
                    commRequest(authResult);
                    authResultant = authResult;
                    return authResultant;
                })
                
            })
        }

    function commRequest(authResult) {
        var req = new XMLHttpRequest
        req.open("GET", encodeURI(organizationURL + "/api/data/v8.0/new_committees?$select=new_name"), true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var commRequest = JSON.parse(req.responseText);
                document.getElementById("btn_submit").style.visibility = "hidden";
                var sel = document.getElementById('committees');
                for (i = 0; i < commRequest.value.length; i++) {
                    var opt = document.createElement('option');
                    opt.innerHTML = commRequest.value[i].new_name;
                    opt.value = commRequest.value[i].new_committeeid;
                    sel.appendChild(opt);
                }
                sel.selectedIndex = -1;
                sel.style.visibility = "visible";
                
            }
        };
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Authorization", "Bearer " + authResult.accessToken);
        req.send();
    }
//})();
function meetRequest() {
    var sel = document.getElementById("commMeet");
    var committee = document.getElementById("committees");

    for (i = sel.options.length - 1; i >= 0; i--) {
        sel.remove(i);
    }

    try {
        var selectedText = committee.options[committee.selectedIndex].innerHTML;
        var selectedValue = committee.value;
        var req = new XMLHttpRequest
        req.open("GET", encodeURI(organizationURL + "/api/data/v8.0/new_committeemeetings?$filter=_new_committee_value eq "+ selectedValue +"&$select=new_name"), true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var meetRequest = JSON.parse(req.responseText);
                for (i = 0; i < meetRequest.value.length; i++) {
                    var opt = document.createElement('option');
                    opt.innerHTML = meetRequest.value[i].new_name;
                    opt.value = meetRequest.value[i].new_committeemeetingid;
                    sel.appendChild(opt);
                }
                sel.selectedIndex = -1;
                sel.style.visibility = "visible";
            }                   
        };
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Authorization", "Bearer " + authResultant.accessToken);
        req.send();
    }
    catch (err) {
        return;
    }
}

function cmRequest() {
    var sel = document.getElementById("commMembers");
    var committee = document.getElementById("committees");
    sel.innerHTML = '';

    try {
        var selectedText = committee.options[committee.selectedIndex].innerHTML;
        var selectedValue = committee.value;
        var req = new XMLHttpRequest;
        req.open("GET", encodeURI(organizationURL + "/api/data/v8.0/new_committeemembers?$filter=_new_committee_value eq " + selectedValue + "&$select=_new_contact_value&$expand=new_Contact($select=fullname)"), true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var cmRequest = JSON.parse(req.responseText);
                for (i = 0; i < cmRequest.value.length; i++) {
                    //var cmList;
                    //cmList += '' + cmRequest.value[i].new_Contact.fullname + '<input type="checkbox" value="' + cmRequest.value[i].new_committeememberid + '" id="' + cmRequest.value[i].new_committeememberid + '"/>';
                    //var label = document.createElement('label');
                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.value = cmRequest.value[i].new_committeememberid;
                    checkbox.name = cmRequest.value[i]._new_contact_value;

                    var name = document.createTextNode(cmRequest.value[i].new_Contact.fullname);
                    //label.appendChild(checkbox);
                    //label.appendChild(name);
                    
                    //entry.appendChild(cmList);
                    sel.appendChild(checkbox);
                    sel.appendChild(name);
                    //sel.innerHTML = cmList;
                }
                
            }
        };
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Authorization", "Bearer " + authResultant.accessToken);
        req.send();
    }
    catch (err) {
        return;
    }
}

function getCheckbox() {
    var commMeet = document.getElementById("commMeet");
    var sel = document.getElementById("commMembers");
    var count = sel.childElementCount;
    for (i = 0; i < count; i++) {
        if (sel.children[i].checked === true && sel.children[i].disabled === false) {
            var attendee = {};
            attendee["new_name"] = sel.children[i].value;
            attendee["new_CommitteeMeeting@odata.bind"] = "/new_committeemeetings(" + commMeet.value + ")";
            attendee["new_Contact@odata.bind"] = "/contacts(" + sel.children[i].name + ")";
            createAttendee(attendee);
            sel.children[i].disabled = true;
        }
    }  
}

function createAttendee(entityData) {
    try{
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(organizationURL + "/api/data/v8.0/new_committeemeetingattendees"), true);
       
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.onreadystatechange = null;
                if (req.status == 204) {
                    var entityUri = req.getResponseHeader("OData-EntityId");
                }
                else {
                    var error = JSON.parse(req.responseText);
                }
            }
        };
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Authorization", "Bearer " + authResultant.accessToken);
        req.send(JSON.stringify(entityData));
    }
    catch(err) {

    }
}

