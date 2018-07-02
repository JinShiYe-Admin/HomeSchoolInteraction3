//对需要的数据，进行签名

var RSAEncrypt = (function(mod) {
	mod.enctype = function(encryptStr) {
		var shakeHand = store.get(window.storageKeyName.SHAKEHAND);
		//加密
		setMaxDigits(129);
		var key00 = new RSAKeyPair(shakeHand.Exponent, '', shakeHand.Modulus);
		var temp11 = encryptedString(key00, encryptStr);
		return temp11;
	};
	return mod;
})(RSAEncrypt || {})