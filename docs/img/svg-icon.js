//Leaflet-SVGIcon
//SVG icon for any marker class
//Ilya Atkin
//ilya.atkin@unh.edu

L.DivIcon.SVGIcon = L.DivIcon.extend({
    options: {
        "circleText": "",
        "className": "svg-icon",
        "circleAnchor": [14,14], //defaults to [iconSize.x/2, iconSize.x/2]
        "circleColor": null, //defaults to color
        "circleOpacity": null, // defaults to opacity
        "circleFillColor": "rgb(255,255,255)",
        "circleFillOpacity": null, //default to opacity 
        "circleRatio": 0.5,
        "circleWeight": null, //defaults to weight
        "color": "rgb(0,102,255)",
        "fillColor": null, // defaults to color
        "fillOpacity": 1,
        "fontColor": "rgb(0, 0, 0)",
        "fontOpacity": "1",
        "fontSize": null, // defaults to iconSize.x/4
        "fontWeight": "normal",
        "iconAnchor": null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
        "iconSize": L.point(32,48),
        "opacity": 1,
        "popupAnchor": null,
        "shadowAngle": 20,
        "shadowBlur": 3,
        "shadowColor": "rgb(0,0,10)",
        "shadowEnable": true,
        "shadowLength": .5,
        "shadowOpacity": 0.3,
        "shadowTranslate": L.point(0,0),
        "weight": 1
    },
    initialize: function(options) {
        options = L.Util.setOptions(this, options)
        
        //iconSize needs to be converted to a Point object if it is not passed as one
        options.iconSize = L.point(options.iconSize)

        //in addition to setting option dependant defaults, Point-based options are converted to Point objects
        if (!options.circleAnchor) {
            options.circleAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.x)/2)
        }
        else {
            options.circleAnchor = L.point(options.circleAnchor)
        }
        if (!options.circleColor) {
            options.circleColor = options.color
        }
        if (!options.circleFillOpacity) {
            options.circleFillOpacity = options.opacity
        }
        if (!options.circleOpacity) {
            options.circleOpacity = options.opacity
        }
        if (!options.circleWeight) {
            options.circleWeight = options.weight
        }
        if (!options.fillColor) { 
            options.fillColor = options.color
        }
        if (!options.fontSize) {
            options.fontSize = Number(options.iconSize.x/4) 
        }
        if (!options.iconAnchor) {
            options.iconAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.y))
        }
        else {
            options.iconAnchor = L.point(options.iconAnchor)
        }
        if (!options.popupAnchor) {
            options.popupAnchor = L.point(0, (-0.75)*(options.iconSize.y))
        }
        else {
            options.popupAnchor = L.point(options.popupAnchor)
        }

        options.html = this._createSVG()
    },
    _createCircle: function() {
        var cx = Number(this.options.circleAnchor.x)
        var cy = Number(this.options.circleAnchor.y)
        var radius = this.options.iconSize.x/3.5 * Number(this.options.circleRatio)
        var fill = this.options.circleFillColor
        var fillOpacity = this.options.circleFillOpacity
        var stroke = this.options.circleColor
        var strokeOpacity = this.options.circleOpacity
        var strokeWidth = this.options.circleWeight
        var className = this.options.className + "-circle"        
       
        var circle = '<circle class="' + className + '" cx="' + cx + '" cy="' + cy + '" r="' + radius +
            '" fill="' + fill + '" fill-opacity="'+ fillOpacity +
            '" stroke="' + stroke + '" stroke-opacity=' + strokeOpacity + '" stroke-width="' + strokeWidth + '"/>'

        return circle
    },
    _createPathDescription: function() {
        // var height = Number(this.options.iconSize.y)
        // var width = Number(this.options.iconSize.x)
        // var weight = Number(this.options.weight)
        // var margin = weight / 2
        //
        // var startPoint = "M " + margin + " " + (width/2) + " "
        // var leftLine = "L " + (width/2) + " " + (height - weight) + " "
        // var rightLine = "L " + (width - margin) + " " + (width/2) + " "
        // var arc = "A " + (width/4) + " " + (width/4) + " 0 0 0 " + margin + " " + (width/2) + " Z"
        //
        // // var d = startPoint + leftLine + rightLine + arc
        var d = "m14.095833,1.55c-6.846875,0 -12.545833,5.691 -12.545833,11.866c0,2.778 1.629167,6.308 2.80625,8.746l9.69375,17.872l9.647916,-17.872c1.177083,-2.438 2.852083,-5.791 2.852083,-8.746c0,-6.175 -5.607291,-11.866 -12.454166,-11.866zm0,7.155c2.691667,0.017 4.873958,2.122 4.873958,4.71s-2.182292,4.663 -4.873958,4.679c-2.691667,-0.017 -4.873958,-2.09 -4.873958,-4.679c0,-2.588 2.182292,-4.693 4.873958,-4.71z"


        return d
    },
    _createPath: function() {
        var pathDescription = this._createPathDescription()
        var strokeWidth = this.options.weight
        var stroke = this.options.color
        var strokeOpacity = this.options.opacity
        var fill = this.options.fillColor
        var fillOpacity = this.options.fillOpacity
        var className = this.options.className + "-path"

        return '<path class="' + className + '" d="' + pathDescription +
            '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
            '" fill="' + fill + '" fill-opacity="' + fillOpacity + '"/>'
    },
     _createShadow: function() {
         var pathDescription = this._createPathDescription()
         var strokeWidth = this.options.weight
         var stroke = this.options.shadowColor
         var fill = this.options.shadowColor
         var className = this.options.className + "-shadow"
 
         var origin = (this.options.iconSize.x / 2) + "px " + (this.options.iconSize.y) + "px"
         var rotation = this.options.shadowAngle
         var height = this.options.shadowLength
         var opacity = this.options.shadowOpacity
         var blur = this.options.shadowBlur
         var translate = this.options.shadowTranslate.x + "px, " + this.options.shadowTranslate.y + "px"
 
         var blurFilter = "<filter id='iconShadowBlur'><feGaussianBlur in='SourceGraphic' stdDeviation='" + blur + "'/></filter>"
 
         var shadow = '<path filter="url(#iconShadowBlur") class="' + className + '" d="' + pathDescription +
             '" fill="' + fill + '" stroke-width="' + strokeWidth + '" stroke="' + stroke +
             '" style="opacity: ' + opacity + '; ' + 'transform-origin: ' + origin +'; transform: rotate(' + rotation + 'deg) translate(' + translate + ') scale(1, '+ height +')' +
             '"/>'

         return blurFilter+shadow
     },
    _createSVG: function() {
        // var path = '<path stroke="url(#d)" id="svg_2" stroke-linecap="round" stroke-width="1.1" fill="url(#c)" d="m14.095833,1.55c-6.846875,0 -12.545833,5.691 -12.545833,11.866c0,2.778 1.629167,6.308 2.80625,8.746l9.69375,17.872l9.647916,-17.872c1.177083,-2.438 2.852083,-5.791 2.852083,-8.746c0,-6.175 -5.607291,-11.866 -12.454166,-11.866zm0,7.155c2.691667,0.017 4.873958,2.122 4.873958,4.71s-2.182292,4.663 -4.873958,4.679c-2.691667,-0.017 -4.873958,-2.09 -4.873958,-4.679c0,-2.588 2.182292,-4.693 4.873958,-4.71z"/>'
        // var circle = "<rect id=\"svg_1\" fill=\"#FFF\" width=\"12.625\" height=\"14.5\" x=\"411.279\" y=\"508.575\"/>"
        var path = this._createPath()
        var circle = this._createCircle()
        var text = this._createText()
        var shadow = this.options.shadowEnable ? this._createShadow() : ""
        var className = this.options.className + "-svg"
        var width = this.options.iconSize.x 
        var height = this.options.iconSize.y
             
        if (this.options.shadowEnable) {
            width += this.options.iconSize.y * this.options.shadowLength - (this.options.iconSize.x / 2)
            width = Math.max(width, 32)
            height += this.options.iconSize.y * this.options.shadowLength
        }        

        var style = "width:" + width + "px; height:" + height
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="' + className + '" style="' + style + '">' + shadow + path + circle + text + '</svg>'

        return svg
    },
    _createText: function() {
        var fontSize = this.options.fontSize + "px"
        var fontWeight = this.options.fontWeight
        var lineHeight = Number(this.options.fontSize)

        var x = this.options.circleAnchor.x
        var y = this.options.circleAnchor.y + (lineHeight * 0.35) //35% was found experimentally 
        var circleText = this.options.circleText
        var textColor = this.options.fontColor.replace("rgb(", "rgba(").replace(")", "," + this.options.fontOpacity + ")")

        var text = '<text text-anchor="middle" x="' + x + '" y="' + y + '" style="font-size: ' + fontSize + '; font-weight: ' + fontWeight +'" fill="' + textColor + '">' + circleText + '</text>'

        return text
    }
})

