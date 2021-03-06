import {
  PolymerElement,
  html,
} from '@polymer/polymer/polymer-element';
import {
  dom
} from '@polymer/polymer/lib/legacy/polymer.dom';
import {
  IronControlState
} from '@polymer/iron-behaviors/iron-control-state';
import {
  IronA11yKeysBehavior
} from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior';
import {
  mixinBehaviors
} from '@polymer/polymer/lib/legacy/class.js';

import '@polymer/iron-menu-behavior/iron-menu-behavior';
import '@polymer/iron-collapse/iron-collapse';

import './app-menu-shared-styles';

class AppSubmenu extends mixinBehaviors([IronControlState, IronA11yKeysBehavior], PolymerElement) {
  static get template() {
    return html `
<style include="app-menu-shared-styles"></style>
<style>
  :host {
  display: block;
}

#collapse ::slotted(app-menu) {
  padding: 0;
}

.selectable-content ::slotted(.app-menu-item.iron-selected) {
  background-color: transparent;
}

  :host(:focus) .selectable-content ::slotted(.app-menu-item) {
  background-color: var(--app-menu-selected-bg-color, var(--primary-background-color));
}

.selectable-content ::slotted(.app-menu-item.iron-selected:hover) {
  background-color: var(--app-menu-selected-bg-color, var(--primary-background-color));
}

  :host([disabled]) .selectable-content ::slotted(.app-menu-item) {
  color: var(--app-menu-disabled-color, var(--disabled-text-color));
  pointer-events: none;
}

</style>

<div id="triggerHolder" class="selectable-content" on-tap="_onTap">
  <slot id="trigger" name="submenu-trigger"></slot>
</div>
<iron-collapse id="collapse" opened="{{opened}}">
  <slot id="content" name="submenu-content"></slot>
</iron-collapse>
`;
  }

  ready() {
    super.ready();

    this.addEventListener('focus', this._onFocus);
    this.addEventListener('iron-select', this._onIronSelect);
    this.addEventListener('iron-deselect', this._onIronDeselect);
  }

  static get is() {
    return 'app-submenu';
  }

  static get properties() {
    return {
      /**
       * Fired when the submenu is opened.
       *
       * @event app-submenu-open
       */

      /**
       * Fired when the submenu is closed.
       *
       * @event app-submenu-close
       */

      /**
       * Set opened to true to show the collapse element and to false to hide it.
       *
       * @attribute opened
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_openedChanged'
      },

      /**
       * Set noAutoClose to true to prevent submenu from auto closing.
       *
       * @attribute noAutoClose
       */
      noAutoClose: {
        type: Boolean,
        value: false,
        observer: '_closeOthers'
      },

      /**
       * Set noAutoClose to true to prevent submenu from closing when its deactivated.
       *
       * @attribute noAutoClose
       */
      noAutoCloseOnDeactivate: {
        type: Boolean,
        value: false
      }
    };
  }

  get keyBindings() {
    return {
      'enter:keydown': '_asyncClick',
      'space:keydown': '_spaceKeyDownHandler',
      'space:keyup': '_spaceKeyUpHandler'
    };
  }

  get __parent() {
    return dom(this).parentNode;
  }

  get __childNodes() {
    return dom(this.__parent).childNodes;
  }

  get __trigger() {
    return dom(this.$.trigger).getDistributedNodes()[0];
  }

  get __content() {
    return dom(this.$.content).getDistributedNodes()[0];
  }

  attached() {
    this.listen(this.__parent, 'iron-activate', '_onParentIronActivate');
  }

  detached() {
    this.unlisten(this.__parent, 'iron-activate', '_onParentIronActivate');
  }

  /**
   * Expand the submenu content.
   */
  open() {
    if (!this.disabled) {
      this.opened = true;
    }
  }

  /**
   * Collapse the submenu content.
   */
  close() {
    this.opened = false;
  }

  /**
   * Toggle the submenu.
   */
  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  _spaceKeyDownHandler(event) {
    var keyboardEvent = event.detail.keyboardEvent;
    var target = dom(keyboardEvent).localTarget;

    // Ignore the event if this is coming from a focused light child, since that
    // element will deal with it.
    if (this.isLightDescendant( /** @type {Node} */ (target)))
      return;

    keyboardEvent.preventDefault();
    keyboardEvent.stopImmediatePropagation();
    this._submenuBtnPressed = true;
  }

  _spaceKeyUpHandler(event) {
    var keyboardEvent = event.detail.keyboardEvent;
    var target = dom(keyboardEvent).localTarget;

    // Ignore the event if this is coming from a focused light child, since that
    // element will deal with it.
    if (this.isLightDescendant( /** @type {Node} */ (target)))
      return;

    if (this._submenuBtnPressed) {
      this._asyncClick();
    }
    this._submenuBtnPressed = false;
  }

  _asyncClick() {
    this.async(function () {
      this.$.trigger.click();
    }, 1);
  }

  _closeOthers() {
    if (!this.noAutoClose) {
      this.__childNodes.forEach(function (item) {
        if (item !== this && item.nodeName === 'APP-SUBMENU' && item.opened) {
          item.close();
        }
      }.bind(this));
    }
  }

  /**
   * A handler that is called when the trigger is tapped.
   */
  _onTap(e) {
    e.stopPropagation();
    if (!this.disabled) {
      this.toggle();
      this._closeOthers();
    }
  }

  /**
   * Toggles the submenu content when the trigger is tapped.
   */
  _openedChanged(opened, oldOpened) {
    if (opened) {
      this.fire('app-submenu-open');
    } else if (oldOpened != null) {
      this.fire('app-submenu-close');
    }
  }

  /**
   * A handler that is called when `iron-activate` is fired.
   *
   * @param {CustomEvent} event An `iron-activate` event.
   */
  _onParentIronActivate(event) {
    var submenuList = dom(event).localTarget;
    var localTarget = dom(submenuList).parentNode;

    if (localTarget === this.__parent || localTarget !== this) {
      if (!this.noAutoCloseOnDeactivate && !this.noAutoClose) {
        this.close();
      }
      this.__content.selectIndex(-1);
    }
  }

  /**
   * If the dropdown is open when disabled becomes true, close the
   * dropdown.
   *
   * @param {boolean} disabled True if disabled, otherwise false.
   */
  _disabledChanged(disabled) {
    IronControlState._disabledChanged.apply(this, arguments);
    if (disabled && this.opened) {
      this.close();
    }
  }

  /**
   * Handler that is called when the menu item is selected
   *
   */
  _onIronSelect() {
    if (this.__parent.nodeName === 'APP-MENU') {
      this.__parent.selectIndex(-1);
    }

    if (!this.opened) {
      this.open();
    }

    this.__trigger && this.__trigger.classList.add('iron-selected');
  }

  /**
   * Handler that is called when menu item is deselected
   *
   */
  _onIronDeselect() {
    this.__trigger && this.__trigger.classList.remove('iron-selected');
  }

  /**
   * Handler that is called when the menu receives focus.
   *
   * @param {FocusEvent} event A focus event.
   */
  _onFocus(event) {
    this.__trigger && this.__trigger.focus();
  }
}

window.customElements.define(AppSubmenu.is, AppSubmenu);
