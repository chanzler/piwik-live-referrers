/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

var settings = $.extend( {
	rowHeight			: 25,
});
var history = [];

/**
 * jQueryUI widget for Live visitors widget
 */
$(function() {
    var refreshLiveReferrersWidget = function (element, refreshAfterXSecs) {
        // if the widget has been removed from the DOM, abort
        if ($(element).parent().length == 0) {
            return;
        }
        var lastMinutes = $(element).find('.dynameter').attr('data-last-minutes') || 30;

        var ajaxRequest = new ajaxHelper();
        ajaxRequest.addParams({
            module: 'API',
            method: 'LiveReferrers.getLiveReferrers',
            format: 'json',
            lastMinutes: lastMinutes
        }, 'get');
        ajaxRequest.setFormat('json');
        ajaxRequest.setCallback(function (data) {
        	data.sort(function(a, b){
        	    return b.value - a.value;
        	});
        	$.each( data, function( index, value ){
              	//var pc = value['value'];
        		//pc = pc > 100 ? 100 : pc;
        		$('#LiveReferrersChart').find("div[id="+value['id']+"]").children('.number').html(value['value']);
        		//var ww = $('#LiveReferrersChart').find("div[id="+value['id']+"]").width();
        		//var len = parseInt(ww, 10) * parseInt(pc, 10) / 100;
        		//$('#LiveReferrersChart').find("div[id="+value['id']+"]").children('.bar').animate({ 'width' : len+'px' }, 1500);
        		$('#LiveReferrersChart').find("div[id="+value['id']+"]").attr("index", index);

        	});
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
            lastMinutes: 30
        }, 'get');
        ajaxRequest.setFormat('json');
        ajaxRequest.setCallback(function (data) {
        	data.sort(function(a, b){
        	    return b.value - a.value;
        	});
            $('#LiveReferrersChart').each(function() {
                // Set table height and width
    			$("#LiveReferrersChart").height((data.length*settings['rowHeight']));

    			for (j=0; j<data.length; j++){
                	$("#LiveReferrersChart").find("div[index="+j+"]").css({ top: (j*settings['rowHeight']) }).appendTo("#LiveReferrersChart");
                }
            });
        	$.each( data, function( index, value ){
               	//var pc = value['value'];
        		//pc = pc > 100 ? 100 : pc;
        		$('#LiveReferrersChart').find("div[index="+index+"]").attr("id", value['id']);
        		$('#LiveReferrersChart').find("div[index="+index+"]").children('.number').html(value['value']);
        		$('#LiveReferrersChart').find("div[index="+index+"]").children('.title').text(value['name']);
        		//var ww = $('#LiveReferrersChart').find("div[index="+index+"]").width();
        		//var len = parseInt(ww, 10) * parseInt(pc, 10) / 100;
        		//$('#LiveReferrersChart').find("div[index="+index+"]").children('.bar').animate({ 'width' : len+'px' }, 1500);
        	});
            $('#LiveReferrersChart').each(function() {
    			var $this = $(this),
                   refreshAfterXSecs = refreshInterval;
                setTimeout(function() { refreshLiveReferrersWidget($this, refreshAfterXSecs ); }, refreshAfterXSecs * 1000);
            });
        });
        ajaxRequest.send(true);
     };
});