L.divIcon.svgIcon = function(options) {
    return new L.DivIcon.SVGIcon(options)
}

L.Marker.SVGMarker = L.Marker.extend({
    options: {
        "iconFactory": L.divIcon.svgIcon,
        "iconOptions": {}
    },
    initialize: function(latlng, options) {
        options = L.Util.setOptions(this, options)
        options.icon = options.iconFactory(options.iconOptions)
        this._latlng = latlng
    },
    onAdd: function(map) {
        L.Marker.prototype.onAdd.call(this, map)
    },
    setStyle: function(style) {
        if (this._icon) {
            var svg = this._icon.children[0]
            var iconBody = this._icon.children[0].children[0]
            var iconCircle = this._icon.children[0].children[1]

            if (style.color && !style.iconOptions) {
                var stroke = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.opacity+")")
                var fill = style.color.replace("rgb","rgba").replace(")", ","+this.options.icon.options.fillOpacity+")")
                iconBody.setAttribute("stroke", stroke)
                iconBody.setAttribute("fill", fill)
                iconCircle.setAttribute("stroke", stroke)

                this.options.icon.fillColor = fill
                this.options.icon.color = stroke
                this.options.icon.circleColor = stroke
            }
            if (style.opacity) {
                this.setOpacity(style.opacity)
            }
            if (style.iconOptions) {
                if (style.color) { style.iconOptions.color = style.color }
                var iconOptions = L.Util.setOptions(this.options.icon, style.iconOptions)
                this.setIcon(L.divIcon.svgIcon(iconOptions))
            }
        }
    }
})

L.marker.svgMarker = function(latlng, options) {
    return new L.Marker.SVGMarker(latlng, options)
}
