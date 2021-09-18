var mymap = L.map('mapid').setView([48.3975, 35.027798], 16);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);


function onMapClick(e) {
    componentDidMount(e)
}


window.addEventListener('load', () => {
    let obj = {}

    if (localStorage.getItem('markers') !== null) {
        obj = JSON.parse(localStorage.getItem('markers'))
        mark = JSON.parse(localStorage.getItem('markers'))

        Object.values(obj).forEach(val => {
            colorRGB = val.color_marker
            let marker = new L.Marker.SVGMarker([val.lat, val.lng],
                {iconOptions: {color: colorRGB}, customId: 100})
            marker['number_of_marker'] = val.number_of_marker
            marker['color_marker'] = val.color_marker
            marker.addTo(mymap)


            localStorage.setItem('markers', JSON.stringify(mark))
            n = val.number_of_marker + 1

        });
    } else {
        n = 1
    }
    let obj2 = {}
    if (localStorage.getItem('dataOfDashbord') !== null) {
        obj2 = JSON.parse(localStorage.getItem('dataOfDashbord'))

        Object.values(obj2).forEach(val => {
            setCreatedTask(val.dateStr, val.color, val.INeed, val.numberMarker, true)
        });
    }

});


function componentDidMount(e) {

    const map = mymap;
    const geocoder = L.Control.Geocoder.nominatim()


    geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), results => {
        var r = results[0]


        if (r) {

            let colorRGB = $('#change_color_marker').val()

            let marker = new L.Marker.SVGMarker([e.latlng['lat'], e.latlng['lng']], {
                iconOptions: {color: colorRGB},
                draggable: true
            })

            marker.bindPopup(r.name)
                .addTo(map)

                .openPopup();

            $('.address').html(`My address is ${r.name}`)
            $('.loc').html(`My address is ${r.name}`)


            marker.addEventListener('mouseup', () => {
                changeAddress(marker)
            });

            marker.on('contextmenu', (e) => {
                delMarker(e, marker)
            });

            marker['number_of_marker'] = n
            marker['color_marker'] = colorRGB


            n++
        }
    })
}

function delMarker(event, marker) {
    let btnDelete = document.createElement('span')
    btnDelete.textContent = 'Удалить маркер';
    btnDelete.classList = 'context-menu'

    marker.bindPopup(btnDelete)
        .addTo(mymap)
        .openPopup();
    btnDelete.addEventListener('click', () => {
        mymap.removeLayer(marker)

        var returnObj = JSON.parse(localStorage.getItem("markers"))
        delete returnObj[`marker_#${marker['number_of_marker']}`]
        localStorage.setItem('markers', JSON.stringify(returnObj))

        btnDeleteclassList = 'context-menu'

        if (localStorage.getItem('markers') === "{}") {
            localStorage.removeItem('markers')
        }
    })
}


function changeAddress(marker) {
    const geocoder = L.Control.Geocoder.nominatim();
    const map = mymap;


    latlng = {
        lat: Object.values(marker._latlng)[0],
        lng: Object.values(marker._latlng)[1]
    }

    geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), results => {
        var r = results[0];


        if ($('.dashboard').css('display') !== 'none') {
            $('.address').html(`My address is ${r.name}`)
            $('.loc').html(`My address is ${r.name}`)
        }
    })
}


const arrayTask = {
    electrician: ['Repair electrical systems', 'Install electrical systems', 'Fix a fuse', 'Install an electrical panel',
        'Install the socket ', 'Install a chandeliers'],
    plumber: ['Unblock a toilet', 'Unblock a sink', 'Fix a water leak', 'Install a sink', 'Install a shower',
        'Install a toilet'],
    gardener: ['Plant trees', 'Flower bed care', 'Mow the lawn', 'Weed the lawn', 'Cut curly forms of shrubs ',
        'Treatment of trees from pests and diseases'],
    housekeeper: ['Clean room', 'Wash and ironing of things', 'Tidy up the wardrobe', 'Shop grocery',
        'Childcare'],
    cook: ['Cook food', 'Prepare gourmet meals', 'Cooking for a banquet', 'Wedding cooking',
        'Birthday cooking']
}

$(document).ready(function () {
    $('#new_task').click(() => {
        if ($('.dashboard').css('display') === 'none') {
            $('.dashboard').css('display', 'flex').animate({'right': '-8px'}, 1000);
            mymap.once('click', onMapClick);
            dashboardSetButton(true)
        }

    });
   })


