const db = {};
const data = new Map();

const LOCAL_DB_CACHE_NAME = "local-db";

db.set = (key, value) => {
	data.set(key, value);
	db.saveLocal();
	fetch("/api/data/setUserData", {
		method: "post",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			key,
			value,
		}),
	});
};

db.get = (key) => {
	return data.get(key);
};

db.saveLocal = () => {
	let newData = [];
	data.forEach((value, key) => {
		newData.push({ key, value });
	});
	localStorage.setItem(LOCAL_DB_CACHE_NAME, JSON.stringify(newData));
};

db.load = async () => {
	let newData = JSON.parse(localStorage.getItem(LOCAL_DB_CACHE_NAME) || "[]");
	newData.forEach((value) => {
		data.set(value.key, value.value);
	});

	const resData = await (
		await fetch("/api/data/getAllUserData", {
			method: "get",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
			},
		})
	).json();

	if (resData.error) {
		console.log("Error: ", resData.error);
		return;
	}

	newData = false;
	resData.forEach((value) => {
		if (data.has(value.key)) {
			data.set(value.key, value.value);
			newData = true;
		}
	});

	if (newData === true) {
		db.saveLocal();
	}
};

db.load();
