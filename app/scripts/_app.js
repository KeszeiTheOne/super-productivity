/**
 * @ngdoc overview
 * @name superProductivity
 * @description
 * # superProductivity
 *
 * Main module of the application.
 */

(function () {
  'use strict';

  // Electron stuff
  // require ipcRenderer if available
  if (typeof require === 'function') {
    window.isElectron = true;

    const { ipcRenderer } = require('electron');
    window.ipcRenderer = ipcRenderer;
  }

  // app initialization
  angular
    .module('superProductivity', [
      'ngAnimate',
      'ngAria',
      'ngResource',
      'ui.router',
      'ngStorage',
      'ngMaterial',
      'ngMdIcons',
      'as.sortable',
      'angularMoment'
    ])
    .config(configMdTheme)
    .run(initGlobalModels)
    .run(initGlobalShortcuts);

  function configMdTheme($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue');
    //.dark();

    let themes = [
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey'
    ];
    for (let index = 0; index < themes.length; ++index) {
      $mdThemingProvider.theme(themes[index] + '-theme')
        .primaryPalette(themes[index]);

      $mdThemingProvider.theme(themes[index] + '-dark')
        .primaryPalette(themes[index])
        .dark();
    }

    $mdThemingProvider.alwaysWatchTheme(true);
  }

  function initGlobalModels($rootScope, Tasks, $localStorage) {
    $localStorage.$default({
      currentTask: null,
      tasks: [],
      backlogTasks: [],
      distractions: [],
      jiraSettings: {
        isFirstLogin: true,
        defaultTransitionInProgress: undefined,
        defaultTransitionDone: undefined,
      }
    });

    $rootScope.r = {};
    $rootScope.r.tasks = Tasks.getToday();
    $rootScope.r.backlogTasks = Tasks.getBacklog();
    $rootScope.r.currentTask = Tasks.getCurrent();
    $rootScope.r.doneBacklogTasks = Tasks.getDoneBacklog();

    $rootScope.r.distractions = $localStorage.distractions;

    $rootScope.r.jiraSettings = $localStorage.jiraSettings;

    $rootScope.r.noteForToday = $localStorage.tomorrowsNote;

    $rootScope.r.theme = $localStorage.theme || 'teal-theme';
  }

  function initGlobalShortcuts($document, Dialogs) {
    // we just use this single one as this usually does mess
    // up with the default browser shortcuts
    // better to use the global electron shortcuts here
    $document.bind('keypress', (ev) => {
      if (ev.key === '*') {
        Dialogs('ADD_TASK');
      }
      if (window.isElectron) {
        if (ev.keyCode === 10 && ev.ctrlKey === true && ev.shiftKey === true) {
          ipcRenderer.send('TOGGLE_DEV_TOOLS');
        }
      }
    });
  }

})();
