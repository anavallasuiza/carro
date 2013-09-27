ansSlider jQuery plugin
=======================

Created by Oscar Otero (http://oscarotero.com / http://anavallasuiza.com)

ansSlider is released under the GNU Affero GPL version 3.
More information at http://www.gnu.org/licenses/agpl-3.0.html

Chromeless slider plugin.

### Available options:


<table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Default Value</th>
        <th>Description</th>
        <th>Valid Options</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>width</td>
        <td>false</td>
        <td>The width of the slides</td>
        <td>number</td>
      </tr>

      <tr>
        <td>scroll</td>
        <td>false</td>
        <td>Horizontal scroll</td>
        <td>boolean</td>
      </tr>

      <tr>
        <td>duration</td>
        <td>1000</td>
        <td>The duration of the transition in miliseconds</td>
        <td>number</td>
      </tr>

      <tr>
        <td>easing</td>
        <td>swing</td>
        <td>The transition easing</td>
        <td>string</td>
      </tr>

      <tr>
        <td>interval</td>
        <td>5000</td>
        <td>The interval duration on play in miliseconds</td>
        <td>number</td>
      </tr>

      <tr>
        <td>offset</td>
        <td>0</td>
        <td>Horizontal offset position of the tray with all slides in pixels</td>
        <td>number</td>
      </tr>

      <tr>
        <td>fitToLimits</td>
        <td>false</td>
        <td>Set true to limit the tray to the window limits</td>
        <td>boolean</td>
      </tr>

      <tr>
        <td>buttons</td>
        <td></td>
        <td>The html elements to interact with the slides</td>
        <td>string, html element, jquery object</td>
      </tr>

      <tr>
        <td>index</td>
        <td>0</td>
        <td>The initial slide visible</td>
        <td>number</td>
      </tr>

      <tr>
        <td>delay</td>
        <td>0</td>
        <td>The delay duration before change the slide in miliseconds</td>
        <td>number</td>
      </tr>

      <tr>
        <td>filter</td>
        <td>*</td>
        <td>The selector to filter the children elements converted to slides</td>
        <td>string</td>
      </tr>

      <tr>
        <td>beforeLoad</td>
        <td></td>
        <td>callback to execute before load the plugin</td>
        <td>function</td>
      </tr>

      <tr>
        <td>afterLoad</td>
        <td></td>
        <td>callback to execute after load the plugin</td>
        <td>function</td>
      </tr>

      <tr>
        <td>beforeChangeSlide</td>
        <td></td>
        <td>callback to execute before change the current slide</td>
        <td>function</td>
      </tr>

      <tr>
        <td>afterChangeSlide</td>
        <td></td>
        <td>callback to execute after change the current slide</td>
        <td>function</td>
      </tr>

      <tr>
        <td>beforeLoadSlide</td>
        <td></td>
        <td>callback to execute before add a new slide via ajax</td>
        <td>function</td>
      </tr>

      <tr>
        <td>afterLoadSlide</td>
        <td></td>
        <td>callback to execute after add a new slide via ajax</td>
        <td>function</td>
      </tr>

      <tr>
        <td>firstSlide</td>
        <td></td>
        <td>callback to execute when the tray reaches the first slide</td>
        <td>function</td>
      </tr>

      <tr>
        <td>lastSlide</td>
        <td></td>
        <td>callback to execute when the tray reaches the last slide</td>
        <td>function</td>
      </tr>
    </tbody>
  </table>
