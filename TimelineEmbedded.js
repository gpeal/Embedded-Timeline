WebInspector.loadTimelineResources = function() {
	this.timelineManager = new WebInspector.TimelineManager();
	this.shortcutsScreen = new WebInspector.ShortcutsScreen();
	this.console = new WebInspector.ConsoleModel();
	this.networkManager = new WebInspector.NetworkManager();
	this.resourceTreeModel = new WebInspector.ResourceTreeModel(this.networkManager);
	this.debuggerModel = new WebInspector.DebuggerModel();
	this.inspectorView = new WebInspector.InspectorView();
	this.drawer = new WebInspector.Drawer();

	this.timelinePanel = new WebInspector.TimelinePanel();
	this.timelinePanel._overviewPane._frameOverview = new WebInspector.TimelineFrameOverview(this.timelinePanel._model);

	this._frameController = new WebInspector.TimelineFrameController(this.timelinePanel._model, this.timelinePanel._overviewPane, this.timelinePanel._presentationModel);
}

var loaded = function() {
	WebInspector.loadTimelineResources();
	embedTimeline();
	requestTimelineLog();
}

window.addEventListener("DOMContentLoaded", loaded, false);

var embedTimeline = function() {
	//insert the Timeline in the DOM
	var mainDiv = document.getElementById("main");
	var mainPanelsDiv = document.createElement("div");
	mainPanelsDiv.id = "main-panels"
	mainDiv.appendChild(mainPanelsDiv)
	var timelineDiv = WebInspector.timelinePanel.element;
	//WekKit doesn't want you to embed inspector elements in a page so they identify elements that came from the inspector because they have
	//a __view proerty and override the appendChild method...
	var __view = timelineDiv.__view;
	timelineDiv.__view = null;
	timelineDiv.addStyleClass("visible");
	mainPanelsDiv.appendChild(timelineDiv);
	timelineDiv.__view = __view;

	//because this isn't running inside of a fully fledged inspector, some of the methods that set all of the panels styles aren't called
	WebInspector.timelinePanel.splitView._restoreSidebarWidth()
	WebInspector.timelinePanel.wasShown();
	WebInspector.timelinePanel._overviewPane._update();
}

var requestTimelineLog = function() {
	var xhr = new XMLHttpRequest();
    xhr.open("GET", "Logs/timeline_data", false);
    xhr.send(null);
    if(xhr.status == 200) {
    	var data = JSON.parse(xhr.responseText);
        WebInspector.timelinePanel._model.reset();
        WebInspector.timelinePanel._model._loadNextChunk(data, 1);
    }
}