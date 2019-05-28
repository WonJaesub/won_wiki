function signupFunction() {
	var form = $('#signupform');
	var pass = $('#passwordInput').val();
	var pass2 = $('#passwordInput2').val();
	
	if(pass !== pass2) {
		alert("パスワードを確認してください");
		return false;
	} else {
		form.submit();
	}
}
$(function() {
	$(".wiki-heading").click(function(){
		var t=$(this);
		if(t.next().is(':visible'))
		{
			t.addClass('wiki-heading-content-folded');
			t.next().css('display', 'none');
		}
		else
		{
			t.removeClass('wiki-heading-content-folded');
			t.next().css('display', 'block');
		}
	});
	
	
});