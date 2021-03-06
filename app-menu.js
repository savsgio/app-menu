/**
Material design: [Menus](https://www.google.com/design/spec/components/menus.html)

`<app-menu>` implements an accessible menu control with Material Design styling. The focused item
is highlighted, and the selected item has colored text.

    <app-menu>
      <a href="#" class="app-menu-item">Item 1</a>
      <a href="#" class="app-menu-item">Item 2</a>
    </app-menu>

An initial selection can be specified with the `selected` attribute.

    <app-menu selected="0">
      <a href="#" class="app-menu-item">Item 1</a>
      <a href="#" class="app-menu-item">Item 2</a>
    </app-menu>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--app-menu-selected-bg-color`  | Menu background color | `--primary-background-color`
`--app-menu-background-color`   | Menu background color  | `--primary-background-color`
`--app-menu-color`              | Menu foreground color  | `--primary-text-color`
`--app-menu-disabled-color`     | Foreground color for a disabled item  | `--disabled-text-color`
`--app-menu`                    | Mixin applied to the menu    | `{}`
`--app-menu-selected-item`      | Mixin applied to the selected item        | `{}`
`--app-menu-focused-item`       | Mixin applied to the focused item         | `{}`
`--app-menu-focused-item-after` | Mixin applied to the ::after pseudo-element for the focused item | `{}`

### Accessibility

`<app-menu>` has `role="menu"` by default. It implements key bindings to navigate through the menu with the up and down arrow keys, esc to exit the menu, and enter to activate a menu item. Typing the first letter of a menu item will also focus it.

@group App Elements
@element app-menu
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import {
  PolymerElement,
  html,
} from '@polymer/polymer/polymer-element';
import {
  IronMenuBehavior
} from '@polymer/iron-menu-behavior/iron-menu-behavior';
import {
  mixinBehaviors
} from '@polymer/polymer/lib/legacy/class.js';

import '@polymer/paper-styles/default-theme';
import './app-menu-shared-styles';


class AppMenu extends mixinBehaviors(IronMenuBehavior, PolymerElement) {
  static get template() {
    return html `
<style include="app-menu-shared-styles"></style>
<style>
:host {
  display: block;
  padding: 8px 0;
  background: var(--app-menu-background-color, var(--primary-background-color));
  color: var(--app-menu-color, var(--primary-text-color));
  @apply(--app-menu);
}
</style>

<div class="selectable-content">
  <slot></slot>
</div>
`;
  }

  static get is() {
    return 'app-menu';
  }

  static get properties() {
    return {
      role: {
        type: String,
        value: "menu"
      }
    };
  }
}

window.customElements.define(AppMenu.is, AppMenu);
