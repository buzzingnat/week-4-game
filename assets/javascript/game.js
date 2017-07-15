/* main game function */
var fightingRPG = (function () {
    var public = {};

    function createCanvases(){
        $(".imgContainer").each(function(index) {
            var $animation = $(this).find("img");
            var h = $animation.height();
            var w = $animation.width();

            var className = $(this).find("img").attr("class");
            $(this).append(
                `<canvas class="imgCanvas ${className}" width="${w}" height="${h}">`
            );
        });
    }

    /* display start screen */
    $().ready(function() {
        $(".warriorContainer").removeClass("battlePos");
        $(".warriorContainer").addClass("startPos");
    });

    /* display vs screen */
    $(".warriorContainer").on("click", function() {
        // if first click on a warriorContainer, then clicked warrior becomes hero
        // and all other warriors become monster
        if ( $(".warriorContainer").hasClass("startPos") ) {
            $(this).addClass("hero");
            var monsterCount = 0;
            $(".warriorContainer").each( function(index){
                if (!($(this).hasClass("hero")) ) {
                    if (monsterCount === 0) {
                        $(this).hasClass("hero") ? null : $(this).addClass("firstMonster");
                    }
                    $(this).hasClass("hero") ? null : $(this).addClass("monster");
                    monsterCount++;
                }
            });
        }
        $(".warriorContainer").removeClass("startPos");
        $(".warriorContainer").addClass("battlePos");
        // only build a canvas if none exist
        $(this).find("canvas")[0] ? null : createCanvases();
        // freeze the gif
        $(".warriorContainer").each(function() {
            var $imgElement = $(this).find("img");
            var $canvasElement = $(this).find("canvas");
            $canvasElement.css("opacity", "1");
            $imgElement.css("display", "none");
            // find the correct canvas on the page
            var canvas = $canvasElement[0];
            var context = canvas.getContext("2d");

            var h = $imgElement[0].naturalHeight;
            var w = $imgElement[0].naturalWidth;

            context.drawImage($imgElement[0], 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        });
    });

    /* display fighting screen */
    $(".monster").on("click", function() {
        $(this).addClass("defend");
    });

    /* display win screen */

    /* display lose screen */

    /* reload start screen on game end */

    return public;
})();
