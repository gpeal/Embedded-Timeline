//Overrides the original constructor to remove the DebuggerModel dependancy
/**
 * @constructor
 * @extends {WebInspector.Object}
 */
WebInspector.ResourceTreeModelEmbedded = function() { }

WebInspector.ResourceTreeModelEmbedded.prototype.__proto__ = WebInspector.ResourceTreeModel.prototype;

WebInspector.ResourceTreeModel = WebInspector.ResourceTreeModelEmbedded;


/**
 * @constructor
 * @param {WebInspector.LinkifierFormatter=} formatter
 */
WebInspector.LinkifierEmbedded = function(formatter) {
    WebInspector.Linkifier.constructor.call(this, formatter);
}

WebInspector.LinkifierEmbedded.prototype.__proto__ = WebInspector.Linkifier.prototype;
WebInspector.LinkifierEmbedded.constructor = WebInspector.Linkifier;
WebInspector.LinkifierEmbedded.DefaultFormatter = WebInspector.Linkifier.DefaultFormatter;

WebInspector.LinkifierEmbedded.prototype.linkifyLocation = function(url, lineNumber, columnNumber, classes)
{
    //From WebInspector.linkifyResourceAsNode except it's passing isExternal=true to linkifyURLAsNode.
    var linkText = WebInspector.formatLinkText(url, lineNumber);
    var anchor = WebInspector.linkifyURLAsNode(url, linkText, classes, true, "");
    anchor.preferredPanel = "resources";
    anchor.lineNumber = lineNumber;
    return anchor;
}

WebInspector.Linkifier = WebInspector.LinkifierEmbedded

/*
 * Embedded Timeline creates a special Timeline Pane that can be embedded in an iframe
 * All the page needs is a div with the id "main"
 */
 WebInspector.initializeEmbeddedTimeline = function() {
    this.timelineManager = new WebInspector.TimelineManager();
    this.shortcutsScreen = new WebInspector.ShortcutsScreen();
    this.resourceTreeModel = new WebInspector.ResourceTreeModel();
    //Is it needed? Even the real DevTools UI does not seem to display the drawer
    //The only dependancy is TimelinePanel:572 (WebInspector.drawer.currentPanelCounters = this.recordsCounter)
    this.drawer = new WebInspector.Drawer();
    this.timelinePanel = new WebInspector.TimelinePanel();
}

/**
 * @constructor
 */
WebInspector.TimelineEmbedded = function() { }

WebInspector.TimelineEmbedded.prototype =  {
    show: function() 
    {
        //FIXME: everything works fine with _isShowing = true but .show() breaks a lot of functionality
        WebInspector.timelinePanel._isShowing = true;
        //insert the Timeline in the DOM
        var mainDiv = document.getElementById("main-no-status-bar");
        var mainPanelsDiv = document.createElement("div");
        mainPanelsDiv.id = "main-panels"
        mainDiv.appendChild(mainPanelsDiv)
        var timelineDiv = WebInspector.timelinePanel.element;
        //WebKit doesn't want you to embed inspector elements in a page so they identify elements that came from the inspector because they have
        //a __view proerty and override the appendChild method to assert false... This hack temporarily removes the __view property.
        //FIXME: is is bad practice to modify private properties outside of their class. However, at this time there are no methods to change __view
        var __view = timelineDiv.__view;
        timelineDiv.__view = null;
        timelineDiv.addStyleClass("visible");
        mainPanelsDiv.appendChild(timelineDiv);
        timelineDiv.__view = __view;
        //because this isn't running inside of a fully fledged inspector, some of the methods that set all of the panels styles aren't called
        WebInspector.timelinePanel.splitView._restoreSidebarWidth()
        WebInspector.timelinePanel.wasShown();
    },



    /**
    * @param {string} url
    * @param {number} delay
    */
    loadFromUrl: function(url, delay)
    {
        if(arguments.length == 1)
            delay = 1000;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        if(xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            WebInspector.timelinePanel._model.reset();
            WebInspector.timelinePanel._model._loadNextChunk(data, 1);
        }
        //I guess the frames take a while to load in so if you try to redraw the canvas too soon
        //it will only draw some of the frames
        //1000ms second was found to be sufficient to load fairly long records (~15s)
        setTimeout(this._reloadPanels, delay);
    },

    

    _reloadPanels: function()
    {
        //An annoying hack required because the timeline needs to re-switch to the Events view but
        //it can only switch to the events view if it isn't currently in it
        WebInspector.timelinePanel._overviewPane.setMode("Memory");
        WebInspector.timelinePanel._overviewPane.setMode("Events");
    }
}

var pageLoaded = function() {
    WebInspector.initializeEmbeddedTimeline();
    WebInspector.timelineEmbedded = new WebInspector.TimelineEmbedded();
    WebInspector.timelineEmbedded.show();
    WebInspector.timelineEmbedded.loadFromUrl(getJSONUrl());
}

window.addEventListener("DOMContentLoaded", pageLoaded, false);

function getJSONUrl()
{
  var results = new RegExp("[\\?&]url=([^&#]*)").exec(window.location.search);
  if(results == null)
    return "";
  else
    return results[1];
}
