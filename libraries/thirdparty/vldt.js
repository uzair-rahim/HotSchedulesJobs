var vldt = new function(){

	this.alpha = /^[A-Za-z]/;
	this.alphanumeric = /^[A-Za-z0-9]/;
	this.date = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
	this.email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
	this.numeric = /^[0-9]$/;
	this.phone = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
	this.zip = /^[0-9]{5}$/;

	this.valid = false;
	this.response = new Object();
	
	this.validate = function(obj){
		var size = 0;
		var keys = [];
		var values = [];
		this.response = {};
		
		for(var key in obj){
			keys.push(key);
			values.push(obj[key]);
			size++;
		}

		for(var i = 0; i <size; i++){
			switch(values[i]){
				case "alpha" :
					this.response[keys[i]] = this.isAlpha($(keys[i]).val());
				break;
				case "alphanumeric" :
					this.response[keys[i]] = this.isAlphaNumeric($(keys[i]).val());
				break;
				case "dropdown" :
					this.response[keys[i]] = this.isDropdown($(keys[i]).attr("data-dropdown"));
				break;
				case "date" :
					this.response[keys[i]] = this.isDate($(keys[i]).val());
				break;
				case "email" :
					this.response[keys[i]] = this.isEmail($(keys[i]).val());
				break;
				case "exactlength" :
					this.response[keys[i]] = this.exactLength($(keys[i]).val());
				break;
				case "numeric" :
					this.response[keys[i]] = this.isNumeric($(keys[i]).val());
				break;
				case "phone" :
					this.response[keys[i]] = this.isPhone($(keys[i]).val());
				break;
				case "minlength" :
					this.response[keys[i]] = this.minLength($(keys[i]).val());
				break;
				case "maxlength" :
					this.response[keys[i]] = this.maxLength($(keys[i]).val());
				break;
				case "required" :
					this.response[keys[i]] = this.isRequired($(keys[i]).val());
				break;
				case "zip" :
					this.response[keys[i]] = this.isZip($(keys[i]).val());
				break;
			}
		}

		return this.valid();

	};

	this.getErrors = function(){
		return this.response;
	}

	this.valid = function(){
		for(var key in this.response){
			if(this.response[key] === false){
				return false;
			}
		}

		return true;
	}

	this.isAlpha = function(val){
		return this.alpha.test(val);
	}

	this.isAlphaNumeric = function(val){
		return this.alphanumeric.test(val);
	}

	this.isDropdown = function(val){
		return val !== undefined;
	};

	this.isDate = function(val){
		return this.date.test(val);
	};

	this.isEmail = function(val){
		return this.email.test(val);
	};

	this.exactLength = function(val, length){
		return val.length == length;
	};

	this.isNumeric = function(val){
		return this.numeric.test(val);
	};

	this.isPhone = function(val){
		return this.phone.test(val);
	};

	this.minLength = function(val, length){
		return val.length >= length;
	};

	this.maxLength = function(val, length){
		return val.length <= length;
	};

	this.isRequired = function(val){
		return val.length > 0;
	};

	this.isZip = function(val){
		return this.zip.test(val);
	};

}