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

(function () {
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
                    authResultant = authResult
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
})();



var loginElement = document.getElementById('btn_submit');
var committeeElement = document.getElementById('committees');
var meetingElement = document.getElementById('commMeet');
var memberElement = document.getElementById('commMembers');
loginElement.addEventListener('click', function () {
    'use strict';
    loginElement.style.display = 'none';
    committeeElement.style.visibility = 'visible';
    var commRequestResponse = JSON.parse(req.responseText);
    for (var i = 0; i < commRequestResponse.value.length; i++) {
        var committeeList = committeeElement.innerHTML;
        committeeList += '<option value="' + i + '">' + commRequestResponse.value[i].new_name + '</option>';
        committeeElement.innerHTML = committeeList;
    }
    committeeElement.selectedIndex = -1;
});
committeeElement.addEventListener('change', function () {
    'use strict';
    try {
        var selectedText = committee.options[committee.selectedIndex].innerHTML;
        var selectedValue = committee.value;
        var req = new XMLHttpRequest
        req.open("GET", encodeURI(organizationURL + "/api/data/v8.0/new_committeemeetings?$filter=_new_committee_value eq 5af60570-e86e-e611-80d9-fc15b428dc1c&$select=new_name"), true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
        var meetRequestResponse = JSON.parse(req.responseText);
        for (var i = 0; i < meetRequestResponse.value.length; i++) {
            var meetingList = meetingElement.innerHTML;
            meetingList += '<option value="' + i + '">' + meetRequestArray.value[i].new_name + '</option>';
            meetingElement.innerHTML = meetingList;
        }
        meetingElement.selectedIndex = -1;
        meetingElement.style.visibility = "visible";
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
});
meetingElement.addEventListener('change', function () {
    'use strict';
    try {
        var selectedText = committee.options[committee.selectedIndex].innerHTML;
        var selectedValue = committee.value;
        var req = new XMLHttpRequest;
       req.open("GET", encodeURI(organizationURL + "/api/data/v8.0/new_committeemembers?$filter=_new_committee_value eq 5af60570-e86e-e611-80d9-fc15b428dc1c&$select=new_name"), true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
        var cmRequestResponse = JSON.parse(req.responseText);
        for (var i = 0; i < cmRequestReturns.value.length; i++) {
            var cmList = memberElement.innerHTML;
            cmList += '' + cmRequestResponse[i] + '<input type="checkbox" value="' + cmRequestResponse[i] + '"/>';//meetRequestArray.value[i].new_name; //cmRequest.value[i].new_committeemeetingid;
            memberElement.innerHTML = cmList;
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
});
memberElement.addEventListener('change', function(){
                'use strict';
                cmRequest();
});
