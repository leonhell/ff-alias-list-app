var app = {
	init: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {
		var statusText = document.getElementById("status");

		document.getElementById("save-list-button").addEventListener("click", function () {
			statusText.textContent = "Lade...";

			var request = new XMLHttpRequest();
			request.open('GET', 'http://map.ffdus.de/data/nodes.json', true);

			request.onload = function() {
			  if (this.status >= 200 && this.status < 400) {
				// Success!
				statusText.textContent = "Erstelle Liste...";

				var data = JSON.parse(this.response);

				var text = nodeListTransform(data).join("\n");

				statusText.textContent = "Speichere Liste...";

				window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
					dir.getFile("WifiAnalyzer_Alias.txt", {create:true}, function(file) {
						file.createWriter(function(fileWriter) {
							var blob = new Blob([text], {type:'text/plain'});
							fileWriter.write(blob);
							statusText.textContent = "OK";
							window.setTimeout(function () {
								statusText.textContent = "";
							}, 2000);
						}, fail);
					});
				});

			  } else {
				// We reached our target server, but it returned an error
				statusText.textContent = "Serverfehler!";
			  }
			};

			request.onerror = function() {
				// There was a connection error of some sort
				statusText.textContent = "Verbindungsfehler! Hast du Internet?";
			};

			request.send();

			function fail(e) {
				statusText.textContent = "Exception: " + e;
			}

		});
	},
};

app.init();