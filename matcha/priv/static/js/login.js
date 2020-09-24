var inputs = document.getElementByTagName("input");
var login = inputs[0];
var pass = inputs[1];
var btn_log = document.getElementById("btn_log");
var log_err = document.getElementById("log_err");
var pass_err = document.getElementById("pass_err");

btn_log.addEventListener("click", function(){
	makeAjaxRequest(
	{
		"login":login.value,
		"pass":pass.value
	},
	"redirect on page",
	functon(obj){
		log_err.innerHTML = '';
		pass_err.innerHTML = '';

		if (obj.status == "ok"){

		}

		else if (obj.status == "error"){

		}
	}

	);
});
