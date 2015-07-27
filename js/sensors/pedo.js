//<!-- Sample Code by Victor Dibia, Dencycom.com May 16, 2014 -->
var pedometer;

function startPedo() {
	//alert('pedo here');

	pedometer = null;
    var pedometerData = {},
    CONTEXT_TYPE = 'PEDOMETER';

	if (window.webapis && window.webapis.motion !== undefined) {
        pedometer = window.webapis.motion;
        //console.log('Pedometer found');
        start();
    }else {
    	console.log('Pedometer not found');
    }

	 //Start pedomenter ;
	 function getPedometerData(pedometerInfo) {
         var pData = {
             calorie: pedometerInfo.cumulativeCalorie,
             distance: pedometerInfo.cumulativeDistance,
             runDownStep: pedometerInfo.cumulativeRunDownStepCount,
             runStep: pedometerInfo.cumulativeRunStepCount,
             runUpStep: pedometerInfo.cumulativeRunUpStepCount,
             speed: pedometerInfo.speed,
             stepStatus: pedometerInfo.stepStatus,
             totalStep: pedometerInfo.cumulativeTotalStepCount,
             walkDownStep: pedometerInfo.cumulativeWalkDownStepCount,
             walkStep: pedometerInfo.cumulativeWalkStepCount,
             walkUpStep: pedometerInfo.cumulativeWalkUpStepCount,
             walkingFrequency: pedometerInfo.walkingFrequency
         };

         pedometerData = pData;
         return pData;
     }

     /**
      * Return last received motion data
      * @return {object}
      */
     function getData() {
         return pedometerData;
     }

     /**
      * Reset pedometer data
      */
     function resetData() {
         pedometerData = {
             calorie: 0,
             distance: 0,
             runDownStep: 0,
             runStep: 0,
             runUpStep: 0,
             speed: 0,
             stepStatus: '',
             totalStep: 0,
             walkDownStep: 0,
             walkStep: 0,
             walkUpStep: 0,
             walkingFrequency: 0
         };
     }

     /**
      * @param {PedometerInfo} pedometerInfo
      * @param {string} eventName
      */
     function handlePedometerInfo(pedometerInfo, eventName) {
    	 pedometerData = getPedometerData(pedometerInfo)
    	 console.log('Total Steps : ' + pedometerData.totalStep);
    	 document.getElementById("steps").innerHTML = pedometerData.totalStep;
    	 saveSteps(pedometerData.totalStep);
    	 
    	 //document.getElementById("calories").innerHTML = 'Calories Burnt : ' + pedometerData.calorie;
     }

     /**
      * Registers a change listener
      * @public
      */
     function start() {
         resetData();
         sessionStorage.setItem("com.uf.agingproject.pedoInterval","-1");
         pedometer.start(
             CONTEXT_TYPE,
             function onSuccess(pedometerInfo) {
                 handlePedometerInfo(pedometerInfo, 'pedometer.change');
             }
         );
     }

     /**
      * Unregisters a change listener
      * @public
      */
     function stop() {
         pedometer.stop(CONTEXT_TYPE);
     }

     /**
      * Initializes the module
      */
}

function stopPedo(){
	if(pedometer){
		pedometer.stop('PEDOMETER');
	}
	
	document.getElementById("steps").innerHTML = "OFF";
	sessionStorage.removeItem("com.uf.agingproject.pedoInterval");
	clearSteps();
}
