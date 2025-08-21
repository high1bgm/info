/* 
	Author: http://codecanyon.net/user/sike
*/      

;(function($){                             
	$.fn.extend({
		productShowcase: function(options) {

	      	// plugin default options, it's extendable
			var settings = { 
				containerClass: 'wrapContainer', 
				initShow: false,    
				initZoomEffect: true,
				showCloseButton: true,
				closeButtonClass: 'right',
				showArrow: true, 
				arrowAutoHiden: true
			}; 
			
  			// extends settings with options provided
	        if (options) {
				$.extend(settings, options);
			} 
			
			var _this = this;           
			_this.wrap('<div class="' + settings.containerClass + '"/>');  	 
			var parent = _this.parent();   
			
			parent.hide();
			
			var mainSlider = $('.bigImages', _this);             			
			var subSlider = $('.thumbnails', _this);             				
			var mainSlideNum = $('.bigImages ul li', _this).size();		   			   
			var subSlideNum = $('.thumbnails ul li', _this).size();		                        
			var maxSlideNum = Math.max(mainSlideNum, subSlideNum);   			   				
			var mainSliderArr = [];
			var subSlideArr = []; 
			
			var currentSlideNum = -1;		
			var _vidFrameArr = [];				

			// _this.css('overflow', 'hidden');      

			// the public function, trigger of the popover
			_this.popover = function(){
				if(_vidFrameArr[currentSlideNum]){
					mainSliderArr[currentSlideNum].find('div').append(_vidFrameArr[currentSlideNum]);									
				}
  				if(Modernizr.csstransitions){			
					_this.show();
					parent.show();                                 
					parent.removeClass('pulseHide pulse animated2').addClass('animated pulse');                     			
				}else{                                    
					// just fade in if the browser doesn't support CSS3	
					_this.fadeIn('slow');
					parent.fadeIn('slow');				
				}                           
			}
			
			
			return this.each(function() {
				
			   	mainSlider.find('ul li').each(function(index) {              
					mainSliderArr[index] = $(this);       
					if(index!=0) $(this).hide();	   
					$(this).css('opacity', 0);
				});	

   				subSlider.find('ul li').each(function(index) { 
					subSlideArr[index] = $(this);
					$(this).css('cursor', 'pointer');
					$(this).attr('rel', index);
					$(this).bind('click', function(event){        			  
		                if($(this).hasClass('active')) return false;   
						var _n = $(this).attr('rel'); 	
						tweenToSlide(_n);
		            });	                           					
				});								
				          
				 
				var arrowButton, closeButton; 
								  
				if(settings.showCloseButton){
					/*
					if(settings.closeButtonClass.toLowerCase()=="right")closeButton = $('<div class="closeButton"></div>');
					else closeButton = $('<div class="closeButton closeButtonLeft"></div>');
					*/                                                                      
					closeButton = $('<div class="' + settings.closeButtonClass + ' closeButton"></div>');					
					parent.append(closeButton);
					closeButton.css('cursor', 'pointer'); 
		            closeButton.bind('click', function(event) {
						if(Modernizr.csstransitions){					
							parent.removeClass('pulseHide pulse animated').addClass('pulseHide animated2');                     						
						}else{
							parent.fadeOut('slow');
						}
						setTimeout(function(){
							parent.hide();	
						}, 500);
						
						if(_vidFrameArr[currentSlideNum]){
							mainSliderArr[currentSlideNum].find('iframe').remove();
						}
						

		            });     		
				}
	

		        // add the previous/next arrow buttons
				if(settings.showArrow){
					arrowButton = $('<div class="arrowButton"><div class="prevArrow"></div><div class="nextArrow"></div></div>');
					_this.append(arrowButton);
		            var _next = $('.nextArrow', arrowButton).bind('click', function(event) {
						nextBanner();
		            });
		            var _prev = $('.prevArrow', arrowButton).bind('click', function(event) {
						prevBanner();
		            });

				} 

				function nextBanner(){
					var n = currentSlideNum;
					n++;       
					if(n>maxSlideNum-1) n = 0;                             
					tweenToSlide(n);                                   					
				}  
				
				function prevBanner(){
					var n = currentSlideNum;
					n--;       
					if(n<0) n = maxSlideNum-1;
					tweenToSlide(n);
					
				}     

				function tweenToSlide(n){    	
					var _n  = currentSlideNum; 
					mainSliderArr[n].show().animate({opacity: 1}, 250);
					if(_vidFrameArr[n]){
						mainSliderArr[n].find('div').append(_vidFrameArr[n]);
					}else{
						if(mainSliderArr[n].find('iframe')){
							_vidFrameArr[n] = mainSliderArr[n].find('iframe');
						}						
					}

					if(mainSliderArr[_n]){   														   	 						
						mainSliderArr[_n].animate({opacity: 0}, 400, function(){
							mainSliderArr[_n].hide();							
							if(mainSliderArr[_n].find('iframe')){
								_vidFrameArr[_n] = mainSliderArr[_n].find('iframe');
								mainSliderArr[_n].find('iframe').remove();								
							}
						})
					}                                                     
					if(subSlideArr[_n]) subSlideArr[_n].removeClass('active');
					subSlideArr[n].addClass('active');					
					currentSlideNum = n;
					
				}      
				
				tweenToSlide(0); 
				
				function showSlider(){
					if(Modernizr.csstransitions){
						if(settings.initZoomEffect){
							_this.show();        
							parent.show();                         							
							parent.removeClass('pulseHide pulse animated2').addClass('animated pulse');                     										
						}else{
							_this.fadeIn('slow');
							parent.fadeIn('slow');							
						}
					}else{
						_this.fadeIn('slow');
						parent.fadeIn('slow');
					}
					
				}
				
				if(settings.initShow) showSlider();
				
				// keyboard navigation support
				/*
        		$(document).keydown(function(event) {
					if (event.keyCode != 39 && event.keyCode != 37){
					  return;
					} else {
					  if (event.keyCode == 39) {
					    nextBanner();
					  } else if (event.keyCode == 37){
						prevBanner();
					  }        
					}
		        });
				*/				
				
				parent.mouseover(function (event){ 
					if(arrowButton)arrowButton.fadeIn(); 				
				});           
		
				parent.mouseleave(function (event){
					if(arrowButton)arrowButton.fadeOut();
				});   
				
				_this.touchwipe({
				     wipeLeft: nextBanner,
				     wipeRight: prevBanner,
				     preventDefaultEvents: true
				});				
			});    
			
		}

	});
		
})(jQuery);