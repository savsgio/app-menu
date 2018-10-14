import {
  PolymerElement,
  html,
} from '@polymer/polymer/polymer-element';

import '@polymer/iron-icon/iron-icon';


class AppMenuIconItem extends PolymerElement {
  static get template() {
    return html `
<style>
:host {
  display: block;
  color: currentColor;
  @apply(--app-menu-icon-item-style);
}

iron-icon {
  margin-right: 15px;
}
</style>


<iron-icon icon="[[icon]]"></iron-icon>
<slot></slot>
`;
  }

  static get is() {
    return 'app-menu-icon-item';
  }

  static get properties() {
    return {
      icon: {
        type: String,
        reflectToAttribute: true
      }
    };
  }
}

window.customElements.define(AppMenuIconItem.is, AppMenuIconItem);