function dashboardSetButton(isNewTask, numberMarker = null) {

    $('.service_type input').click(e => setServiceType(e.target.value));

    $('.task_description input').keyup((e) => {
        $('#descr_span').html(e.target.value)
    }).keydown(event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            return false;
        }
    });

    $('#create_task').click((e) => {

        let date = new Date(Date.parse($('#date').val()));

        let dateStr = dataToStr(date)

        if ($('.loc').html() === '') {
            alert('Please, set address')
        } else if ($('.service_type input[name="service_type"]:checked').val() === undefined) {
            alert('Please, choose service type')
        } else if ($('.task_of_type input[name="type_of_doing"]:checked').val() === undefined) {
            alert('Please, choose task')
        } else if ($('.task_description input').val() === '') {
            alert('Please, write description')
        } else if ($('#date').val() === '') {
            alert('Please, set date')
        } else {
            colorRGB = $('#change_color_marker').val()


            newtask = $('#create_task').html() === 'create task' ? true : false;
            setCreatedTask(dateStr, colorRGB, ($('#fulltask').text().split(',')[0]),
                n - 1, newtask, numberMarker)


            dataOfDashbord = addDescriptionToStorage(isNewTask, numberMarker, dateStr)

            markers = addMarkerToStorage(isNewTask, numberMarker)

            let ob = {
                markers,
                dataOfDashbord
            }

            let xhttp = new XMLHttpRequest();
            xhttp.open('POST', 'http://localhost:3333/receive', true)
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(ob))


            $('.service_type input').unbind('click');
            $('.task_description input').unbind('keyup')
            $('#create_task').unbind('click');
            $('#change_color_marker').unbind('change')


        }
    })

    $('#change_color_marker').change((e) => {

        if (isNewTask) {
            old_marker = Object.entries(mymap._targets)[Object.entries(mymap._targets)
                ['length'] - 1][1]
        } else {
            let objMarker = {}
            Object.entries(mymap._targets).forEach((e) => {

                if (e[1].number_of_marker == numberMarker) {
                    objMarker = e[1]
                    old_marker = objMarker
                }
            })
        }


        if ($('.address').html() !== 'My address is') {


            latlng = Object.values(old_marker._latlng)
            mymap.removeLayer(old_marker)

            color = e.target.value

            let marker = new L.Marker.SVGMarker([latlng[0], latlng[1]],
                {iconOptions: {color: color}, draggable: true})

            marker.addTo(mymap)


            marker['number_of_marker'] = old_marker.number_of_marker
            marker['color_marker'] = color
        }
    });


}

function setServiceType(typeService, id = null) {

    let aAn;

    if (typeService === 'electrician') {
        aAn = 'an'
    } else {
        aAn = 'a'
    }

    let arrType = arrayTask[typeService]


    $('.task_of_type span').html(typeService)
    let ul = $('.task_of_type ul')
    ul.html('')

    arrType.forEach((item, index) => {
        idGorInput = `select${index + 1}`
        check = idGorInput === id
        li = $("<li>");
        jQuery('<input>', {
            id: idGorInput,
            value: item,
            'type': 'radio',
            'name': "type_of_doing",
            'checked': check
        }).appendTo(li);

        jQuery('<label/>', {
            htmlFor: `select${index + 1}`,
            text: item

        }).appendTo(li);
        ul.append(li)
    })

    $('.task_of_type input').click(function (e) {
        $('#task_of_service').html(`${e.target.value.toLowerCase()},`)
    })

    let val = `${aAn} ${typeService}`
    $('#needed_service').html(val)

}

function dataToStr(d) {
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: 'numeric',
        hour12: false,
        timezone: 'UTC'
    }
    return d.toLocaleString("en-US", options)
}

