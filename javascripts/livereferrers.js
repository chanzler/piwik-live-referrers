/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

var settings = $.extend( {
	rowHeight			: 25,
});

var refreshReferrerNumber = function (id, newNumber, actNumber) {
	timeout = 50;
	if(actNumber < newNumber){
		if (newNumber-actNumber > 100) {
			timeout = 1;
		} else if (newNumber-actNumber > 10) {
			timeout = 10;
		}
		actNumber++;
	} else if(actNumber > newNumber){
		if (actNumber-newNumber > 100) {
			timeout = 1;
		} else if (actNumber-newNumber > 10) {
			timeout = 10;
		}
		actNumber--;
	}
	$('#LiveReferrersChart').find("div[id="+id+"]").children('.number').text(actNumber);
	// schedule counter
    if (actNumber != newNumber){
    	setTimeout(function () { refreshNumber(id, newNumber, actNumber); }, timeout);
    }
}

/**
 * jQueryUI widget for Live visitors widget
 */
$(function() {
    var refreshLiveReferrersWidget = function (element, refreshAfterXSecs) {
        // if the widget has been removed from the DOM, abort
        if ($(element).parent().length == 0) {
            return;
        }
        var ajaxRequest = new ajaxHelper();
        ajaxRequest.addParams({
            module: 'API',
            method: 'LiveReferrers.getLiveReferrers',
            format: 'json',
            lastMinutes: 20
        }, 'get');
        ajaxRequest.setFormat('json');
        ajaxRequest.setCallback(function (data) {
        	$('#LiveReferrersChart .red').addClass("delete");
        	$.each( data, function( index, value ){
            	if ( $('#LiveReferrersChart').find("div[id="+value['idvisit']+"]").length ) {
            		$('#LiveReferrersChart').find("div[id="+value['idvisit']+"]").removeClass('delete');
            		refreshReferrerNumber(value['idvisit'], value['value'], $('#LiveReferrersChart').find("div[id="+value['idvisit']+"]").children('.number').text());
            		//$('#LiveReferrersChart').find("div[id="+value['idvisit']+"]").children('.number').html(value['value']);
            		$('#LiveReferrersChart').find("div[id="+value['idvisit']+"]").attr("index", index);
            	} else {
                	$( "#LiveReferrersChart" ).append( "<div title=\"\" index=\""+index+"\" class=\"red\"><span class=\"title\"></span><span class=\"bar\"></span><span class=\"number\"></span></div>" );
            		$('#LiveReferrersChart').find("div[index="+index+"]").attr("id", value['idvisit']);
            		$('#LiveReferrersChart').find("div[index="+index+"]").children('.number').html(value['value']);
            		$('#LiveReferrersChart').find("div[index="+index+"]").children('.title').text(value['name']);
            	}
        	});
            $( ".delete").remove();

            $("#LiveReferrersChart").find('div').each(function() {
				$(this).height(settings['rowHeight']);
			});

			// Set table height and width
            $("#LiveReferrersChart").height((data.length*settings['rowHeight']));

			//animation
			var vertical_offset = 0; // Beginning distance of rows from the table body in pixels
			for ( index = 0; index < data.length; index++) {
				$("#LiveReferrersChart").find("div[index="+index+"]").stop().delay(1 * index).animate({ top: vertical_offset}, 1000, 'swing').appendTo("#LiveReferrersChart");
				vertical_offset += settings['rowHeight'];
			}
            // schedule another request
            setTimeout(function () { refreshLiveReferrersWidget(element, refreshAfterXSecs); }, refreshAfterXSecs * 1000);
        });
        ajaxRequest.send(true);
    };

    var exports = require("piwik/LiveReferrers");
    exports.initSimpleRealtimeLiveReferrersWidget = function (refreshInterval) {
        var ajaxRequest = new ajaxHelper();
        ajaxRequest.addParams({
            module: 'API',
            method: 'LiveReferrers.getLiveReferrers',
            format: 'json',
            lastMinutes: 20
        }, 'get');
        ajaxRequest.setFormat('json');
        ajaxRequest.setCallback(function (data) {
            $('#LiveReferrersChart').each(function() {
                // Set table height and width
    			$("#LiveReferrersChart").height((data.length*settings['rowHeight']));

    			for (j=0; j<data.length; j++){
                	$("#LiveReferrersChart").find("div[index="+j+"]").css({ top: (j*settings['rowHeight']) }).appendTo("#LiveReferrersChart");
                }
            });
            i = 0;
        	$.each( data, function( index, value ){
            	$( "#LiveReferrersChart" ).append( "<div title=\"\" index=\""+i+"\" class=\"red\"><span class=\"title\"></span><span class=\"bar\"></span><span class=\"number\"></span></div>" );
        		$('#LiveReferrersChart').find("div[index="+index+"]").attr("id", value['idvisit']);
        		$('#LiveReferrersChart').find("div[index="+index+"]").children('.number').html(value['value']);
        		$('#LiveReferrersChart').find("div[index="+index+"]").children('.title').text(value['name']);
        		i++;
        	});
			$("#LiveReferrersChart").find('div').each(function() {
				$(this).height(settings['rowHeight']);
			});
            for (j=0; j<i; j++){
            	$("#LiveReferrersChart").find("div[index="+j+"]").css({ top: j*settings['rowHeight'] }).appendTo(".tpbv table");
            }

            $('#LiveReferrersChart').each(function() {
    			var $this = $(this),
                   refreshAfterXSecs = refreshInterval;
                setTimeout(function() { refreshLiveReferrersWidget($this, refreshAfterXSecs ); }, refreshAfterXSecs * 1000);
            });
        });
        ajaxRequest.send(true);
     };
});

