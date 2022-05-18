const db = {};
const data = new Map();

const LOCAL_DB_CACHE_NAME = "local_db";

db.set = async (key, value) => {
	data.set(key, value);
	db.saveLocal();
	if ((await db.setOnline(key, value)) === 1) {
		let iId = setInterval(async () => {
			if ((await db.setOnline(key, value)) === 0) clearInterval(iId);
		}, 10000);
	}
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
		if (!data.has(value.key)) {
			if (data.get(value.key) == value.value) return;
			data.set(value.key, value.value);
			newData = true;
		}
	});

	if (newData === true) {
		db.saveLocal();
	}

	// Override the online data with the local data if the local data is newer than the online data
	if (newData === false) {
		let done = [];
		resData.forEach(async (value) => {
			if (data.get(value.key) == value.value) return;
			done.push(value.key);
			await db.setOnline(value.key, data.get(value.key));
			console.log("Found local var thats newer than the offline one: ", value.key);
		});

		// Set all variables that only exist offline
		data.forEach(async (value, key) => {
			console.log("Data ", key);
			if (done.includes(key)) return;
			await db.setOnline(key, value);
			console.log("Found var thats only offline: ", key);
		});
	}
};

db.setOnline = async (key, value) => {
	try {
		await fetch("/api/data/setUserData", {
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
	} catch (error) {
		console.log(error);
		return 1;
	}
	return 0;
};

db.load();
