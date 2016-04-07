/**
 * storageManager
 * 
 * Module responsible for storing data values into temporary and permanent storage.
 * Also defines data objects (Item, Features).
 */

// Global database reference to store Item Objects and raw values
var RAW_DATABASE;

// Global database reference to store Feature Objects and computer feature values
var FEATURE_DATABASE;

// TODO remove, this is only for validation of smallwindow values
var TEMP_FEATURE_DATABASE;

// Object representing processed data
function Features(){
	this.mvm = null;
	this.sdvm = null;
	this.mangle = null;
	this.sdangle = null;
	this.p625 = null;
	this.df = null;
	this.fpdf = null;
	this.largeWindow = null;
	this.timestamp = null;
}

// Structure of a single data item representing raw data
function Item(){
	this.steps = null;
	this.heartrate = null;
	this.accelX = null;
	this.accelY = null;
	this.accelZ = null;
	this.gyroA = null;
	this.gyroB = null;
	this.gyroC = null;
	this.locLat = null;
	this.locLon = null;
	this.uv = null;
	this.pressure = null;
	this.timestamp = null;
	this.battery = null;
	this.watchID = null;
	this.features = null;
}


/**
 * Saves a provided heartrate into temporary storage
 * @param heartrate
 */
function saveHeartrate(heartrate){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.heartrate", heartrate);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 */
function clearHeartrate(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.heartrate");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 * @param accel
 */
function saveAccel(accel){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.accelX", accel[0]);
		sessionStorage.setItem("com.uf.agingproject.accelY", accel[1]);
		sessionStorage.setItem("com.uf.agingproject.accelZ", accel[2]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 */
function clearAccel(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.accelX");
		sessionStorage.removeItem("com.uf.agingproject.accelY");
		sessionStorage.removeItem("com.uf.agingproject.accelZ");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 * @param gyro
 */
function saveGyro(gyro){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.gyroA", gyro[0]);
		sessionStorage.setItem("com.uf.agingproject.gyroB", gyro[1]);
		sessionStorage.setItem("com.uf.agingproject.gyroC", gyro[2]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 */
function clearGyro(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.gyroA");
		sessionStorage.removeItem("com.uf.agingproject.gyroB");
		sessionStorage.removeItem("com.uf.agingproject.gyroC");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 * @param coords
 */
function saveCoordinates(coords){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.locLat", coords[0]);
		sessionStorage.setItem("com.uf.agingproject.locLon", coords[1]);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 */
function clearCoordinates(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.locLat");
		sessionStorage.removeItem("com.uf.agingproject.locLon");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 * @param battery
 */
function saveBattery(battery){
	if ("sessionStorage" in window) {
		sessionStorage.setItem("com.uf.agingproject.battery", battery);
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * 
 */
function clearBattery(){
	if ("sessionStorage" in window) {
		sessionStorage.removeItem("com.uf.agingproject.battery");
	}
	else {
		console.log("no sessionStorage in window");
	}
}

/**
 * Clears everything but battery, since its OK to hold the previous value.
 */
function clearSessionData(){
	clearAccel();
	//clearBattery();
	clearCoordinates();
	clearGyro();
	clearHeartrate();
}

/**
 * 
 * @param json
 */
function storeConfig(json){
	localStorage.setItem("com.uf.agingproject.config", JSON.stringify(json));
}

/**
 * 
 */
function storeData(){
	
	var item = Object.create(Item.prototype);
	
	item.heartrate = sessionStorage.getItem("com.uf.agingproject.heartrate");
	item.accelX = sessionStorage.getItem("com.uf.agingproject.accelX");
	item.accelY = sessionStorage.getItem("com.uf.agingproject.accelY");
	item.accelZ = sessionStorage.getItem("com.uf.agingproject.accelZ");

	item.gyroA = sessionStorage.getItem("com.uf.agingproject.gyroA");
	item.gyroB = sessionStorage.getItem("com.uf.agingproject.gyroB");
	item.gyroC = sessionStorage.getItem("com.uf.agingproject.gyroC");

	item.locLat = sessionStorage.getItem("com.uf.agingproject.locLat");
	item.locLon = sessionStorage.getItem("com.uf.agingproject.locLon");
	item.timestamp = formatLocalDate(Date());

	item.battery = sessionStorage.getItem("com.uf.agingproject.battery");

	item.watchID = sessionStorage.getItem("com.uf.agingproject.watchID");
	//console.log("[Matin] Watch-ID is: " + sessionStorage.getItem("com.uf.agingproject.watchID"));
	
	// clears raw data in sessionstorage
	clearSessionData();
	
	addToDB(item);

}


/**
 * Moves raw data stored in sessionStorage to localStorage every x seconds
 */
function startLocalStorageInterval(){
	var rate =  parseInt(localStorage.getItem("com.uf.agingproject.exportRate"));
	var manualRate = 60 * 1000; // Sample at every second
	console.log("setting interval of local storage to " + rate);

	// 33ms means 30Hz sampling rate
	window.setInterval(function(){
		storeData();
	}, manualRate);
}


/**
 * Get the DB instance existing on the watch.
 * This will only actually create a new one if one doesn't already exist.
 * Else it will retrieve the existing one.
 */
function createDBUsingWrapper(){
	RAW_DATABASE = new IDBStore({
		dbVersion: 1,
		storeName: 'data',
		keyPath: 'id',
		autoIncrement: true,
		onStoreReady: function(){
			console.log('RAW_DATABASE ready!');
		}
	});
	
	FEATURE_DATABASE = new IDBStore({
		dbVersion: 1,
		storeName: 'features',
		keyPath: 'id',
		autoIncrement: true,
		onStoreReady: function(){
			console.log('FEATURE_DATABASE ready!');
		}
	});
	
	// TODO remove
	TEMP_FEATURE_DATABASE = new IDBStore({
		dbVersion: 1,
		storeName: 'temp_features',
		keyPath: 'id',
		autoIncrement: true,
		onStoreReady: function(){
			console.log('TEMP_FEATURE_DATABASE ready!');
		}
	});
}

// 

/**
 * Insert a single item to the raw database.
 * 
 * @param item Object
 */
function addToDB(item){
 
	var onsuccess = function(id){
		//console.log('Data is added: ' + id);
	}
	var onerror = function(error){
		console.log('Error', error);
	}
 
	RAW_DATABASE.put(item, onsuccess, onerror);
}

/**
 * Insert a single item to the feature database.
 * 
 * @param item Object
 */
function addFeatureItemToDB(item){
	var onsuccess = function(id){
		//console.log('Data is added: ' + id);
	}
	var onerror = function(error){
		console.log('Error', error);
	}
 
	FEATURE_DATABASE.put(item, onsuccess, onerror);
}

// TODO remove
/**
 * Insert a single item to the temp feature database.
 * 
 * @param item Object
 */
function addTempFeatureItemToDB(item){
	var onsuccess = function(id){
		//console.log('Data is added: ' + id);
	}
	var onerror = function(error){
		console.log('Error', error);
	}
 
	TEMP_FEATURE_DATABASE.put(item, onsuccess, onerror);
}

/**
 * Clears all items in the raw database.
 * Called by export manager after a successful transfer.
 */
function clearDB(){
	console.log("Clearing raw Storage");
	
	var onsuccess = function(){
		console.log("Local Store Cleared");
		//alert("Proceed to the next experiment.");
	}
	
	var onerror = function(error){
		console.log(error);
	}
	
	RAW_DATABASE.clear(onsuccess, onerror);
	
}

function clearFeatureDB(){
	console.log("Clearing feature Storage");
	
	var onsuccess = function(){
		console.log("Feature Store Cleared");
	}

	var onerror = function(error){
		console.log(error);
	}	
	
	FEATURE_DATABASE.clear(onsuccess, onerror);
}

function clearTempFeatureDB(){
	console.log("Clearing temp feature Storage");
	
	var onsuccess = function(){
		console.log("Temp Feature Store Cleared");
	}

	var onerror = function(error){
		console.log(error);
	}	
	
	TEMP_FEATURE_DATABASE.clear(onsuccess, onerror);
}

// DEBUG only call from console
function clearAllDB(){
	clearDB();
	clearFeatureDB();
	clearTempFeatureDB();
}

// used for debugging, dump all local storage to the console
function printAllData(){
	var onsuccess = function(array){
		console.log(array);
		console.log(JSON.stringify(array));
	},
	onerror = function(error){
		console.log(error);
	};
	
	RAW_DATABASE.getAll(onsuccess,onerror);
}

function printAllFeatureData(){
	var onsuccess = function(array){
		console.log(array);
		console.log(JSON.stringify(array));
	},
	onerror = function(error){
		console.log(error);
	};
	
	FEATURE_DATABASE.getAll(onsuccess,onerror);
}

// print how many values are stored in local storage to the console
function printDataCount(){
	var onsuccess = function(array){
		console.log(array.length);
	},
	onerror = function(error){
		console.log(error);
	};
	
	RAW_DATABASE.getAll(onsuccess,onerror);
}

// used by other files to get the correct reference to the database
function getDatabase(){
	return RAW_DATABASE;
}

function getFeatureDatabase(){
	return FEATURE_DATABASE;
}

function getTempFeatureDatabase(){
	return TEMP_FEATURE_DATABASE;
}

/**
 * <b><i>NOT WORKING!</i></b><br><br>
 * <b>An alternative to {@link #clearDB()}.</b><br>
 * Retrieves all the data from local database, and remove them <i>k-</i>item at a time from it.<br>
 * <i>Note: this function is written to address the problem with {@link #clearDB()}.</i>
 * @author matinkheirkhahan
 */
function clearDBIteratively() {
	var k = 150;
	console.log("[MATIN] K is set to " + k + ".");
	var database = getDatabase();
	/*database.deleteDatabase(function(){}, function(error){
		console.log("[MATIN] error in deleting the database. " + error);
	});*/
	var onsuccess = function(retrivedArray){
		console.log("[MATIN] clearDBItertively has started.");
		clearDBRecursively(retrivedArray, k);
		console.log("[MATIN] Clearing DB in iterative mode complete");
	},

	onerror = function(error){
		console.log(error);
	};

	database.getAll(onsuccess, onerror);
}

/**
 * <b>Private Function.</b>::Used in {@link #clearDBIteratively}.<br><br>
 * Recursively selects <i>k</i> rows and deletes them from the database.
 * @param retrivedArray
 * @author matinkheirkhahan
 */
function clearDBRecursively(retrivedArray, k) {
	if (retrivedArray.length == 0){
		console.log("[MATIN] (clearDBRecursively) no more data to delete from database.");
	}

	var dataArray = [];

	while(dataArray.length < k && retrivedArray.length > 0){
		dataArray.push(retrivedArray[0]);
		retrivedArray.shift();
	}
	RAW_DATABASE.removeBatch(dataArray, function(){
		console.log("[MATIN] A data array was removed from database (batch mode).");
	}, function(error) {
		console.log("[MATIN] data array could not be removed (batch mode). " + error);
	});
	clearDBRecursively(retrivedArray, k);
}