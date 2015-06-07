$container = $('#container')
$loading = $('#loading')

$(window).load ->
    wall_of_posts = $container.masonry
                        itemSelector: '.brick'
                        transitionDuration: 0
                        gutter: 1

$ ->
    $container.infinitescroll
        navSelector: 'nav'
        nextSelector: 'nav ul li a#next'
        itemSelector: '#container .item'
        bufferPx: 300

        (older_posts) ->
            posts = $(older_posts).css {opacity:0}
            posts.imagesLoaded ->
                $container.masonry('appended', posts, true)

# References
# http://4loc.wordpress.com/2009/04/28/documentready-vs-windowload/
# https://github.com/infinite-scroll/infinite-scroll