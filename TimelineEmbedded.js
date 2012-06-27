WebInspector.TimelineEmbedded = function() {
	WebInspector.timelineManager = new WebInspector.TimelineManager();
	//needed for the timeline panel
	WebInspector.shortcutsScreen = new WebInspector.ShortcutsScreen();
	WebInspector.networkManager = new WebInspector.NetworkManager();
	WebInspector.console = new WebInspector.ConsoleModel();
	WebInspector.resourceTreeModel = new WebInspector.ResourceTreeModel(WebInspector.networkManager);
	WebInspector.debuggerModel = new WebInspector.DebuggerModel();
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
	//because this isn't running inside of a fully fledged inspector, some of the methods that set all of the panels styles aren't called
	this.timelineEmbedded.timelinePanel.splitView._restoreSidebarWidth()

	console.log("created timeline");
}
