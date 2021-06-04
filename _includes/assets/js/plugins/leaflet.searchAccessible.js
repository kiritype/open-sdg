/*
 * Leaflet search.
 *
 * This is customized version of L.Control.Search.
 * See here: https://github.com/stefanocudini/leaflet-search
 */
(function () {
  "use strict";

  if (typeof L === 'undefined') {
    return;
  }

  L.Control.SearchAccessible = L.Control.Search.extend({
    onAdd: function(map) {
      var container = L.Control.Search.prototype.onAdd.call(this, map);
      var listboxId = 'map-search-tooltip-list';

      this._input.setAttribute('aria-label', this._input.placeholder);

      this._button.setAttribute('role', 'button');
      this._accessibleCollapseInput();
      this._accessibleCollapseTooltip();
      this._button.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

      this._cancel.setAttribute('role', 'button');
      this._cancel.setAttribute('aria-label', this._cancel.title);
      this._cancel.innerHTML = '<i class="fa fa-close" aria-hidden="true"></i>';

      this._tooltip.setAttribute('id', listboxId);
      this._tooltip.setAttribute('role', 'listbox');

      this._container.setAttribute('role', 'combobox');
      this._container.setAttribute('aria-haspopup', 'listbox');
      this._container.setAttribute('aria-owns', listboxId);

      this._input.setAttribute('aria-autocomplete', 'list');
      this._input.setAttribute('aria-controls', listboxId);

      // Prevent the delayed collapse when tabbing out of the input box.
      L.DomEvent.on(this._cancel, 'focus', this.collapseDelayedStop, this);

      return container;
    },
    _accessibleExpandInput: function() {
      this._accessibleDescription(translations.indicator.map_search_hide);
      this._button.setAttribute('aria-expanded', 'true');
    },
    _accessibleCollapseInput: function() {
      this._accessibleDescription(translations.indicator.map_search_show);
      this._button.setAttribute('aria-expanded', 'false');
    },
    _accessibleExpandTooltip: function() {
      this._container.setAttribute('aria-expanded', 'true');
    },
    _accessibleCollapseTooltip: function() {
      this._container.setAttribute('aria-expanded', 'false');
    },
    _accessibleDescription: function(description) {
      this._button.title = description;
      this._button.setAttribute('aria-label', description);
    },
    expand: function(toggle) {
      L.Control.Search.prototype.expand.call(this, toggle);
      this._accessibleExpandInput();
      return this;
    },
    collapse: function() {
      L.Control.Search.prototype.collapse.call(this);
      this._accessibleCollapseInput();
      return this;
    },
    cancel: function() {
      L.Control.Search.prototype.cancel.call(this);
      this._accessibleExpandInput();
      return this;
    },
    showTooltip: function(records) {
      L.Control.Search.prototype.showTooltip.call(this, records);
      this._accessibleDescription(translations.indicator.map_search);
      this._button.removeAttribute('aria-expanded');
      this._accessibleExpandTooltip();
      return this._countertips;
    },
    _handleSubmit: function(e) {
      // Prevent the enter key from immediately collapsing the search bar.
      if ((typeof e === 'undefined' || e.type === 'keyup') && this._input.value === '') {
        return;
      }
      L.Control.Search.prototype._handleSubmit.call(this, e);
    },
    _createAlert: function(className) {
      var alert = L.Control.Search.prototype._createAlert.call(this, className);
      alert.setAttribute('role', 'alert');
      return alert;
    }
  });
}());
