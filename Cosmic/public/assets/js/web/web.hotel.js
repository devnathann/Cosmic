function WebHotelManagerInterface()
{
    this.hotel_container = null;
    this.current_page_url = null;
    /*
    * Manager initialization
    * */
    this.init = function ()
    {
        this.current_page_url = window.location.pathname.substr(1) + window.location.search;
      
        this.hotel_container = $("#hotel-container");
        
        this.hotel_container.find(".client-buttons .client-close").click(this.close_hotel);
        this.hotel_container.find(".client-buttons .client-fullscreen").click(this.toggle_fullscreen.bind(this));
        this.hotel_container.find(".client-buttons .client-count").click(this.refresh_count);
        this.hotel_container.find(".client-buttons .client-radio").click(this.radio(this));

        setInterval(function() {
            $("body").find(".client-buttons .client-count #count").load("/api/online");
        }, 120000);
    };

    /*
    * Hotel toggle
    * */
    this.close_hotel = function ()
    {
        Web.pages_manager.load(Web.pages_manager.last_page_url, null, true, null, true);
    };

    this.refresh_count = function ()
    {
        $("body").find(".client-buttons .client-count #count").load("/api/online");
    };

    this.open_hotel = function (arguments)
    {
        var actions = {};
        var container = this.hotel_container;
        var container_actions = this.hotel_actions;
        
        if (arguments !== undefined) {
            parse_str(arguments, actions);
        }

        var body = $("body");
  
        body.find(".header-container .header-content .account-container .account-buttons .hotel-button").text(Locale.web_hotel_backto);

        if (!body.hasClass("hotel-visible"))
        {
            Web.ajax_manager.get("/api/vote", function(result) {

                if(result.krews_list !== undefined && result.krews_list.status == 0) 
                {
                    container.prepend('<iframe class="client-frame" src="' + result.krews_api + '"></iframe>');
                    body.addClass("hotel-visible");
                    body.find(".client-buttons").hide();
                    
                    History.pushState(null, Site.name + '- Krews Vote', 'hotel');
                } 
                else 
                {
                  if (container.find(".client-frame").length === 0)
              
                      container.prepend('<iframe class="client-frame" src="/client"></iframe>');

                      body.addClass("hotel-visible");

                      var radio = document.getElementById("stream");
                      radio.src = Client.client_radio;
                      radio.volume = 0.1;
                      radio.play();

                      $(".fa-play").hide();
                      $(".fa-pause").show();
                  }
            });
        }
    };

    /*
    * LeetFM Player
    * */
    this.radio = function () {

        var radio = document.getElementById("stream");

        this.hotel_container.find(".client-buttons .client-radio .fa-play").click( function() {
            radio.src = Client.client_radio;
            radio.volume = 0.1;
            radio.play();

            $(".fa-play").hide();
            $(".fa-pause").show();
        });

        this.hotel_container.find(".client-buttons .client-radio .fa-pause").click( function() {

            radio.pause();
            radio.src = "";
            radio.load();

            $(".fa-play").show();
            $(".fa-pause").hide();
        });

        this.hotel_container.find(".client-buttons .client-radio .fa-volume-up").click( function() {
            var volume = radio.volume;

            if(volume > 1.0) {
                radio.volume += 0.0;
            } else {
                radio.volume += 0.1;
            }
        });

        this.hotel_container.find(".client-buttons .client-radio .fa-volume-down").click( function() {
            var volume = radio.volume;

            if(volume < 0.0) {
                radio.volume -= 0.0;
            } else {
                radio.volume -= 0.1;
            }
        });
    };

    /*
    * Fullscreen toggle
    * */
    this.toggle_fullscreen = function ()
    {
        if ((document.fullScreenElement && document.fullScreenElement) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }

            this.hotel_container.find(".client-buttons .client-fullscreen .client-fullscreen-icon").addClass("hidden");
            this.hotel_container.find(".client-buttons .client-fullscreen .client-fullscreen-icon-back").removeClass("hidden");
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            this.hotel_container.find(".client-buttons .client-fullscreen .client-fullscreen-icon").removeClass("hidden");
            this.hotel_container.find(".client-buttons .client-fullscreen .client-fullscreen-icon-back").addClass("hidden");
        }
    };
}