# Carro

Carro is a jquery plugin to create a chromeless css-based carousel with any html code. It uses `translateX` css function to move the content, so you can use css to customize the animation.

## Full example example

```html
<html>
  <head>
    <meta charset="utf-8">

    <!-- Import js -->
    <script src="js/jquery.min.js"></script>
    <script src="js/jquery.carro.js"></script>

    <!-- Use css to style your carousel -->
    <style>
      .gallery {
        width: 100%;
        overflow: hidden;
      }
      .gallery-tray {
        display: -webkit-flex;
        display: flex;
        -webkit-transition: transform 1s;
        transition: transform 1s;
      }
      .gallery-tray img {
        opacity: 0.3;
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
      }
      .gallery-tray img.active {
        opacity: 1;
      }
    </style>

    <!-- Use Carro -->
    <script>
      $(document).ready(function () {
        $('.gallery').carro({
            buttons: 'button',
            fitToLimits: true,
            offset: 'center',
            enter: function () {
              $(this).addClass('active');
            },
            leave: function () {
              $(this).removeClass('active');
            }
          });
      });
    </script>
    
  </head>

  <body>
    <!-- The html scheme -->
    <div class="gallery">
      <div class="gallery-tray">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
        <img src="http://lorempixum.com/400/200/" alt="">
      </div>
    </div>

    <button data-carro="0">0</button>
    <button data-carro="1">1</button>
    <button data-carro="2">2</button>
    <button data-carro="3">3</button>
    <button data-carro="4">4</button>
    <button data-carro="5">5</button>
    <button data-carro="6">6</button>
    <button data-carro="7">7</button>
    <button data-carro="8">8</button>
    <button data-carro="9">9</button>
    <br>
    <button data-carro="-1">-1</button>
    <button data-carro="+1">+1</button>
  </body>
</html>
```

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
        <td>autoplay</td>
        <td>false</td>
        <td>Whether or not the carousel plays automatically</td>
        <td>boolean</td>
      </tr>

      <tr>
        <td>buttons</td>
        <td>""</td>
        <td>The html elements to interact with the slides. They must have the `data-carro` property with the slide number or a "+n" or "-n" for relative slide.</td>
        <td>string, html element, jquery object</td>
      </tr>

      <tr>
        <td>fitToLimits</td>
        <td>false</td>
        <td>Set true to limit the tray to the window limits</td>
        <td>boolean</td>
      </tr>

      <tr>
        <td>index</td>
        <td>0</td>
        <td>The initial slide visible</td>
        <td>integer</td>
      </tr>

      <tr>
        <td>interval</td>
        <td>5000</td>
        <td>The interval duration on play in miliseconds</td>
        <td>integer</td>
      </tr>

      <tr>
        <td>offset</td>
        <td>0</td>
        <td>Horizontal offset position of the tray with all slides in pixels. It can ben also "center" to center the current slide in the window</td>
        <td>integer or "center"</td>
      </tr>

      <tr>
        <td>trayFilter</td>
        <td>*</td>
        <td>The selector to filter the children of the main element converted to the tray</td>
        <td>string</td>
      </tr>

      <tr>
        <td>slidesFilter</td>
        <td>*</td>
        <td>The selector to filter the children of the tray that will be the slides</td>
        <td>string</td>
      </tr>

      <tr>
        <td>enter</td>
        <td></td>
        <td>Callback used on enter in a slide</td>
        <td>function</td>
      </tr>

      <tr>
        <td>leave</td>
        <td></td>
        <td>Callback used on leave a slide</td>
        <td>function</td>
      </tr>
    </tbody>
  </table>
