// TODO Complete this file as described by the README.md
// Do NOT modify any files outside of this.

let hasLoadedFriendsAndFamilyData = false;

function askQuestion() {
	document.getElementById("questionArea").style.visibility = "visible";
}

function submitQuestion() {
	console.log(document.getElementById("questionField").value);
}

function addPizzazz() {
	document.getElementsByName("sayingOfTheDay")[0].style.color = "purple";
	document.getElementsByName("sayingOfTheDay")[0].style.fontStyle = "italic";
	document.getElementsByName("sayingOfTheDay")[0].style.textDecoration = "underline";
}

function saveBalance() {
	var val = document.getElementById("balanceInput").value;
	if ( val == '' || !val.trim() ){ 
		console.log("Cannot update balance, syntax error!")
	}
	else{ 
		val = Number(val)
		if (isNaN(val)){
			console.log("Cannot update balance, syntax error!")
		} else {
			document.getElementById("balance").innerHTML = val;
		}
	}
	
}

function printBalance() {
	let val = document.getElementById("balance").innerHTML
	console.log('You have ' + val + ' in your account!');
}

function alertBalance() {
	var val = document.getElementById("balance").innerHTML
	val = Number(val)
	if ( val < 0){
		alert(":(")
	} else if (val > 0 && val <= 100){
		alert(":)")
	} else {
		alert(":D")
	}
}

function loadFriendsAndFamilyData() {

	if (hasLoadedFriendsAndFamilyData) {
		return;
	} else {
		hasLoadedFriendsAndFamilyData = true;
	}

	let friendsAndFamilyAccounts = [
		{
			name: "Jane McCain",
			balance: 7262.71
		},
		{
			name: "Bill Phil",
			balance: 9830.02
		},
		{
			name: "Tod Cod",
			balance: 0.03
		},
		{
			name: "Karen Marin",
			balance: 72681.01
		}
	];
	for (i=0; i<friendsAndFamilyAccounts.length; i++){
		var table = document.getElementById("friendsAndFamilyBalances");
		var row = table.insertRow();
		var cell1 = row.insertCell();
		cell1.innerHTML = friendsAndFamilyAccounts[i].name;
		var cell2 = row.insertCell();
		cell2.innerHTML = friendsAndFamilyAccounts[i].balance;
		if (friendsAndFamilyAccounts[i].balance < 1){ 
			row.style.color = "red"
		}	
	}
	

}

function addPersonalTransactionRows() {
	
	var request = new XMLHttpRequest()
	request.open('GET', 'http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transactions?amount=4', true)
	
	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response)
		if (request.status >= 200 && request.status < 400) {

			var table = document.getElementById("personalTransactions");

			for (i=0; i<4; i++){
				var row = table.insertRow();
				var cell1 = row.insertCell();
				cell1.innerHTML = data[i].date;
				var cell2 = row.insertCell();
				cell2.innerHTML = data[i].company;
				var cell3 = row.insertCell();
				cell3.innerHTML = data[i].amount;
			}
		}
		else {
			console.log('error')}
	}
	request.send()	
}

function clearPersonalTransactionRows() {
	var table = document.getElementById("personalTransactions");
	var rowlen = table.rows.length;
	for (i=1; i<rowlen; i++){
		table.deleteRow(i);
		rowlen--;
		i--;
	}
}
