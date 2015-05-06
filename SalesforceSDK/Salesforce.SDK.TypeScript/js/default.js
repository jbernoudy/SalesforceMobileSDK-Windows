﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var oauth = new SalesforceJS.OAuth2();

    var fetchRecords = function () {
        var soql = 'SELECT Id, Name FROM Contact LIMIT 10';
        var rest = Salesforce.SDK.Hybrid.Rest;
        var cm = new rest.ClientManager();
        var client = cm.peekRestClient();

        var request = rest.RestRequest.getRequestForQuery("v31.0", soql);

        var response = client.sendAsync(request).then(function (data) {
            var users = JSON.parse(data.asString).records;

            var listItemsHtml = document.querySelector('#users');
            for (var i = 0; i < users.length; i++) {
                var li = document.createElement("li");
                var div = document.createElement("div");

                li.setAttribute("class", "table-view-cell");
                div.setAttribute("class", "media-body");
                div.innerHTML = users[i].Name;
                li.appendChild(div);
                listItemsHtml.appendChild(li);
            }
            var buttonli = document.createElement("li");
            var buttondiv = document.createElement("div");
            var logoutButton = document.createElement("button");
            buttonli.setAttribute("class", "table-view-cell");
            buttonli.setAttribute("align", "center");
            buttondiv.setAttribute("class", "media-body");
            logoutButton.addEventListener("click", logout, false);
            logoutButton.innerText = "Logout";
            buttondiv.appendChild(logoutButton);
            buttonli.appendChild(buttondiv);
            listItemsHtml.appendChild(buttonli);
        });
    };
    
    var clearRecords = function() {
        var elmtTable = document.querySelector('#users');
        var tableRows = elmtTable.getElementsByTagName('li');
        var rowCount = tableRows.length;

        for (var x=rowCount-1; x>=0; x--) {
            elmtTable.removeChild(tableRows[x]);
        }
    }

    var logout = function() {
        oauth.logout()
            .then(function () {
            clearRecords();
                startup(); });
    }

    var startup = function() {
        oauth.configureOAuth("data/bootconfig.json", null)
            .then(function() {
                oauth.loginDefaultServer().done(function() {
                    fetchRecords();
                }, function (error) {
                    startup();
                });
            });
    }

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                startup();
            } else {
                startup();
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