function setCreatedTask(data, color, textP, num, isNewTask, numberMarker = null) {

    if (isNewTask) {
        $('#created-task').append(
            $("<li/>").addClass('rectangle-white')
                .append($("<span/>").html(data))
                .append($("<span/>").addClass('color_square').css({'background': color}))
                .append($("<p/>").html(textP))
                .append($("<div/>")
                    .append($("<button/>").html('edit').val(num).addClass('edit_btn').click(e => {

                        let numMarker = e.target.value
                        let objMarker = {}
                        Object.entries(mymap._targets).forEach((e) => {
                            if (e[1].number_of_marker == numMarker) {
                                objMarker = e[1]
                            }

                        })
                        objMarker.dragging.enable()
                        objMarker.addEventListener('mouseup', () => {
                            changeAddress(objMarker)
                        })
                        $('.dashboard').css('display', 'flex').animate({'right': '-8px'}, 1000)
                        $('#create_task').html('Save task')
                        dashboardSetButton(false, numMarker)

                        let dataOfDashbord = JSON.parse(localStorage.getItem("dataOfDashbord"))[`number_#${numMarker}`]
                        $('.loc').html(dataOfDashbord.address)
                        $('.address').html(dataOfDashbord.address)
                        $(`.service_type input[value = ${dataOfDashbord.service_type}]`).attr("checked", true);
                        setTimeout(() => $('#date').val(dataOfDashbord.date), 0)

                        setServiceType(dataOfDashbord.service_type, dataOfDashbord.task_of_type)
                        $('.task_description input').val(dataOfDashbord.description)
                        $('#task_of_service').html(dataOfDashbord.task_of_service)
                        $('#descr_span').html(dataOfDashbord.description)
                        $('#change_color_marker').val(dataOfDashbord.color)
                    }))
                    .append($("<button/>").html('delete').val(num).addClass('delete_btn').click(function (e) {
                        let numMarker = e.target.value
                        $(this).parent().parent().remove()


                        let objMarker = {}
                        Object.entries(mymap._targets).forEach((e) => {
                            if (e[1].number_of_marker == numMarker) {
                                objMarker = e[1]
                            }

                        })
                        mymap.removeLayer(objMarker)
                        let returnObj = JSON.parse(localStorage.getItem('markers'))
                        returnObj[`marker_#${numMarker}`] = undefined
                        localStorage.setItem('markers', JSON.stringify(returnObj))

                        let returnObjDataOfDashbord = JSON.parse(localStorage.getItem('dataOfDashbord'))
                        returnObjDataOfDashbord[`number_#${numMarker}`] = undefined
                        localStorage.setItem('dataOfDashbord', JSON.stringify(returnObjDataOfDashbord))
                        if (localStorage.getItem('markers') === "{}") {
                            localStorage.removeItem('markers')
                            localStorage.removeItem('dataOfDashbord')
                        }

                        let xhttp = new XMLHttpRequest();
                        xhttp.open('DELETE', 'http://localhost:3333/receive', true)
                        xhttp.setRequestHeader("Content-Type", "text/plain");
                        xhttp.send(numMarker)

                    }))
                )
        )
    } else {

        li = `#created-task li:nth-child(${numberMarker})`


        $(`${li} span:first-child`).html(data)
        $(`${li} span.color_square`).css({'background': color})
        $(`${li} p`).html(textP)
    }

}


function addDescriptionToStorage(isNewTask, numberMarker, dateStr) {
    let dataOfDashbord = {}
    let num = isNewTask ? (n - 1) : numberMarker
    dataOfDashbord[`number_#${num}`] = {
        'address': $('.address').html(),
        'service_type': $('.service_type input[name="service_type"]:checked').val(),
        'color': $('#change_color_marker').val(),
        'task_of_type': $('.task_of_type  input[name="type_of_doing"]:checked').attr('id'),
        'description': $('.task_description input').val(),
        'date': $('#date').val(),
        'dateStr': dateStr,
        'INeed': ($('#fulltask').text().split(',')[0]),
        'task_of_service': $('#task_of_service').html(),
        'numberMarker': num
    }
    if (localStorage.getItem('dataOfDashbord') === null) {
        localStorage.setItem('dataOfDashbord', JSON.stringify(dataOfDashbord))
    }
    let returnObj = JSON.parse(localStorage.getItem("dataOfDashbord"))
    Object.assign(returnObj, dataOfDashbord);
    localStorage.setItem('dataOfDashbord', JSON.stringify(returnObj))


    $.when($('.dashboard').animate({'right': '-500px'}, 1000, function () {
        $('.dashboard').css('display', 'none')
        $('.service_type input[name="service_type"]:checked').attr('checked', false)
        $('.address').html(`My address is`)
        $('#change_color_marker').val('#000064')
        $('.loc').html(`My address is`)
        $('.task_of_type ul').empty()
        $('.task_of_type .title_task_span').empty()
        $('.task_description input').val('')
        $('#fulltask span').html('')
        // $('#date').val() === ''
        $('#create_task').html('create task')
    }))

    return dataOfDashbord
}


function addMarkerToStorage(isNewTask, numberMarker) {
    if (isNewTask) {
        marker = Object.entries(mymap._targets)[Object.entries(mymap._targets)
            ['length'] - 1][1]
    } else {
        let objMarker = {}
        Object.entries(mymap._targets).forEach((e) => {

            if (e[1].number_of_marker == numberMarker) {
                objMarker = e[1]
                marker = objMarker
            }
        })
    }

    let mark = {};

    latlng = Object.values(marker._latlng)
    mark[`marker_#${marker.number_of_marker}`] = {
        'lat': latlng[0],
        'lng': latlng[1],

        'number_of_marker': marker.number_of_marker,
        'color_marker': marker.color_marker
    }
    if (localStorage.getItem('markers') === null) {
        localStorage.setItem('markers', JSON.stringify(mark))
    }

    let returnObj = JSON.parse(localStorage.getItem("markers"))
    Object.assign(returnObj, mark);
    localStorage.setItem('markers', JSON.stringify(returnObj))

    marker.dragging.disable()

    return mark

}
