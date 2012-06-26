WebInspector.TimelineEmbedded = function() {
	WebInspector.timelineManager = new WebInspector.TimelineManager();
	WebInspector.shortcutsScreen = new WebInspector.ShortcutsScreen();
	this.timelinePanel = new WebInspector.TimelinePanel();
}


window.addEventListener("DOMContentLoaded", embedTimeline, false);


function embedTimeline() {
	this.timelineEmbedded = new WebInspector.TimelineEmbedded();
	var mainDiv = document.getElementById("main");
	var mainPanelsDiv = document.createElement("div");
	mainPanelsDiv.id = "main-panels"
	mainDiv.appendChild(mainPanelsDiv)

	var timelineDiv = this.timelineEmbedded.timelinePanel.element;
	timelineDiv.__view = null;
	timelineDiv.addStyleClass("visible");
	mainPanelsDiv.appendChild(timelineDiv);
	console.log("created timeline");
}
