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

Variable | Default Value | Description | Valid Options
---------|---------------|-------------|--------------
autoplay | `false` | Whether or not the carousel plays automatically | boolean
buttons  | `""` | The buttons to interact with the slides. They must have the `data-carro` property with the slide number or a "+n" or "-n" for relative slide. | string, html element, jquery object
buttonActiveClass  | `""` | An optional class added to the active button | string
enter  | `undefined` | Callback used on enter in a slide. Use `this` to get the slide element. | function
fitToLimits  | `false` | Set true to limit the tray to the window limits | boolean
fluid  | `false` | Set true to move the trait in a fuild way, instead slide by slide. This option ony has effects combined with `fitToLimits` | boolean
index  | `0` | The initial slide visible (0 based) | integer
interval  | `5000` | The interval duration between two slides on play (in miliseconds) | integer
leave  | `undefined` | Callback used on leave a slide. Use `this` to get the slide element. | function
offset  | `0` | Horizontal offset of the tray position in pixels. It can ben also "center" to center the current slide in the window | integer or "center"
slideActiveClass  | `""` | An optional class added to the active slide | string
slidesFilter  | `"*"` | The selector used to filter the element choosen as slides | string
trayFilter  | `"*"` | The selector used to filter the element choosen as tray | string
