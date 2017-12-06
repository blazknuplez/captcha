$(function() {
    var smer = 1;

    var gif = new SuperGif({
        gif: document.getElementById('captcha'),
        loop_mode: 'auto',
        auto_play: false,
        draw_while_loading: false,
        show_progress_bar: true,
        progressbar_height: 10,
        progressbar_foreground_color: 'rgba(0, 255, 4, 0.1)',
        progressbar_background_color: 'rgba(255,255,255,0.8)'

    });


    gif.load(function(){
        //document.getElementById("controller-bar").style.visibility = 'visible';
        loaded = true;
        setInterval(function(){
            gif.move_relative(smer);
            if(gif.get_current_frame() == 0){
                smer = 1;
            }else if(gif.get_current_frame() == 99){
                smer = -1;
            }
            console.log(gif.get_current_frame() + " " + smer);
        }, 1000/30);
    });
});

