var inputs = document.getElementByTagName("input");
var email = inputs[0];
var btn_rec_pass = document.getElementById("btn_rec_pass");
var email_err = document.getElementById("email_err");


btn.addEventListener("click", function() {
	makeAjaxRequest(
	{
		"email":email.value,
	},
	"/path",
	function(obj){
		email_err.innerHTML = '';

		if (obj.status == "ok"){


		}
		else
		{
			email_err.innerHTML = obj.status;
		}
	}
	);
});
