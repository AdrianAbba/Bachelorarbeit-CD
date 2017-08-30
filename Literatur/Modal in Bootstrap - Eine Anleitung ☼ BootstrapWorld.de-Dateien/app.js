$(function () {

    size();

    $(window).resize(function () {
        size();
    });


    function size() {
        width = $(window).width();

        //Smartphone
        if (width < 768) {
            $('#navbar').addClass('collapse');
            $('.nav-link').removeClass('hidden');
        } else {
            $('#navbar').removeClass('collapse');
            $('.nav-link').addClass('hidden');
        }
    }

    $('.nav-link').click(function () {
        $('#navbar').addClass('in');
    });

    /* Button: Nach oben scrollen */
    /*
     var offset = 220;
     var duration = 500;
     $(window).scroll(function () {
     if ($(this).scrollTop() > offset) {
     $('.back-to-top').fadeIn(duration);
     } else {
     $('.back-to-top').fadeOut(duration);
     }
     });
     */
    /* HelpBox-Button */
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#help-box-button').fadeIn();
        } else {
            $('#help-box-button').fadeOut();
        }
    });

    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, duration);
        return false;
    });

    /* Frage stellen */
    $('#comments-form').submit(function () {
        $.post($(this).attr('action'), $(this).serialize(), function (json) {
            if (json.state === 1) {
                $('#comments-form input.form-control').val('');
                $('#comments-message').removeClass('alert-danger').addClass('alert alert-success').html(json.message).show();
            } else {
                $('#comments-message').addClass('alert alert-danger').html(json.message).show();
            }
        }, 'json');
        return false;
    });

    /* HelpBox*/
    $('.help-box-input').keyup(function () {
        var input1 = $('.help-box-input[name=message]').val();
        var input2 = $('.help-box-input[name=name]').val();
        var input3 = $('.help-box-input[name=email]').val();
        var ok = (input1 && input2 && input3) ? true : false;

        //Button (de)aktivieren
        $('#help-box-submit').prop('disabled', !ok);
    });

});