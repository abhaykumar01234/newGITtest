var idleTime = 0;

$(document).ready(function () {

    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 1000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

    $('[data-toggle="popover_info"]').popover();

	$('.thumbnail.col1').on('mouseenter', function () {
		$("#patching_info").css('display', 'block');
	});
	$('.thumbnail.col2').on('mouseenter', function () {
		$("#pass_info").css('display', 'block');
	});
	$('.thumbnail.col3').on('mouseenter', function () {
		$("#cust_info").css('display', 'block');
	});
	$(".thumbnail").on('mouseleave', function () {
		$(".info_box").css('display', 'none');
	});
});

function timerIncrement() {
	idleTime = idleTime + 1;
	
	if (idleTime > 600) { // 10 minutes
		alert('Session Expired!');
        window.location.href = "/";
    }
}
