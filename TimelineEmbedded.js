WebInspector.TimelineEmbedded = function() {
	WebInspector.timelineManager = new WebInspector.TimelineManager();
	//needed for the timeline panel
	WebInspector.shortcutsScreen = new WebInspector.ShortcutsScreen();
	WebInspector.networkManager = new WebInspector.NetworkManager();
	WebInspector.console = new WebInspector.ConsoleModel();
	WebInspector.console.addEventListener(WebInspector.ConsoleModel.Events.ConsoleCleared, WebInspector._updateErrorAndWarningCounts, this);
    WebInspector.console.addEventListener(WebInspector.ConsoleModel.Events.MessageAdded, WebInspector._updateErrorAndWarningCounts, this);
    WebInspector.console.addEventListener(WebInspector.ConsoleModel.Events.RepeatCountUpdated, WebInspector._updateErrorAndWarningCounts, this);
	WebInspector.resourceTreeModel = new WebInspector.ResourceTreeModel(WebInspector.networkManager);
	WebInspector.debuggerModel = new WebInspector.DebuggerModel();
	WebInspector.searchController = new WebInspector.SearchController();
	WebInspector.toolbar = new WebInspector.Toolbar();

	WebInspector.inspectorView = new WebInspector.InspectorView();

	this.timelinePanel = new WebInspector.TimelinePanel();
	this.timelinePanel._overviewPane._frameOverview = new WebInspector.TimelineFrameOverview(this.timelinePanel._model);

	//more dependencies needed for displaying loaded data
	this._frameController = new WebInspector.TimelineFrameController(this.timelinePanel._model, this.timelinePanel._overviewPane, this.timelinePanel._presentationModel);
	//used for timlinePanel.wasShown
	WebInspector.drawer = new WebInspector.Drawer();

}


window.addEventListener("DOMContentLoaded", embedTimeline, false);


function embedTimeline() {
	this.timelineEmbedded = new WebInspector.TimelineEmbedded();
	var mainDiv = document.getElementById("main");
	var mainPanelsDiv = document.createElement("div");
	mainPanelsDiv.id = "main-panels"
	mainDiv.appendChild(mainPanelsDiv)

	var timelineDiv = this.timelineEmbedded.timelinePanel.element;
	//needed because WebKit really doesn't want you embedding the inspector in a webpage
	timelineDiv.__view = null;
	timelineDiv.addStyleClass("visible");
	mainPanelsDiv.appendChild(timelineDiv);
	//because this isn't running inside of a fully fledged inspector, some of the methods that set all of the panels styles aren't called
	this.timelineEmbedded.timelinePanel.splitView._restoreSidebarWidth()
	//adds style properties (none of the background images load without this)
	//this.timelineEmbedded.timelinePanel._overviewModeSetting.set("Events");
	this.timelineEmbedded.timelinePanel.wasShown();
	//WebInspector.inspectorView.setCurrentPanel(this.embedTimeline.timelinePanel);
	console.log("created timeline");
}
