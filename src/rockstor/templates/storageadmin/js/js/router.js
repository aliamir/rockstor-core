/*
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 * 
 * Copyright (c) 2012-2013 RockStor, Inc. <http://rockstor.com>
 * This file is part of RockStor.
 * 
 * RockStor is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 * 
 * RockStor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 * 
 */

// routes
var AppRouter = Backbone.Router.extend({
  initialize: function() {
    this.currentLayout = null;
  },

  routes: {
    "login": "loginPage",
    "setup": "doSetup",
    "home": "showHome",
    "disks": "showDisks",
    "pools": "showPools",
    "pools/:poolName": "showPool",
    "add_pool": "addPool",
    "shares": "showShares",
    "add_share?poolName=:poolName": "addShare",
    "add_share": "addShare",
    "shares/:shareName": "showShare",
    "shares/:shareName/:snapshots": "showSnaps",
    "shares/:shareName/:snapshots/:snapName": "showSnap",
    "services": "showServices",
    "services/:serviceName/edit": "configureService",
    "support":"showSupport",
    "support/:supportCaseId": "showSupportCase",
    "add_support_case": "addSupportCase",
    "users": "showUsers",
    "users/:username/edit": "editUser",
    "add-user": "addUser",
    "analytics": "showProbeRunList",
    "run_probe": "runProbe",
    "probeDetail/:probeName/:probeId": "showProbeDetail",
    "replication": "showReplication",
    "replication/:replicaId/trails": "showReplicaTrails",
    "add_replication_task": "addReplicationTask",
    "*path": "showHome"
  },

  before: function (route, param) {
    if (!logged_in) {
      if (route != "login") {
        app_router.navigate('login', {trigger: true});
        return false;
      }
    } else {
      if (route != "setup" && !setup_done) {
        app_router.navigate('setup', {trigger: true});
        return false;
      } else if (route == "setup" && setup_done) {
        app_router.navigate('home', {trigger: true});
        return false;
      } 
    }
    if (RockStorGlobals.currentAppliance == null) {
      setApplianceName();
    }
  },

  loginPage: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("setup", "user");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new LoginView();
    $('#maincontent').append(this.currentLayout.render().el);

  },
  doSetup: function() {
    RockStorSocket.removeAllListeners();
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new SetupView();
    $('#maincontent').append(this.currentLayout.render().el);

  },

  showHome: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("dashboard", "dashboard");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new HomeLayoutView();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  showDisks: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "disks");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new DisksView();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  showPools: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "pools");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new PoolsView();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  addPool: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "pools");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new AddPoolView();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  showPool: function(poolName) {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "pools");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new PoolDetailsLayoutView({
      poolName: poolName
    });
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  //Support
  
  showSupport: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("support", "support");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new SupportView();
    $('#maincontent').append(this.currentLayout.render().el);
  },


  addSupportCase: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("support", "support");
    $('#maincontent').empty();
    $('#maincontent').append(addSupportCaseView.render().el);
  },

  showSupportCase: function(supportCaseId) {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("support", "support");

    var supportCaseDetailView = new SupportCaseDetailView({
      model: new SupportCase({supportCaseId: supportCaseId})
    });
    $('#maincontent').empty();
    $('#maincontent').append(supportCaseDetailView.render().el);
  },


  //shares
  
  showShares: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "shares");
    $('#maincontent').empty();
    this.cleanup();
    this.currentLayout = new SharesView();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  showSnaps: function(shareName) {
    var snapshotsTableView = new SnapshotsTableView({
      model: new Share({shareName: shareName})
    });  
  },
  
  showSnap: function(shareName, snapName) {
    var snapshotsTableView = new SnapshotsTableView({
      model: new Share({shareName: shareName})
    });  
  },
  
  addShare: function(poolName) {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("storage", "shares");
		$('#maincontent').empty();
    this.cleanup();
    if (_.isUndefined(poolName)){ 
    	   	this.currentLayout = new AddShareView();
		} else {
			this.currentLayout = new AddShareView({ poolName: poolName });
		}
		$('#maincontent').append(this.currentLayout.render().el);
    
  },

  showShare: function(shareName) {
    RockStorSocket.removeAllListeners();
    //var shareDetailView = new ShareDetailView({
      //model: new Share({shareName: shareName})
    //});

    this.renderSidebar("storage", "shares");
    var shareDetailsLayoutView = new ShareDetailsLayoutView({
      shareName: shareName 
    });

    $('#maincontent').empty();
    //$('#maincontent').append(shareDetailView.render().el);
    $('#maincontent').append(shareDetailsLayoutView.render().el);

  },
  deleteShare: function(shareName) {

  },
  showServices: function() {
    RockStorSocket.removeAllListeners();
    this.renderSidebar("system", "services");
    this.cleanup();
    this.currentLayout = new ServicesView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);

  },

  configureService: function(serviceName) {
    this.renderSidebar("system", "services");
    this.cleanup();
    this.currentLayout = new ConfigureServiceView({serviceName: serviceName});
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  showUsers: function() {
    this.renderSidebar("system", "users");
    this.cleanup();
    this.currentLayout = new UsersView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  addUser: function() {
    this.renderSidebar("system", "users");
    this.cleanup();
    this.currentLayout = new AddUserView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  editUser: function(username) {
    this.renderSidebar("system", "users");
    this.cleanup();
    this.currentLayout = new EditUserView({username: username});
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  showProbeRunList: function() {
    this.renderSidebar("analytics", "probe_runs");
    this.cleanup();
    this.currentLayout = new ProbeRunListView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },
  
  runProbe: function() {
    this.renderSidebar("analytics", "run_probe");
    this.cleanup();
    this.currentLayout = new RunProbeView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  showProbeDetail: function(probeName, probeId) {
    this.cleanup();
    this.currentLayout = new ProbeDetailView({
      probeId: probeId,
      probeName: probeName
    });
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  renderSidebar: function(name, selected) {
    var sidenavTemplate = window.JST["common_sidenav_" + name];
    $("#sidebar-inner").html(sidenavTemplate({selected: selected}));
  },

  showReplication: function() {
    this.renderSidebar("storage", "replication");
    this.cleanup();
    this.currentLayout = new ReplicationView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  showReplicaTrails: function(replicaId) {
    this.renderSidebar("storage", "replication");
    this.cleanup();
    this.currentLayout = new ReplicaTrailsView({
      replicaId: replicaId
    });
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  addReplicationTask: function() {
    this.renderSidebar("storage", "replication");
    this.cleanup();
    this.currentLayout = new AddReplicationTaskView();
    $('#maincontent').empty();
    $('#maincontent').append(this.currentLayout.render().el);
  },

  cleanup: function() {
    hideMessage();
    RockStorSocket.removeAllListeners();
    if (!_.isNull(this.currentLayout)) {
      if (_.isFunction(this.currentLayout.cleanup)) {
        this.currentLayout.cleanup();
      }
    }
  }
  
});

// Initiate the router
var app_router = new AppRouter;
// ###Render the view###
// On document load, render the view.
$(document).ready(function() {
  // Start Backbone history a neccesary step for bookmarkable URL's
  if (!RockStorGlobals.navbarLoaded) {
    refreshNavbar();
  }
  Backbone.history.start();
  $('#appliance-name').click(function(event) {
    event.preventDefault();
    showApplianceList();
  });

  // Initialize websocket connection
  // logger.debug('connecting to websocket');
  // RockStorSocket.socket = io.connect('https://' + document.location.host + ':' + NGINX_WEBSOCKET_PORT, 
    // {secure: true}
  // );
  // RockStorSocket.socket.on('sm_data', RockStorSocket.msgHandler);
  
});

