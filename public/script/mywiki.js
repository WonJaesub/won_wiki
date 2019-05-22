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