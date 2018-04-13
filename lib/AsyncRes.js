/**
 * @description this function sends data to every Response objects in the responseQueue
 * After sending, emptying the queue
 * @param {Response[]} responseQueue- array that contains Response objects you want to send responses  
 * @param {Object} data- data you want to send
 * @return {Promise} it guarantees sending all responses in the queue & emptying the processed responses from queue
 * @promise
 * @resolve {Object[]}- responseQueue after processing
 */
export function processResponseQueue({responseQueue, data, status}) {
    if (!status) {
        status = 200;
    }
    return sendResponseAsync(responseQueue, data)
        .then((arr) => {
            //emptying the queue
            return responseQueue.splice(0, arr.length)
        });

	/**
	 * @description it sends responses parallelly; it means there's no clear sequece among them 
	 * @param {Response[]} responseQueue- array that contains Response objects you want to send responses
	 * @param {Object} data- data you want to send
	 * @return {Promise} it guarantees sending all responses in the queue before resolved
	 * @promise 
	 * @resolve no meaning 
	 */
    function sendResponseAsync(responseQueue, data) {
        return Promise.all(responseQueue.map((res) => {
            return new Promise((resolve) => {
                resolve(res.status(status).json(data));
            })
        }))
    }
}