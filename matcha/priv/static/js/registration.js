var inputs = document.getElementByTagName("input");
var user = inputs[0];
var email = inputs[1];
var fname = inputs[2];
var lname = inputs[3];
var pass = inputs[4];
var repass = inputs[5];
var button = document.getElementById("btn_reg");
var user_err = document.getElementById("user_err");
var email_err = document.getElementById("email_err");
var fname_err = document.getElementById("fname_err");
var lname_err = document.getElementById("lname_err");
var pass_err = document.getElementById("pass");
var repass_err = document.getElementById("repass");

button.addEventListener("click", function() {
	makeAjaxRequest(
	{
		"user": user.value,
		"email": email.value,
		"fname": fname.value,
		"lname": lname.value,
		"pass": pass.value,
		"repass": repass.value
	},
	"/confirm",
	function(obj){
		user_err.innerHTML = '';
		email_err.innerHTML = '';
		fname_err.innerHTML = '';
		lname_err.innerHTML = '';
		pass_err.innerHTML = '';
		repass_err.innerHTML = '';

		if (obj.status == "ok"){

		}
		else if (obj.status == "error"){
				user_err.innerHTML = obj.errors.user;
				email_err.innerHTML = obj.errors.email;
				fname_err.innerHTML = obj.errors.fname;
				lname_err.innerHTML = obj.errors.lname;
				pass_err.innerHTML = obj.errors.pass_err;
				repass_err.innerHTML = obj.errors.repass_err;
		}
	}



	);
});